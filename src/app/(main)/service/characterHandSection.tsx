// src/app/service/characterSlideOverlay.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";

/** 외부에서 받는 props (시그니처 유지) */
export type Slide = {
  name: string;
  img?: string;
  bg?: string;
  cam: { x: number; y: number; scale?: number };
};

type CharacterInfo = {
  id: string;
  name: string;
  tags: string[];
  imageUri: string;
  description: string;
};

type HandPos = {
  left: string;
  bottom: string;
  width: string; // 컨테이너 대비 %
  height: string; // 컨테이너 대비 %
  rotate?: number;
};

type Props = {
  slides: Slide[];
  onExit?: () => void;
  /** 부모가 넣어주는 캐릭터 데이터 (스케치 카드 텍스트) */
  characters?: CharacterInfo[];
  /** ✅ (선택) 손 레이어의 위치 프리셋을 부모에서 오버라이드하고 싶을 때 */
  handPositions?: {
    back: HandPos[];
    front: HandPos[];
  };
};

type Dir = "down" | "up";

/** 튜닝 값 */
const TUNE = {
  WHEEL_STEP_PX: 220,
  WHEEL_DEADZONE: 10,
  WHEEL_MAX_EVENT: 40,
  COOLDOWN_MS: 500,
};

/** ✅ 첫 슬라이드 / 이후 슬라이드 레이아웃 세트 */
const FIRST_LAYOUT = {
  wrapWClass: "w-[60vw]",
  bgSize: "52% auto",
  bgPos: "left center",
  offsetLeft: "-12%",
  offsetBottom: "0%",
};

const REST_LAYOUT = {
  wrapWClass: "w-[60vw]",
  bgSize: "80% 100%",
  bgPos: "left bottom",
  offsetLeft: "-12%",
  offsetBottom: "-30%",
};

/** 손 레이어 이미지 경로 */
const HAND_BACK = "/icons/character/hand-back.png";
const HAND_FRONT = "/icons/character/hand-front.png";

/** ▶ 캐릭터 파일(고정) */
const CHAR_ASSETS = [
  { key: "tomato", src: "/icons/character/토마토.png" },
  { key: "apple", src: "/icons/character/사과.png" },
  { key: "cherry", src: "/icons/character/체리.png" },
  { key: "strawberry", src: "/icons/character/딸기.png" },
  { key: "watermelon", src: "/icons/character/수박.png" },
] as const;

/** ▶ 과일 위치 프리셋 — 슬라이드마다 한 칸씩 회전 */
const POS_PRESET = [
  { left: "-10%", bottom: "64%", width: "18%", height: "18%", rotate: -6 },
  { left: "1%", bottom: "64%", width: "18%", height: "18%", rotate: 4 },
  { left: "12%", bottom: "64%", width: "18%", height: "18%", rotate: -2 },
  { left: "23%", bottom: "64%", width: "18%", height: "18%", rotate: 8 },
  { left: "-5%", bottom: "12%", width: "58%", height: "58%", rotate: -8 },
] as const;

/** ✅ 손 레이어 기본 프리셋(필요하면 handPositions prop으로 오버라이드 가능) */
const HAND_PRESET_DEFAULT = {
  front: [
    { left: "-36%", bottom: "-37%", width: "80%", height: "66%", rotate: -2 },
    { left: "-36%", bottom: "-37%", width: "80%", height: "66%", rotate: -2 },
    { left: "-36%", bottom: "-37%", width: "80%", height: "66%", rotate: -2 },
    { left: "-36%", bottom: "-37%", width: "80%", height: "66%", rotate: -2 },
    { left: "-36%", bottom: "-37%", width: "80%", height: "66%", rotate: -2 },
  ],
  back: [
    { left: "10%", bottom: "-27%", width: "30%", height: "66%", rotate: 2 },
    { left: "10%", bottom: "-27%", width: "30%", height: "66%", rotate: 2 },
    { left: "10%", bottom: "-27%", width: "30%", height: "66%", rotate: 2 },
    { left: "10%", bottom: "-27%", width: "30%", height: "66%", rotate: 2 },
    { left: "10%", bottom: "-27%", width: "30%", height: "66%", rotate: 2 },
  ],
};

/** body scroll lock 유틸 */
function useBodyLock(lock: boolean) {
  const lockScrollY = useRef(0);
  useEffect(() => {
    if (lock) {
      if (document.body.style.position !== "fixed") {
        lockScrollY.current = window.scrollY || window.pageYOffset;
        const b = document.body;
        b.style.position = "fixed";
        b.style.top = `-${lockScrollY.current}px`;
        b.style.left = "0";
        b.style.right = "0";
        b.style.width = "100%";
        b.style.overflow = "hidden";
        (document.documentElement as HTMLElement).style.overscrollBehavior =
          "none";
      }
    } else if (document.body.style.position === "fixed") {
      const y = -parseInt(document.body.style.top || "0", 10);
      const b = document.body;
      b.style.position = "";
      b.style.top = "";
      b.style.left = "";
      b.style.right = "";
      b.style.width = "";
      b.style.overflow = "";
      (document.documentElement as HTMLElement).style.overscrollBehavior = "";
      window.scrollTo(0, y);
    }
    return () => {
      if (document.body.style.position === "fixed") {
        const y = -parseInt(document.body.style.top || "0", 10);
        const b = document.body;
        b.style.position = "";
        b.style.top = "";
        b.style.left = "";
        b.style.right = "";
        b.style.width = "";
        b.style.overflow = "";
        (document.documentElement as HTMLElement).style.overscrollBehavior = "";
        window.scrollTo(0, y);
      }
    };
  }, [lock]);
}

/** 데스크톱 감지 */
function useIsDesktop(minWidth = 768) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width:${minWidth}px)`);
    const on = () => setOk(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, [minWidth]);
  return ok;
}

/** 래퍼 */
export default function CharacterSlideOverlay(props: Props) {
  const isDesktop = useIsDesktop();
  if (!isDesktop) return null;
  return <OverlayInner {...props} />;
}

/** 실제 구현 */
function OverlayInner({ slides, onExit, characters, handPositions }: Props) {
  const [stage, setStage] = useState(0);

  // ▶ 이미지 소스 결정
  const FRIDGE_DEFAULT = "/icons/character/fridge.png";
  const EMPTY_FRIDGE_DEFAULT = "/icons/character/empty-fridge.png";
  const bgImg =
    stage === 0
      ? slides[0]?.img ?? FRIDGE_DEFAULT
      : slides[stage]?.img ?? EMPTY_FRIDGE_DEFAULT;

  const bgColor = slides[stage]?.bg ?? "#f9f9f9";

  const isFirst = stage === 0;
  const L = isFirst ? FIRST_LAYOUT : REST_LAYOUT;

  const controls = useAnimation();
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);

  useBodyLock(!exiting);

  // 진입 애니메이션
  useEffect(() => {
    (async () => {
      await controls.start({
        y: "0%",
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      });
      setEntered(true);
    })();
  }, [controls]);

  const runExit = useCallback(async () => {
    if (exiting) return;
    setExiting(true);
    await controls.start({
      y: "-100%",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    });
    onExit?.();
  }, [controls, exiting, onExit]);

  // 휠로 슬라이드 전환
  const wheelAccum = useRef(0);
  const lastWheelDir = useRef<Dir | null>(null);
  const lastStepAt = useRef(0);

  const step = useCallback(
    async (dir: "next" | "prev") => {
      const now = Date.now();
      if (now - lastStepAt.current < TUNE.COOLDOWN_MS) return;
      lastStepAt.current = now;
      if (!entered || exiting) return;

      if (dir === "next") {
        if (stage >= slides.length - 1) {
          await runExit();
          return;
        }
        setStage((s) => Math.min(s + 1, slides.length - 1));
      } else {
        if (stage <= 0) return;
        setStage((s) => Math.max(s - 1, 0));
      }
    },
    [entered, exiting, runExit, stage, slides.length]
  );

  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (!entered || exiting) return;
      let dy = e.deltaY;
      if (Math.abs(dy) < TUNE.WHEEL_DEADZONE) return;
      e.preventDefault();
      if (Math.abs(dy) > TUNE.WHEEL_MAX_EVENT)
        dy = Math.sign(dy) * TUNE.WHEEL_MAX_EVENT;

      const dir: Dir = dy > 0 ? "down" : "up";
      if (lastWheelDir.current && lastWheelDir.current !== dir)
        wheelAccum.current = 0;
      lastWheelDir.current = dir;

      wheelAccum.current += dy;
      if (wheelAccum.current >= TUNE.WHEEL_STEP_PX) {
        wheelAccum.current = 0;
        void step("next");
      } else if (wheelAccum.current <= -TUNE.WHEEL_STEP_PX) {
        wheelAccum.current = 0;
        void step("prev");
      }
    },
    [entered, exiting, step]
  );

  useEffect(() => {
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  /** ▶ 슬라이드별 과일 위치 로테이션 */
  const placedSprites = isFirst
    ? []
    : CHAR_ASSETS.map((c, i) => {
        const shift = (stage - 1) % POS_PRESET.length;
        const pos = POS_PRESET[(i + shift) % POS_PRESET.length];
        return { ...c, ...pos };
      });

  /** ✅ 손 레이어 위치: 프리셋을 슬라이드별로 한 칸씩 회전 */
  const HAND = handPositions ?? HAND_PRESET_DEFAULT;
  const idxShift = Math.max(0, (stage - 1) % Math.max(HAND.back.length, 1));
  const backPos =
    !isFirst && HAND.back.length
      ? HAND.back[idxShift % HAND.back.length]
      : null;
  const frontPos =
    !isFirst && HAND.front.length
      ? HAND.front[idxShift % HAND.front.length]
      : null;

  /** ✅ 스케치 카드 텍스트 (2번째 슬라이드부터) */
  const currentChar: CharacterInfo | null =
    !isFirst && characters && characters.length
      ? characters[(stage - 1) % characters.length]
      : null;

  const descLines =
    currentChar?.description
      ?.split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  return (
    <motion.section
      initial={{ y: "100%" }}
      animate={controls}
      className="fixed inset-0 z-[1000] overflow-hidden"
      style={{ background: bgColor }}
      aria-roledescription="vertical slide gallery"
      aria-label={`Character focus ${stage + 1} / ${slides.length}`}
    >
      {/* 중앙 무대 — 내부 이동/줌 없음 */}
      <div className="absolute inset-0 grid place-items-center">
        <div
          className={`relative ${L.wrapWClass} aspect-[4/3] overflow-visible rounded-2xl`}
        >
          {/* 첫 슬라이드: 단일 이미지 */}
          {isFirst ? (
            <motion.div
              key={`first-${bgImg}`}
              className="absolute inset-0 bg-no-repeat"
              style={{
                backgroundImage: `url(${bgImg})`,
                backgroundSize: L.bgSize,
                backgroundPosition: L.bgPos,
                left: L.offsetLeft,
                bottom: L.offsetBottom,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.35 } }}
              exit={{ opacity: 0 }}
            />
          ) : (
            <>
              {/* 🔹 뒤손 (메인 이미지 뒤) */}
              {backPos && (
                <motion.div
                  className="absolute pointer-events-none z-21 bg-no-repeat"
                  style={{
                    backgroundImage: `url(${HAND_BACK})`,
                    backgroundSize: "contain",
                    width: backPos.width,
                    height: backPos.height,
                    left: backPos.left,
                    bottom: backPos.bottom,
                    transform: `rotate(${backPos.rotate ?? 0}deg)`,
                  }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.28 } }}
                />
              )}

              {/* 메인 이미지 */}
              <motion.div
                key={`rest-${stage}-${bgImg}`}
                className="absolute inset-0 z-20 bg-no-repeat"
                style={{
                  backgroundImage: `url(${bgImg})`,
                  backgroundSize: L.bgSize,
                  backgroundPosition: L.bgPos,
                  left: L.offsetLeft,
                  bottom: L.offsetBottom,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.35 } }}
                exit={{ opacity: 0 }}
              />

              {/* ▶ 과일 5종 — 위치 순환 (메인 이미지 위, 앞손 아래) */}
              {placedSprites.map((c, idx) => (
                <motion.div
                  key={`${c.key}-${stage}-${idx}`}
                  className="absolute pointer-events-none z-25 bg-no-repeat"
                  style={{
                    backgroundImage: `url(${c.src})`,
                    backgroundSize: "contain",
                    width: c.width,
                    height: c.height,
                    left: c.left,
                    bottom: c.bottom,
                    transform: `rotate(${c.rotate}deg)`,
                    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
                  }}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.35, delay: 0.05 * idx },
                  }}
                />
              ))}

              {/* 스케치 카드 + 동적 텍스트 */}
              {stage >= 1 && (
                <motion.div
                  className="absolute z-30"
                  initial={{ opacity: 0, scale: 3.45, x: 16 }}
                  animate={{ opacity: 1, scale: 3.45, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  style={{ right: "15%", top: "45%", pointerEvents: "none" }}
                >
                  <div
                    style={{ width: "clamp(64px, 12vw, 140px)" }}
                    className="relative"
                  >
                    <Image
                      src="/icons/character/sketch.png"
                      alt="sketch"
                      width={500}
                      height={500}
                      priority
                      style={{ width: "100%", height: "auto" }}
                      className="shadow-md rounded"
                    />
                    {/* 텍스트 영역 */}
                    <div className="absolute top-[18%] left-0 right-0 px-2 ">
                      {currentChar && (
                        <p className="md:text-[6px] lg:text-[7.5px] font-semibold border-b-[0.5px] border-gray-300 pb-[2px] leading-[1.2]">
                          {currentChar.name}
                        </p>
                      )}
                      <div className="mt-[2px] space-y-[2px]">
                        {(descLines.length
                          ? descLines
                          : ["소개 문구가 아직 없어요."]
                        )
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
                  </div>
                </motion.div>
              )}

              {/* 🔹 앞손 (모든 요소 위) */}
              {frontPos && (
                <motion.div
                  className="absolute pointer-events-none z-30 bg-no-repeat"
                  style={{
                    backgroundImage: `url(${HAND_FRONT})`,
                    backgroundSize: "contain",
                    width: frontPos.width,
                    height: frontPos.height,
                    left: frontPos.left,
                    bottom: frontPos.bottom,
                    transform: `rotate(${frontPos.rotate ?? 0}deg)`,
                  }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.28 } }}
                />
              )}
            </>
          )}
        </div>

        {/* 첫 슬라이드 문구 */}
        {stage === 0 && (
          <motion.div
            className="absolute z-40"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              right: "21%",
              top: "38%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              maxWidth: "min(38vw, 520px)",
            }}
          >
            <div className="rounded-2xl px-4 py-3">
              <p className="font-black leading-17 text-[clamp(14px,2.2vw,34px)] text-left ">
                Marketers fridge의
                <br /> 귀여운 마스코트들을 만나보세요!
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* 오른쪽 인디케이터 */}
      <nav
        className="absolute bottom-[40%] right-[4%] z-50 flex justify-center"
        aria-label="Slide indicator"
      >
        <div className="flex items-center gap-3 px-3 py-2 rounded-full">
          <div className="flex flex-col items-center gap-2.5">
            {slides.map((s, i) => {
              const isActive = i === stage;
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setStage(i)}
                  aria-label={`${s.name} ${i + 1} / ${slides.length}`}
                  className="cursor-pointer"
                >
                  <motion.span
                    className="h-1.5 rounded-full inline-block"
                    initial={false}
                    animate={{
                      width: 20,
                      height: 20,
                      backgroundColor: isActive
                        ? "rgba(0,0,0,0.6)"
                        : "rgba(0,0,0,0.28)",
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </motion.section>
  );
}
