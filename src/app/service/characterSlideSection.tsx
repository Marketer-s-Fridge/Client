// src/app/service/characterSlideSection.tsx
"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
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

/* ===== 튜닝 ===== */
const SWIPE_OFFSET_PX = 80;
const SWIPE_VELOCITY = 600;

const WHEEL_STEP_PX = 220;
const WHEEL_DEADZONE = 10;
const WHEEL_MAX_EVENT = 40;
const COOLDOWN_MS = 500;

const SNAP_VISIBLE_RATIO = 1;
const SNAP_SLOP = 24;

const FINAL_SCALE = 0.2;
const ENTER_SCALE = 0.2;
const PEAK_SCALE = 0.25;

/* 퍼센트/숫자 허용 (음수면 왼쪽으로) */
const FORCE_SHIFT_X: number | string = "10%";
/* 작을수록 위 포커스 */
const OBJ_TOP_BIAS_PCT = 16;
/* 퍼센트로 상향 리프트(컨테이너 대비) */
const LIFT_Y = "90%";

/* ===== 데스크톱 판별 훅 (타입 안정) ===== */
function useIsDesktop() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    type Mql = MediaQueryList & {
      addListener?: (
        listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void
      ) => void;
      removeListener?: (
        listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void
      ) => void;
    };

    const mql = window.matchMedia("(min-width: 768px)") as Mql;

    const onChange = () => setOk(mql.matches);
    onChange();

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener?.("change", onChange);
    }

    // Safari 레거시
    const legacy: (this: MediaQueryList, ev: MediaQueryListEvent) => void =
      () => onChange();
    mql.addListener?.(legacy);
    return () => mql.removeListener?.(legacy);
  }, []);

  return ok;
}

export default function CharacterSlideSection() {
  const isDesktop = useIsDesktop();
  return isDesktop ? <CharacterSlideSectionDesktop /> : null;
}

/* ===== 실제 섹션 (훅 순서 고정) ===== */
function CharacterSlideSectionDesktop() {
  const [stage, setStage] = useState(0);
  const [dir, setDir] = useState<Dir>("down");
  const [engaged, setEngaged] = useState(false);

  const engagedRef = useRef(false);
  useEffect(() => {
    engagedRef.current = engaged;
  }, [engaged]);

  /* visualViewport 안전 접근(타입 명시, any 제거) */
  const [vh, setVh] = useState<number | null>(null);
  useLayoutEffect(() => {
    const update = () => {
      const vv: VisualViewport | null = window.visualViewport;
      const h = vv?.height ?? window.innerHeight;
      setVh(Math.round(h));
    };
    update();

    const onViewportResize = () => update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", onViewportResize);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", onViewportResize);
    };
  }, []);

  const sectionRef = useRef<HTMLDivElement>(null);

  const wheelAccum = useRef(0);
  const lastWheelDir = useRef<Dir | null>(null);
  const lastStepAt = useRef(0);

  /** 바디 스크롤 락/언락 */
  const lockScrollY = useRef(0);

  const lockScroll = useCallback(() => {
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
  }, []);

  const unlockScroll = useCallback(() => {
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
  }, []);

  /** IO + 스냅 진입 */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let active = false;
    const io = new IntersectionObserver(
      ([e]) => {
        active = e.isIntersecting && e.intersectionRatio > 0.2;
        if (!active && !engagedRef.current) unlockScroll();
      },
      { threshold: [0, 0.2, 0.6, 0.9, 1] }
    );
    io.observe(el);

    const onScroll = () => {
      if (!active || engagedRef.current) return;
      const rect = el.getBoundingClientRect();
      const vpH = window.innerHeight;
      const visibleH = Math.min(
        vpH,
        Math.max(0, Math.min(rect.bottom, vpH) - Math.max(rect.top, 0))
      );
      const ratio = visibleH / Math.min(vpH, rect.height);
      const nearTop = Math.abs(rect.top) <= SNAP_SLOP;

      if (ratio >= SNAP_VISIBLE_RATIO || nearTop) {
        setEngaged(true);
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(lockScroll, 80);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    requestAnimationFrame(onScroll);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      setEngaged(false);
      unlockScroll();
    };
  }, [lockScroll, unlockScroll]);

  /** 탈출(첫/마지막에서만) */
  const scrollToSibling = useCallback(
    (which: "prev" | "next") => {
      setEngaged(false);
      const target =
        which === "next"
          ? (sectionRef.current?.nextElementSibling as HTMLElement | null)
          : (sectionRef.current?.previousElementSibling as HTMLElement | null);
      unlockScroll();
      target?.scrollIntoView({
        behavior: "smooth",
        block: which === "next" ? "start" : "end",
      });
    },
    [unlockScroll]
  );

  const goNext = useCallback(() => {
    setDir("down");
    setStage((s) => {
      if (s < SLIDES.length - 1) return s + 1;
      scrollToSibling("next");
      return s;
    });
  }, [scrollToSibling]);

  const goPrev = useCallback(() => {
    setDir("up");
    setStage((s) => {
      if (s > 0) return s - 1;
      scrollToSibling("prev");
      return s;
    });
  }, [scrollToSibling]);

  /** 스와이프 처리 (쿨다운 포함) */
  const tryStepWithCooldown = useCallback((step: () => void) => {
    const now = Date.now();
    if (now - lastStepAt.current < COOLDOWN_MS) return;
    if (!engagedRef.current) setEngaged(true);
    lastStepAt.current = now;
    step();
  }, []);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const moved = info.offset.y;
    const vy = info.velocity.y;
    if (moved <= -SWIPE_OFFSET_PX || vy <= -SWIPE_VELOCITY)
      return tryStepWithCooldown(goNext);
    if (moved >= SWIPE_OFFSET_PX || vy >= SWIPE_VELOCITY)
      return tryStepWithCooldown(goPrev);
  };

  /** 전역 wheel (타입 고정, any 제거) */
  useEffect(() => {
    if (!engaged) return;

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
    return () => window.removeEventListener("wheel", onWheel);
  }, [engaged, goNext, goPrev, tryStepWithCooldown]);

  /** 애니메이션 */
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
      scale: [ENTER_SCALE, PEAK_SCALE, FINAL_SCALE],
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
      {/* 중앙 레이아웃 고정 */}
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
                {/* 퍼센트 상향 리프트 */}
                <div
                  className="absolute inset-0"
                  style={{ transform: `translateY(-${LIFT_Y})` }}
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
