// components/CharacterSlideSection.tsx
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, Variants, PanInfo } from "framer-motion";
import Image from "next/image";

const SLIDES = [
  { name: "딸기", img: "/icons/character/딸기.png", bg: "#f9f9f9" },
  { name: "사과", img: "/icons/character/사과.png", bg: "#f9f9f9" },
  { name: "수박", img: "/icons/character/수박.png", bg: "#f9f9f9" },
  { name: "토마토", img: "/icons/character/토마토.png", bg: "#f9f9f9" },
  { name: "체리", img: "/icons/character/체리.png", bg: "#f9f9f9" },
];

type Dir = "down" | "up";

// ===== 스와이프/휠 민감도 =====
const SWIPE_OFFSET_PX = 80;
const SWIPE_VELOCITY = 600;

// 휠 입력
const WHEEL_STEP_PX = 220;
const WHEEL_DEADZONE = 10;
const WHEEL_MAX_EVENT = 40;
const COOLDOWN_MS = 500;

// ===== 스냅(완전 진입) 판정 =====
const SNAP_VISIBLE_RATIO = 1;
const SNAP_SLOP = 24;

// ===== 이미지 연출 튜닝 =====
const FINAL_SCALE = 0.32; // 최종 크기
const ENTER_SCALE = 0.32; // 시작 크기
const PEAK_SCALE = 0.37; // 중앙 팝 크기

// 좌측 치우침(음수=왼쪽)
const FORCE_SHIFT_X = 150;

// 세로 포커스(작을수록 위)
const OBJ_TOP_BIAS_PCT = 18;

// ✅ 추가: 이미지 자체를 더 위로 끌어올리는 픽셀 오프셋
const LIFT_Y_PX = 764; // ← 더 위로 올리고 싶으면 숫자 키워(예: 80, 96)

export default function CharacterSlideSection() {
  const [stage, setStage] = useState(0);
  const [dir, setDir] = useState<Dir>("down");

  // iOS 주소창 변동 대응: 실측 vh
  const [vh, setVh] = useState<number | null>(null);
  useLayoutEffect(() => {
    const update = () => {
      const vv = (globalThis as any).visualViewport;
      const h = vv?.height ?? window.innerHeight;
      setVh(Math.round(h));
    };
    update();
    const vv = (globalThis as any).visualViewport;
    vv?.addEventListener?.("resize", update);
    window.addEventListener("resize", update);
    return () => {
      vv?.removeEventListener?.("resize", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const sectionRef = useRef<HTMLDivElement>(null);

  // 근방 접근/완전 진입
  const activeRef = useRef(false);
  const engagedRef = useRef(false);

  // 휠 누적/방향/쿨다운
  const wheelAccum = useRef(0);
  const lastWheelDir = useRef<Dir | null>(null);
  const lastStepAt = useRef(0);

  /** 바디 스크롤 락/언락 */
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

  /** IO: 근방 진입만 감지(완전 진입은 스크롤에서 판정) */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([e]) => {
        activeRef.current = e.isIntersecting && e.intersectionRatio > 0.2;
        if (!activeRef.current && !engagedRef.current) {
          unlockScroll();
        }
      },
      { threshold: [0, 0.2, 0.6, 0.9, 1] }
    );
    io.observe(el);

    // 스크롤 시 "완전 진입" 판정 → 그때만 스냅+락
    const onScroll = () => {
      if (!activeRef.current || engagedRef.current) return;
      const rect = el.getBoundingClientRect();
      const vpH = window.innerHeight;
      const visibleH = Math.min(
        vpH,
        Math.max(0, Math.min(rect.bottom, vpH) - Math.max(rect.top, 0))
      );
      const ratio = visibleH / Math.min(vpH, rect.height);
      const nearTop = Math.abs(rect.top) <= SNAP_SLOP;

      if (ratio >= SNAP_VISIBLE_RATIO || nearTop) {
        engagedRef.current = true;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => lockScroll(), 80);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    requestAnimationFrame(onScroll);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (!engagedRef.current) unlockScroll();
    };
  }, []);

  /** 엣지(첫/마지막)에서만 탈출 허용 */
  const scrollToSibling = (which: "prev" | "next") => {
    engagedRef.current = false;
    const target =
      which === "next"
        ? (sectionRef.current?.nextElementSibling as HTMLElement | null)
        : (sectionRef.current?.previousElementSibling as HTMLElement | null);
    unlockScroll();
    target?.scrollIntoView({
      behavior: "smooth",
      block: which === "next" ? "start" : "end",
    });
  };

  const goNext = () => {
    setDir("down");
    if (stage < SLIDES.length - 1) setStage((s) => s + 1);
    else scrollToSibling("next");
  };
  const goPrev = () => {
    setDir("up");
    if (stage > 0) setStage((s) => s - 1);
    else scrollToSibling("prev");
  };

  /** 스와이프 처리 (쿨다운 포함) */
  const tryStepWithCooldown = (step: () => void) => {
    const now = Date.now();
    if (now - lastStepAt.current < COOLDOWN_MS) return;
    if (!engagedRef.current) engagedRef.current = true;
    lastStepAt.current = now;
    step();
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const moved = info.offset.y;
    const vy = info.velocity.y;
    if (moved <= -SWIPE_OFFSET_PX || vy <= -SWIPE_VELOCITY)
      return tryStepWithCooldown(goNext);
    if (moved >= SWIPE_OFFSET_PX || vy >= SWIPE_VELOCITY)
      return tryStepWithCooldown(goPrev);
  };

  /** 휠/트랙패드: 완전 진입 중에만 캡처 */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!engagedRef.current) return;
      if (Date.now() - lastStepAt.current < COOLDOWN_MS) {
        e.preventDefault();
        return;
      }

      let dy = e.deltaY;
      if (Math.abs(dy) < WHEEL_DEADZONE) return;
      e.preventDefault();
      if (Math.abs(dy) > WHEEL_MAX_EVENT) dy = Math.sign(dy) * WHEEL_MAX_EVENT;

      const thisDir: Dir = dy > 0 ? "down" : "up";
      if (lastWheelDir.current && lastWheelDir.current !== thisDir)
        wheelAccum.current = 0;
      lastWheelDir.current = thisDir;

      wheelAccum.current += dy;

      if (wheelAccum.current >= WHEEL_STEP_PX) {
        wheelAccum.current = 0;
        tryStepWithCooldown(goNext);
      } else if (wheelAccum.current <= -WHEEL_STEP_PX) {
        wheelAccum.current = 0;
        tryStepWithCooldown(goPrev);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel as any);
  }, [stage]);

  /** 전환 애니메이션 */
  const imageVariants: Variants = {
    enter: (d: Dir) =>
      d === "down"
        ? {
            y: "100%",
            x: FORCE_SHIFT_X,
            scale: ENTER_SCALE,
            opacity: 0.55,
            filter: "brightness(0.96)",
          }
        : {
            y: "-100%",
            x: FORCE_SHIFT_X,
            scale: ENTER_SCALE,
            opacity: 0.55,
            filter: "brightness(0.96)",
          },
    center: {
      y: "0%",
      x: FORCE_SHIFT_X,
      scale: [ENTER_SCALE, PEAK_SCALE, FINAL_SCALE], // 팝
      opacity: 1,
      filter: "brightness(1)",
      transition: {
        y: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
        x: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.26 },
        filter: { duration: 0.26 },
        scale: {
          duration: 0.52,
          times: [0, 0.45, 1],
          ease: [0.22, 1, 0.36, 1],
        },
      },
    },
    exit: (d: Dir) =>
      d === "down"
        ? {
            y: "-100%",
            x: FORCE_SHIFT_X,
            scale: FINAL_SCALE,
            opacity: 0.55,
            filter: "brightness(0.96)",
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
          }
        : {
            y: "100%",
            x: FORCE_SHIFT_X,
            scale: FINAL_SCALE,
            opacity: 0.55,
            filter: "brightness(0.96)",
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
          },
  };

  return (
    <section
      ref={sectionRef}
      className="hidden md:block relative w-screen overflow-hidden"
      style={{
        height: vh ? `${vh}px` : "100svh",
        background: "#f9f9f9",
        scrollMarginTop: 0,
      }}
    >
      {/* 중앙 레이아웃 고정, 내부 뷰만 전환 */}
      <div className="absolute inset-0 z-10 grid place-items-center">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <motion.div
            className="relative w-[100vw] aspect-[4/3] overflow-hidden rounded-2xl"
            drag="y"
            dragElastic={0.12}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 0.985 }}
            style={{ touchAction: "none", willChange: "transform" }}
          >
            <AnimatePresence custom={dir} mode="wait">
              <motion.div
                key={stage}
                custom={dir}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 will-change-transform"
                style={{ transformOrigin: "left center" }}
              >
                {/* ✅ 이미지만 추가로 위로 끌어올림 (부모는 그대로) */}
                <div
                  className="absolute inset-0"
                  style={{ transform: `translateY(-${LIFT_Y_PX}px)` }}
                >
                  <Image
                    src={SLIDES[stage].img}
                    alt={SLIDES[stage].name}
                    fill
                    className="object-contain pointer-events-none select-none"
                    priority
                    sizes="(max-width: 808px) 68vw, 800px"
                    draggable={false}
                    style={{ objectPosition: `center ${OBJ_TOP_BIAS_PCT}%` }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* 우측 세로 인디케이터 */}
      <div className="absolute bottom-[45%] right-[4%] z-30 flex justify-center">
        <div className="flex items-center gap-3 px-3 py-2 rounded-full backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2.5">
            {SLIDES.map((s, i) => {
              const isActive = i === stage;
              return (
                <motion.span
                  key={s.name}
                  className="h-1.5 rounded-full"
                  initial={false}
                  animate={{
                    width: 12,
                    height: 12,
                    backgroundColor: isActive
                      ? "rgba(0,0,0,0.9)"
                      : "rgba(0,0,0,0.28)",
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "inline-block" }}
                  aria-label={`${s.name} ${i + 1} / ${SLIDES.length}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
