// components/CharacterStickySection.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import Fridge from "./fridge"; // ✅ 냉장고 컴포넌트 import
import Image from "next/image";

// 슬라이드 타입
export type Slide = {
  name: string;
  bg?: string;
  cam: { x: number; y: number; scale: number };
};

export type CharacterInfo = {
  id: string;
  name: string;
  description?: string;
};

type Props = {
  slides: Slide[];
  vhPages?: number;
  characters?: CharacterInfo[];
};

export default function CharacterStickySection({
  slides,
  vhPages = 7,
  characters,
}: Props) {
  if (!slides || slides.length === 0) return null;

  const ref = useRef<HTMLDivElement>(null);

  // 스크롤 진행도
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 페이즈
  const enterT = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const holdT = useTransform(scrollYProgress, [0.2, 1], [0, 1]);

  // y 이동
  const yPx = useTransform(
    enterT,
    (a) => a * (typeof window !== "undefined" ? window.innerHeight : 0)
  );
  const y = useSpring(yPx, { stiffness: 280, damping: 28 });

  // stage 계산 (0 ~ slides.length → 마지막은 복귀 stage)
  const stageMV = useTransform(holdT, (v) => {
    const idx = Math.round(v * slides.length);
    return Math.max(0, Math.min(slides.length, idx));
  });

  const [stageNum, setStageNum] = useState(0);
  useMotionValueEvent(stageMV, "change", (v) => {
    const n = Math.round(v);
    if (n !== stageNum) setStageNum(n);
  });

  // 배경색
  const bgColors = slides.map((s) => s.bg ?? "#f6f6f6");
  const bg = useTransform(stageMV, (idx) =>
    idx >= slides.length ? "#f6f6f6" : bgColors[idx]
  );

  const dots = useMemo(
    () => Array.from({ length: slides.length - 1 }),
    [slides.length]
  );

  return (
    <section
      className="hidden md:block"
      ref={ref}
      style={{ height: `calc(${slides.length + 2} * 100vh)` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y, background: bg }}>
          <div className="h-screen w-screen grid place-items-center">
            <StageCanvas
              stageMV={stageMV}
              stageNum={stageNum}
              slides={slides}
              characters={characters}
            />
          </div>

          {/* 우측 인디케이터 (마지막에는 숨김) */}
          {stageNum > 0 && stageNum < slides.length && (
            <div className="absolute bottom-[37.5%] right-[5%] flex flex-col gap-6 pointer-events-none">
              {dots.map((_, i) => (
                <Dot key={i} idx={i + 1} stageMV={stageMV} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/** 점 네비 */
function Dot({ idx, stageMV }: { idx: number; stageMV: MotionValue<number> }) {
  const color = useTransform(stageMV, (s) =>
    s === idx ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.28)"
  );
  return (
    <motion.span
      className="h-3.5 w-3.5 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

/** 무대 */
function StageCanvas({
  stageMV,
  stageNum,
  slides,
  characters,
}: {
  stageMV: MotionValue<number>;
  stageNum: number;
  slides: Slide[];
  characters?: CharacterInfo[];
}) {
  const isFirst = stageNum === 0;
  const isLast = stageNum === slides.length;

  // 기본 cam (원위치)
  const baseCam = { x: 600, y: 130, scale: 1 };

  // cam 배열 (슬라이드 cam + 마지막 복귀 cam)
  const cams = [...slides.map((s) => s.cam), baseCam];

  // stageMV를 cam 좌표로 매핑
  const camX = useTransform(
    stageMV,
    cams.map((_, i) => i),
    cams.map((c) => c.x)
  );
  const camY = useTransform(
    stageMV,
    cams.map((_, i) => i),
    cams.map((c) => c.y)
  );
  const camScale = useTransform(
    stageMV,
    cams.map((_, i) => i),
    cams.map((c) => c.scale)
  );

  // spring 적용
  const x = useSpring(camX, { stiffness: 100, damping: 20 });
  const y = useSpring(camY, { stiffness: 100, damping: 20 });
  const scale = useSpring(camScale, { stiffness: 100, damping: 20 });

  return (
    <div className="relative w-full h-full bg-[#f6f6f6] overflow-hidden">
      {/* 냉장고 (하나만 렌더링) */}
      <motion.div style={{ x, y, scale }} className="relative z-40">
        <Fridge stageNum={stageNum} slidesLength={slides.length} />
      </motion.div>

      {/* 첫 슬라이드 텍스트 */}
      {isFirst && (
        <motion.div
          className="absolute right-[10%] bottom-[25%] text-left"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[#FF4545] font-extrabold leading-tight md:text-[60px] lg:text-[100px]">
            Hello!
            <br />
            We&apos;re
            <br />
            MAF Family
          </p>
          <p className="mt-2 text-gray-400 font-thin text-[18px]">
            Characters from Marketer&apos;s fridge
          </p>
        </motion.div>
      )}

      {/* 중간 슬라이드 캐릭터 소개 */}
      {stageNum > 0 && stageNum < slides.length && (
        <div>
          <SketchText characters={characters} stage={stageNum} />
        </div>
      )}

      {/* 마지막 화면 */}
      {isLast && (
        <div className=" absolute inset-0 flex flex-col items-center justify-center">
          <p className="absolute z-0  top-20 font-bold text-center text-[220px] text-[#E4E4E4] pointer-events-none">
            {"Marketer's Fridge"}
          </p>
          <div className="absolute z-60 bottom-40 flex w-1/2 justify-center gap-100">
            <Link href="/" passHref>
              <button className="relative cursor-pointer z-60  px-4 py-2 bg-black text-white font-bold rounded-md hover:bg-gray-800 flex items-center gap-2">
                🏠 홈으로 돌아가기
              </button>
            </Link>
            <Link href="/service" passHref>
              <button className="relative cursor-pointer z-60  px-4 py-2 bg-[#868686] text-white font-bold rounded-md hover:bg-gray-400 flex items-center gap-2">
                🔄 서비스 소개 다시보기
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/** 캐릭터 소개 */
function SketchText({
  characters,
  stage,
}: {
  characters?: CharacterInfo[];
  stage: number;
}) {
  if (!characters || characters.length === 0) return null;
  const cur = characters[(stage - 1) % characters.length];

  const lines =
    cur?.description
      ?.split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  return (
    <div className="absolute z-50  top-[20%] right-[20%] w-[470px]  text-center bg-transparent rounded-2xl">
      <div className="text-left z-10 relative w-full px-[8%] pt-[15%]">
        {cur?.name && (
          <p className="space-y-3 pb-1 text-[24px] font-bold border-b-[1.7px] border-[#C6C6C6] mb-2 ">
            {cur.name}
          </p>
        )}
        {lines.length > 0 ? (
          <ul className=" space-y-3 text-[16.5px] text-gray-800">
            {lines.slice(0, 5).map((ln, i) => (
              <li key={i} className="py-1.5 border-b-[1.7px] border-[#C6C6C6]">
                {ln}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[18px] text-gray-400">소개 문구가 아직 없어요.</p>
        )}
      </div>
      <Image
        width={500}
        height={600}
        alt="dd"
        src="/icons/character/sketch.png"
        className="w-full rounded-2xl absolute z-0 top-0 shadow-2xl"
      ></Image>
    </div>
  );
}
