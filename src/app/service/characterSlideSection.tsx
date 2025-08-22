// components/CharacterSlideSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Image from "next/image";

const SLIDES = [
  { name: "딸기", img: "/icons/character/berry.png", bg: "#f9f9f9" },
  { name: "사과", img: "/icons/character/max.png", bg: "#f9f9f9" },
  { name: "수박", img: "/icons/character/melo.png", bg: "#f9f9f9" },
  { name: "토마토", img: "/icons/character/tommy.png", bg: "#f9f9f9" },
  { name: "체리", img: "/icons/character/twin.png", bg: "#f9f9f9" },
];

// 민감도/손맛
const STEP_PX_WHEEL = 240; // 휠/트랙패드 임계
const STEP_PX_TOUCH = 180; // 터치 임계
const DEADZONE = 12; // 미세 스크롤 무시
const MAX_EVENT_DELTA = 60; // 이벤트당 최대 누적(스파이크 캡)
const COOLDOWN_MS = 600; // 전환 후 쿨다운

type Dir = "down" | "up";

export default function CharacterSlideSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // 첫 진입: -1 → 첫 아래 스크롤 시 0번 캐릭터 등장
  const [stage, setStage] = useState<number>(-1);
  const [dir, setDir] = useState<Dir>("down");
  const [covered, setCovered] = useState(false); // 이미지가 등장 완료해 화면을 "덮은" 상태
  const N = SLIDES.length;

  const accumRef = useRef(0);
  const lastStepAt = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const lastInputRef = useRef<"wheel" | "touch" | null>(null);
  const lastDirRef = useRef<Dir | null>(null);

  const current = stage < 0 ? 0 : stage;

  // ===== body 스크롤 하드락 =====
  const lockScrollY = useRef(0);
  const lockScroll = () => {
    if (document.body.style.position === "fixed") return;
    lockScrollY.current = window.scrollY || window.pageYOffset;
    const body = document.body;
    body.style.position = "fixed";
    body.style.top = `-${lockScrollY.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
  };
  const unlockScroll = () => {
    if (document.body.style.position !== "fixed") return;
    const body = document.body;
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    body.style.overflow = "";
    document.documentElement.style.overscrollBehavior = "";
    window.scrollTo(0, lockScrollY.current);
  };

  // 섹션 활성화 감지
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setActive(e.isIntersecting && e.intersectionRatio > 0.6),
      { threshold: [0, 0.6, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 활성화되면 stage 초기화(-1), 덮힘 해제
  useEffect(() => {
    if (active) {
      setStage(-1);
      setCovered(false);
      accumRef.current = 0;
      lastStepAt.current = 0;
      lastInputRef.current = null;
      lastDirRef.current = null;
    } else {
      unlockScroll();
      accumRef.current = 0;
      lastStepAt.current = 0;
      setCovered(false);
      lastInputRef.current = null;
      lastDirRef.current = null;
    }
    return () => unlockScroll();
  }, [active]);

  // 화면을 완전히 덮은 후에만 전역 스크롤 락
  useEffect(() => {
    if (active && covered) lockScroll();
    else unlockScroll();
  }, [active, covered]);

  // 누적 로직 (민감도/방향락/데드존/클램프)
  const pushDelta = (rawDy: number, source: "wheel" | "touch") => {
    let dy = rawDy;
    if (Math.abs(dy) < DEADZONE) return; // 미세 입력 무시
    // 이벤트 스파이크 캡
    dy = Math.max(Math.min(dy, MAX_EVENT_DELTA), -MAX_EVENT_DELTA);

    const thisDir: Dir = dy > 0 ? "down" : "up";
    if (lastDirRef.current && lastDirRef.current !== thisDir) {
      // 방향 바뀌면 누적 리셋 (의도치 않은 역전 방지)
      accumRef.current = 0;
    }
    lastDirRef.current = thisDir;
    lastInputRef.current = source;

    accumRef.current += dy;
    stepIfNeeded();
  };

  const stepIfNeeded = () => {
    const now = Date.now();
    if (now - lastStepAt.current < COOLDOWN_MS) return;

    const stepPx =
      lastInputRef.current === "touch" ? STEP_PX_TOUCH : STEP_PX_WHEEL;

    // 아래(양수) → 다음 or 마지막이면 아래로 탈출
    if (accumRef.current >= stepPx) {
      if (stage === -1) {
        setDir("down");
        setStage(0); // 첫 등장
        lastStepAt.current = now;
      } else if (stage < N - 1) {
        setDir("down");
        setStage((s) => s + 1); // 다음 캐릭터
        lastStepAt.current = now;
      } else {
        // 마지막에서 아래로 → 다음 섹션으로
        const next = sectionRef.current
          ?.nextElementSibling as HTMLElement | null;
        setCovered(false);
        unlockScroll();
        next?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      accumRef.current = 0;
      return;
    }

    // 위(음수) → 이전 or 첫 화면이면 위로 탈출
    if (accumRef.current <= -stepPx) {
      if (stage > 0) {
        setDir("up");
        setStage((s) => s - 1); // 이전 캐릭터
        lastStepAt.current = now;
      } else if (stage === 0 || stage === -1) {
        const prev = sectionRef.current
          ?.previousElementSibling as HTMLElement | null;
        setCovered(false);
        unlockScroll();
        prev?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
      accumRef.current = 0;
    }
  };

  // 핸들러
  const onWheel = (e: React.WheelEvent) => {
    if (!active) return;
    if (covered) e.preventDefault(); // 덮인 뒤엔 페이지 스크롤 차단
    pushDelta(e.deltaY, "wheel");
  };

  // const touchStartY = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    if (!active) return;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!active || touchStartY.current == null) return;
    const curr = e.touches[0].clientY;
    const dy = curr - touchStartY.current; // 아래 +, 위 -
    if (covered) e.preventDefault();
    pushDelta(dy, "touch");
    touchStartY.current = curr;
  };
  const onTouchEnd = () => {
    touchStartY.current = null;
  };

  // 이미지(캐릭터)만 슬라이드되는 variants (화면은 고정)
  // ✅ 캐러셀 느낌: 새 슬라이드는 방향쪽에서 100% → 0%로 들어오고,
  //    기존 슬라이드는 반대방향으로 0% → -/+100%로 나감. 페이드/블러 없음.
  // 더 자연스러운 ‘옅었다 → 진해짐’ 느낌
  const imageVariants: Variants = {
    enter: (d: Dir) =>
      d === "down"
        ? { y: "100%", opacity: 0.55, filter: "brightness(0.96)" } // 아래에서 올라오며 옅게
        : { y: "-100%", opacity: 0.55, filter: "brightness(0.96)" }, // 위에서 내려오며 옅게
    center: {
      y: "0%",
      opacity: 1,
      filter: "brightness(1)",
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (d: Dir) =>
      d === "down"
        ? {
            y: "-100%",
            opacity: 0.55,
            filter: "brightness(0.96)",
            transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
          } // 위로 빠지며 다시 옅어짐
        : {
            y: "100%",
            opacity: 0.55,
            filter: "brightness(0.96)",
            transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
          }, // 아래로 빠지며 옅어짐
  };

  const visible = stage >= 0 ? stage : null;

  return (
    <section
      ref={sectionRef}
      className="hidden md:block relative h-screen w-full overflow-hidden"
      style={{ background: "#f9f9f9" }}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* 중앙 레이아웃 고정, 이미지 뷰만 전환 */}
      <div className="absolute inset-0 z-10 grid place-items-center">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="relative w-[68vw] max-w-[700px] aspect-[4/3] overflow-hidden rounded-2xl">
            <AnimatePresence custom={dir} mode="wait">
              {visible !== null && (
                <motion.div
                  key={visible}
                  custom={dir}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 will-change-transform"
                  onAnimationComplete={() => {
                    if (stage >= 0) setCovered(true);
                  }}
                >
                  <Image
                    src={SLIDES[visible].img}
                    alt={SLIDES[visible].name}
                    fill
                    className="object-contain pointer-events-none"
                    priority
                    sizes="(max-width: 808px) 68vw, 800px"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 하단 인디케이터(고정) */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center">
        <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-black/5 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {SLIDES.map((s, i) => {
              const isActive = i === current && stage >= 0;
              return (
                <motion.span
                  key={s.name}
                  className="h-1.5 rounded-full"
                  initial={false}
                  animate={{
                    width: isActive ? 16 : 8,
                    backgroundColor: isActive
                      ? "rgba(0,0,0,0.9)"
                      : "rgba(0,0,0,0.28)",
                    opacity: stage < 0 && i === 0 ? 0.5 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "inline-block" }}
                  aria-label={`${s.name} ${i + 1} / ${N}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
