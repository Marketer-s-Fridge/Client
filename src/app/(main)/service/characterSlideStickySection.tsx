"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimation, useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";

/*********************************
 * Types
 *********************************/
export type Slide = {
  name: string;
  img?: string; // 첫 슬라이드만 사용 (고정 이미지)
  bg?: string;
  cam: { x: number; y: number; scale: number }; // 포커스 좌표/배율 (% / % / scale)
};

/*********************************
 * Utils
 *********************************/
function useIsDesktop(minWidth = 768) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width:${minWidth}px)`);
    const onChange = () => setOk(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [minWidth]);
  return ok;
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/*********************************
 * Wrapper (데스크톱 전용)
 *********************************/
export default function CharacterSlideStickySection({
  slides,
}: {
  slides: Slide[];
}) {
  const isDesktop = useIsDesktop();
  if (!isDesktop) return null; // 모바일은 기존 플로우 유지
  return <StickyInner slides={slides} />;
}

/*********************************
 * Inner (sticky 스크롤 구현)
 *********************************/
function StickyInner({ slides }: { slides: Slide[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 스크롤 진행률 (0~1): 컨테이너의 시작이 뷰포트 top에 닿을 때 0, 컨테이너 끝이 top에 닿을 때 1
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 진행률을 리액트 상태로 가져오기 (UI 계산용)
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setP(v));

  const sectionCount = slides.length;
  const stageFloat = p * sectionCount; // 0 ~ sectionCount
  const stageIndex = Math.min(Math.floor(stageFloat), sectionCount - 1); // 0..last
  const t = clamp01(stageFloat - stageIndex); // 현재 슬라이드와 다음 슬라이드 사이 보간 비율

  // 현재/다음 카메라 값 보간
  const camNow = slides[stageIndex]?.cam ?? { x: 50, y: 50, scale: 1 };
  const camNext =
    slides[Math.min(stageIndex + 1, sectionCount - 1)]?.cam ??
    slides[stageIndex]?.cam ??
    { x: 50, y: 50, scale: 1 };

  const cam = {
    x: lerp(camNow.x, camNext.x, t),
    y: lerp(camNow.y, camNext.y, t),
    scale: lerp(camNow.scale, camNext.scale, t),
  };

  const baseImg = slides[0]?.img ?? "/icons/character/fridge.png";
  const bgColor = slides[stageIndex]?.bg ?? "#f9f9f9";

  // 처음 등장 시 살짝 위로 떠오르는 느낌
  const enterCtrl = useAnimation();
  useEffect(() => {
    void enterCtrl.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    });
  }, [enterCtrl]);

  // 인디케이터 점 개수 & 활성 인덱스
  const dots = useMemo(() => slides.map((s) => s.name), [slides]);

  return (
    // 컨테이너: (슬라이드 개수 + 1) * 100vh 길이 → 마지막 지나면 자연스럽게 아래 콘텐츠 노출
    <section
      ref={containerRef}
      className="hidden md:block relative w-full"
      style={{ height: `${(sectionCount + 1) * 100}vh` }}
      aria-roledescription="scrolling sticky slide section"
    >
      {/* sticky 레이어: 화면을 꽉 채우고, 컨테이너 안에서만 고정됨 */}
      <motion.div
        initial={{ y: 40, opacity: 0.9 }}
        animate={enterCtrl}
        className="sticky top-0 h-[100vh] w-full overflow-hidden"
        style={{ background: bgColor }}
      >
        {/* 중앙 무대 */}
        <div className="absolute inset-0 grid place-items-center">
          {/* 4:3 캔버스, 배경 1장에 카메라 패닝 */}
          <motion.div
            className="relative w-[100vw] aspect-[4/3] overflow-hidden rounded-2xl"
            style={{ touchAction: "none" }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                ["--cam-x" as any]: `${cam.x}%`,
                ["--cam-y" as any]: `${cam.y}%`,
                ["--cam-scale" as any]: cam.scale,
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                transform: `translateY(-15%)`,
                backgroundImage: `url(${baseImg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "var(--cam-x) var(--cam-y)",
                backgroundSize: "calc(var(--cam-scale) * 100%) auto",
              }}
            />

            {/* 예시: 1번 이후에만 스케치 카드 등장 */}
            {stageIndex >= 1 && (
              <motion.div
                className="absolute z-20"
                initial={false}
                animate={{ opacity: 1, scale: 3.8, x: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{ right: "30%", top: "30%", pointerEvents: "none" }}
              >
                <div style={{ width: "clamp(64px, 12vw, 140px)" }}>
                  <Image
                    src="/icons/character/sketch.png"
                    alt="sketch"
                    width={580}
                    height={580}
                    priority
                    style={{ width: "100%", height: "auto" }}
                    className="shadow-md rounded"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* 첫 슬라이드 문구 */}
          {stageIndex === 0 && (
            <motion.div
              className="absolute z-20"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
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

        {/* 우측 인디케이터 */}
        <nav
          className="absolute bottom-[35%] right-[4%] z-30 flex justify-center"
          aria-label="Slide indicator"
        >
          <div className="flex items-center gap-3 px-3 py-2 rounded-full">
            <div className="flex flex-col items-center gap-2.5">
              {dots.map((_, i) => {
                const active = i === stageIndex;
                return (
                  <span key={i} className="inline-block">
                    <motion.span
                      className="h-1.5 rounded-full inline-block"
                      initial={false}
                      animate={{
                        width: 12,
                        height: 12,
                        backgroundColor: active
                          ? "rgba(0,0,0,0.9)"
                          : "rgba(0,0,0,0.28)",
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </span>
                );
              })}
            </div>
          </div>
        </nav>

        {/* 하단 힌트: 마지막 구간에선 살짝 사라지도록 */}
        <motion.div
          className="absolute bottom-6 left-0 right-0 text-center text-xs text-gray-500"
          animate={{ opacity: stageIndex >= sectionCount - 1 ? 0.2 : 1 }}
        >
          아래로 스크롤하면 계속 내려가요
        </motion.div>
      </motion.div>
    </section>
  );
}
