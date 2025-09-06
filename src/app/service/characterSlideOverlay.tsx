// components/CharacterStickySection.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
  useMotionValueEvent,
} from "framer-motion";
import Image from "next/image";

/** ▶ 슬라이드 1칸 = 화면을 꽉 채운 상태에서 보일 ‘장면’(카메라 포커스/배경색 등) */
export type Slide = {
  name: string;
  image?: string; // 큰 배경(없으면 fallback)
  bg?: string; // 각 장면 배경색
  cam: { x: number; y: number; scale: number }; // 카메라 포커스
};

/** ▶ 스케치 카드에 뿌릴 캐릭터 텍스트 */
export type CharacterInfo = {
  id: string;
  name: string;
  tags?: string[];
  imageUri?: string;
  description?: string; // 여러 줄은 \n 구분
};

type Props = {
  slides: Slide[];
  /** sticky 섹션 높이(뷰포트 배수). 입장 1 + 슬라이드 3 = 4 추천 */
  vhPages?: number; // default 4
  /** 2번째 슬라이드부터 오른쪽 종이에 뿌릴 캐릭터 텍스트 */
  characters?: CharacterInfo[];
  /** 배경 기본 이미지(슬라이드 image 없을 때 fallback) */
  fallbackImage?: string; // default "/icons/character/default.png"
};

/**
 * 스크롤-구동 sticky 시트:
 * - 섹션 진입(0~0.2): 아래→위로, 스크롤한 만큼만 올라옴(덮는 느낌)
 * - 꽉 차면(>=0.2): 내부 슬라이드(stage) 진행
 * - 섹션 밖으로 나가면 아래 섹션(푸터 등) 자연스럽게 이어짐
 */
export default function CharacterStickySection({
  slides,
  vhPages = 7,
  characters,
  fallbackImage = "/icons/character/default.png",
}: Props) {
  if (!slides || slides.length === 0) return null;

  const ref = useRef<HTMLDivElement>(null);

  // 이 섹션의 스크롤 진행도 (0~1)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"], // 시작이 화면 하단에서 0, 끝이 화면 상단에서 1
  });

  // 페이즈: 0~0.2 입장, 0.2~1 내부 슬라이드
  const enterT = useTransform(scrollYProgress, [0, 0.2], [1, 0]); // 1→0
  const holdT = useTransform(scrollYProgress, [0.2, 1], [0, 1]); // 0→1

  // 시트 y: ‘입장’만 반영 (퇴장 없음 → 아래 섹션으로 이어짐)
  const yPx = useTransform(
    enterT,
    (a) => a * (typeof window !== "undefined" ? window.innerHeight : 0)
  );
  const y = useSpring(yPx, { stiffness: 280, damping: 28 });

  // 슬라이드 인덱스: holdT(0~1) → 0~(slides-1)
  const stageMV = useTransform(holdT, (v) => {
    const idx = Math.round(v * Math.max(0, slides.length - 1));
    return Math.max(0, Math.min(slides.length - 1, idx));
  });

  // ⚠️ 핵심: MotionValue를 React state로 구독해서 리렌더 유도
  const [stageNum, setStageNum] = useState(0);
  useMotionValueEvent(stageMV, "change", (v) => {
    const n = Math.round(v);
    if (n !== stageNum) setStageNum(n);
  });

  // 배경색(슬라이드별) — 이것도 motion으로 부드럽게
  const bgColors = slides.map((s) => s.bg ?? "#f6f6f6");
  const bg = useTransform(stageMV, (idx) => bgColors[idx]);

  const dots = useMemo(
    () => Array.from({ length: slides.length }),
    [slides.length]
  );

  return (
    <section
      className="hidden md:block"
      ref={ref}
      style={{ height: `calc(${slides.length + 1} * 100vh)` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y, background: bg }}
          aria-roledescription="vertical slide gallery"
        >
          {/* 본문: 중앙 무대 */}
          <div className="h-screen w-screen grid place-items-center">
            <StageCanvas
              slides={slides}
              stage={stageNum} // ✅ 숫자 stage로 렌더 트리거
              fallbackImage={fallbackImage}
              characters={characters}
            />
          </div>

          {/* 하단 점 네비 (현재 장면 표시) */}
          <div className="absolute bottom-[37.5%] right-[5%] flex flex-col justify-center gap-6 pointer-events-none">
            {dots.map((_, i) => (
              <Dot key={i} idx={i} stageMV={stageMV} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** 점 네비 하나 (motion으로 색만 바꿔서 부드럽게) */
function Dot({ idx, stageMV }: { idx: number; stageMV: MotionValue<number> }) {
  const color = useTransform(stageMV, (s) =>
    s === idx ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.28)"
  );
  return (
    <motion.span
      className="h-3.5 w-3.5 rounded-full inline-block"
      style={{ backgroundColor: color, zIndex: 10 }}
    />
  );
}

/** ▶ 중앙 무대: 큰 배경(이미지) + 카메라 포커스 + (2번째 슬라이드부터) 오른쪽 스케치 카드 */
function StageCanvas({
  slides,
  stage,
  fallbackImage,
  characters,
}: {
  slides: Slide[];
  stage: number; // ✅ 숫자
  fallbackImage: string;
  characters?: CharacterInfo[];
}) {
  const slide = slides[stage];
  const cam = slide?.cam ?? { x: 50, y: 50, scale: 1 };
  const src = slides[0].image ?? fallbackImage;
  const isFirst = stage === 0;

  return (
    <div className="relative w-full h-full">
      {/* 하나의 큰 배경에 카메라만 이동 */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          ["--cam-x" as any]: `${cam.x}%`,
          ["--cam-y" as any]: `${cam.y}%`,
          ["--cam-scale" as any]: cam.scale,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          zIndex: 1,
          backgroundImage: `url(${src})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "var(--cam-x) var(--cam-y)",
          backgroundSize: "calc(var(--cam-scale) * 125%) auto",
          willChange: "background-position, background-size",
        }}
        aria-label={slide?.name ?? "slide"}
      />

      {/* 첫 슬라이드 문구 */}
      {isFirst && (
        <motion.div
          key="first-copy"
          className="absolute z-20"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{
            zIndex: 0,
            right: "20.3%",
            top: "20%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            maxWidth: "min(38vw, 520px)",
          }}
        >
          <div className="rounded-2xl px-4 py-2 ">
            <p className="text-[#FF4545] font-extrabold leading-33 text-[120px] text-left">
              Hello
              <br />
              {"\b \b \b \b We're"}
              <br />
              {"\b Family"}
            </p>
            <p className="text-[#FF4545] font-thin leading-33 text-[18px] text-center">
              Marketer&apos;s fridge character
            </p>
          </div>
        </motion.div>
      )}

      {/* 2번째 슬라이드부터: 오른쪽 스케치 카드 + 텍스트 */}
      {!isFirst && (
        <motion.div
          key={`sheet-${stage}`}
          className="absolute z-30"
          initial={{ opacity: 0, scale: 3.2, x: 16 }}
          animate={{ opacity: 1, scale: 3.2, x: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ right: "30%", top: "40%", pointerEvents: "none" }}
        >
          <div
            style={{ width: "clamp(64px, 12vw, 140px)" }}
            className="relative"
          >
            <Image
              src="/icons/character/sketch.png"
              alt="character note"
              width={500}
              height={500}
              priority
              style={{ width: "100%", height: "auto" }}
              className="shadow-md rounded"
            />
            <SketchText characters={characters} stage={stage} />
          </div>
        </motion.div>
      )}
    </div>
  );
}

/** ▶ 스케치 카드 위 캐릭터 텍스트(2번째 슬라이드부터) */
function SketchText({
  characters,
  stage,
}: {
  characters?: CharacterInfo[];
  stage: number;
}) {
  if (!characters || characters.length === 0 || stage < 1) return null;

  const cur = characters[(stage - 1) % characters.length];
  const lines =
    cur?.description
      ?.split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  return (
    <div
      className="absolute left-0 right-0"
      style={{
        top: "18%", // 종이 내부 시작 높이
        paddingLeft: "6px",
        paddingRight: "6px",
        pointerEvents: "none",
      }}
    >
      {cur?.name && (
        <p className="md:text-[6px] lg:text-[7.5px] font-semibold border-b-[0.5px] border-gray-300 pb-[2px] leading-[1.2]">
          {cur.name}
        </p>
      )}
      <div className="mt-[2px] space-y-[2px]">
        {(lines.length ? lines : ["소개 문구가 아직 없어요."])
          .slice(0, 5)
          .map((ln, i) => (
            <p
              key={i}
              className="md:text-[3.5px] lg:text-[5px] leading-[1.5] border-b-[0.5px] border-gray-200 py-[2px]"
            >
              {ln}
            </p>
          ))}
      </div>
    </div>
  );
}
