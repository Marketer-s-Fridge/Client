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
import Image from "next/image";
import Fridge from "./fridge";

/** 타입들 */
export type Slide = {
  name: string;
  bg?: string;
  cam: { x: number; y: number; scale: number }; // 1592 x 982 기준 비율
};

export type CharacterInfo = {
  id: string;
  name: string;
  description?: string;
};

// cam 타입 별칭
type Cam = Slide["cam"];

/** 캐릭터 슬라이드 데이터 (기본: 1592 x 982 기준) */
export const SLIDES: Slide[] = [
  {
    name: "메인",
    bg: "#f9f9f9",
    cam: { x: 0, y: 0, scale: 1 },
  },
  {
    name: "수박",
    bg: "#f9f9f9",
    cam: { x: 0.25, y: 1.1, scale: 4.5 },
  },
  {
    name: "딸기",
    bg: "#f9f9f9",
    cam: { x: 0, y: 0.45, scale: 4.5 },
  },
  {
    name: "체리",
    bg: "#f9f9f9",
    cam: { x: 0.25, y: -0.2, scale: 4.5 },
  },
  {
    name: "사과",
    bg: "#f9f9f9",
    cam: { x: -0.1, y: -0.2, scale: 4.5 },
  },
  {
    name: "토마토",
    bg: "#f9f9f9",
    cam: { x: 0.15, y: -0.8, scale: 4.5 },
  },
];

/**
 * 해상도별 cam override
 * key: "widthxheight"
 * 값: 각 슬라이드 인덱스별 cam 배열
 */
const CAM_OVERRIDES: Record<string, Cam[]> = {
  /** 1366 x 1024 (iPad Pro 가로) */
  "1366x1024": [
    { x: 0, y: 0, scale: 1 }, // 메인
    { x: 0.2, y: 0.55, scale: 4.4 }, // 수박
    { x: -0.08, y: 0.1, scale: 4.4 }, // 딸기
    { x: 0.225, y: -0.3, scale: 4.4 }, // 체리
    { x: -0.1, y: -0.3, scale: 4.4 }, // 사과
    { x: 0.1, y: -0.75, scale: 4.4 }, // 토마토
  ],

  /** 1920 x 1080 (FHD 데스크탑) */
  "1920x1080": [
    { x: -0.025, y: 0, scale: 1 }, // 메인
    { x: 0.3, y: 0.95, scale: 4.7 }, // 수박
    { x: 0, y: 0.35, scale: 4.7 }, // 딸기
    { x: 0.26, y: -0.25, scale: 4.7 }, // 체리
    { x: -0.12, y: -0.25, scale: 4.7 }, // 사과
    { x: 0.17, y: -0.85, scale: 4.7 }, // 토마토
  ],

  /** 1024 x 768 (4:3 가로 모니터/태블릿) */
  "1024x768": [
    { x: 0, y: 0, scale: 1 }, // 메인
    { x: 0.24, y: 0.9, scale: 4.3 }, // 수박
    { x: -0.02, y: 0.35, scale: 4.3 }, // 딸기
    { x: 0.25, y: -0.05, scale: 4.3 }, // 체리
    { x: -0.08, y: -0.05, scale: 4.3 }, // 사과
    { x: 0.13, y: -0.55, scale: 4.3 }, // 토마토
  ],
};

/** 현재 viewport 에 맞는 cam 선택 */
function getCamForSlide(
  slideIndex: number,
  viewport: { width: number; height: number }
): Cam {
  const key = `${viewport.width}x${viewport.height}`;
  const overrideList = CAM_OVERRIDES[key];

  const baseCam = SLIDES[slideIndex].cam;

  if (!overrideList) return baseCam;

  const overrideCam = overrideList[slideIndex];
  if (!overrideCam) return baseCam;

  return overrideCam;
}

type Props = {
  characters?: CharacterInfo[];
};

export default function CharacterStickySection({ characters }: Props) {
  const slides = SLIDES;
  const hasSlides = slides.length > 0;

  const ref = useRef<HTMLDivElement>(null);

  // 화면 높이 (SSR / 클라 첫 렌더 동일하게 0에서 시작)
  const [screenH, setScreenH] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenH(window.innerHeight);
    }
  }, []);

  // 스크롤 진행도
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 초기 진입 구간 / 이후 hold 구간
  const enterT = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const holdT = useTransform(scrollYProgress, [0.2, 1], [0, 1]);

  // Y 이동 (위에서 아래로 진입) - screenH 상태 사용
  const yPx = useTransform(enterT, (a) => a * screenH);
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

  if (!hasSlides) {
    return null;
  }

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
            <div className="z-50 absolute bottom-[37.5%] right-[5%] flex flex-col gap-6 pointer-events-none">
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

/** 점 네비게이션 */
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

  // 뷰포트 크기 (SSR/클라 첫 렌더 동일하게 0,0에서 시작)
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isPortrait = viewport.height > viewport.width;

  // 마지막 복귀 위치용 cam
  const baseCamRatio = { x: 0.3, y: 0, scale: 0.8 };

  // Y 기준 길이 (가로/세로 중 짧은 쪽 사용)
  const baseForY = Math.min(
    viewport.width || 1,
    viewport.height || 1
  );

  // cams 계산 (stage 0 ~ slides.length, 마지막은 복귀 cam)
  const cams = [
    // stage 0: 메인 (slides[0])
    (() => {
      const cam = getCamForSlide(0, viewport);
      return {
        x: viewport.width * cam.x,
        y: baseForY * cam.y,
        scale: cam.scale,
      };
    })(),

    // stage 1 ~ slides.length-1: 나머지 캐릭터 슬라이드
    ...slides.slice(1).map((_, i) => {
      const slideIndex = i + 1; // SLIDES 인덱스
      const cam = getCamForSlide(slideIndex, viewport);
      return {
        x: viewport.width * cam.x,
        y: baseForY * cam.y,
        scale: cam.scale,
      };
    }),

    // stage = slides.length: 마지막 복귀 cam
    {
      x: viewport.width * baseCamRatio.x,
      y: baseForY * baseCamRatio.y,
      scale: baseCamRatio.scale,
    },
  ];

  // stageMV → cam 좌표 매핑
  const indexes = cams.map((_, i) => i);
  const camX = useTransform(
    stageMV,
    indexes,
    cams.map((c) => c.x)
  );
  const camY = useTransform(
    stageMV,
    indexes,
    cams.map((c) => c.y)
  );
  const camScale = useTransform(
    stageMV,
    indexes,
    cams.map((c) => c.scale)
  );

  // 스무딩 (항상 호출)
  const x = useSpring(camX, { stiffness: 100, damping: 20 });
  const y = useSpring(camY, { stiffness: 100, damping: 20 });
  const scale = useSpring(camScale, { stiffness: 100, damping: 20 });

  return (
    <div className="relative w-full h-full bg-[#f6f6f6] overflow-hidden">
      {isPortrait ? (
        // 세로 모드: 안내문
        <div className="relative w-full h-full flex items-center justify-center">
          <p className="text-gray-800 text-lg md:text-xl font-semibold">
            이 섹션은 가로 모드에 최적화되어 있습니다. 화면을 가로로 돌려서
            봐주세요.
          </p>
        </div>
      ) : (
        // 가로 모드: 기존 연출
        <>
          {/* 냉장고 */}
          <motion.div
            style={{ x, y, scale }}
            className="absolute z-40 left-[10vw] bottom-[32.5vh] lg:bottom-[17.5vh] text-left"
          >
            <Fridge stageNum={stageNum} slidesLength={slides.length} />
          </motion.div>

          {/* 첫 슬라이드 텍스트 */}
          {isFirst && (
            <motion.div
              className="absolute right-[10vw] lg:right-[15vw] bottom-[32.5vh] lg:bottom-[25vh] text-left"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-[#FF4545] font-extrabold leading-tight lg:text-[6.5vw] text-[7.5vw]">
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
            <SketchText characters={characters} stage={stageNum} />
          )}

          {/* 마지막 화면 */}
          {isLast && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="absolute z-0 top-20 lg:top-10 tracking-wide lg:tracking-wider leading-40 lg:leading-60 font-bold text-center text-[145px] lg:text-[225px] text-[#E4E4E4] pointer-events-none">
                {"Marketer's Fridge"}
              </p>
              <div className="absolute z-60 bottom-40 flex w-full justify-center gap-[25%]">
                <Link href="/" passHref>
                  <button className="text-center justify-center relative cursor-pointer z-60 px-3.5 py-2 bg-black text-white font-bold rounded-md hover:bg-gray-800 flex items-center gap-3">
                    <Image
                      alt=""
                      width={23}
                      height={23}
                      src={"/icons/service/home-rounded.png"}
                      className="object-contain"
                    />
                    홈으로 돌아가기
                  </button>
                </Link>
                <Link href="/service" passHref>
                  <button className="text-center relative cursor-pointer z-60 px-3.5 py-2 bg-[#868686] text-white font-bold rounded-md hover:bg-gray-400 flex items-center gap-3">
                    <Image
                      alt=""
                      width={23}
                      height={23}
                      src={"/icons/service/replay.png"}
                      className="object-contain"
                    />
                    서비스 소개 다시보기
                  </button>
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** 캐릭터 소개 박스 */
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
    <div
      className="
        absolute z-50 top-[15%] right-[10%] 
        w-[35vw] max-w-[500px] 2xl:max-w-[650px]
        text-center bg-transparent rounded-2xl
        sm:top-[18%] sm:right-[15%] 
        md:top-[18%] md:right-[18%] 
      "
    >
      <div
        className="
          relative z-10 w-full 
          px-[6%] pt-[10%] text-left
          sm:px-[8%] sm:pt-[12%]
          md:px-[8%] md:pt-[15%]
        "
      >
        {cur?.name && (
          <p
            className="
              pb-1 text-[1.6vw]
              font-bold border-b-[1.7px] border-[#C6C6C6] mb-2
            "
          >
            {cur.name}
          </p>
        )}
        {lines.length > 0 ? (
          <ul
            className="
              space-y-2 sm:space-y-3 
              text-[1.15vw]
              text-gray-800
            "
          >
            {lines.slice(0, 5).map((ln, i) => (
              <li
                key={i}
                className="
                  py-1 sm:py-1.5 
                  border-b-[1.5px] sm:border-b-[1.7px] 
                  border-[#C6C6C6]
                "
              >
                {ln}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[14px] sm:text-[16px] md:text-[18px] text-gray-400">
            소개 문구가 아직 없어요.
          </p>
        )}
      </div>
      <Image
        width={500}
        height={600}
        alt="sketch"
        src="/icons/character/sketch.png"
        className="w-full rounded-2xl absolute z-0 top-0 shadow-2xl"
      />
    </div>
  );
}
