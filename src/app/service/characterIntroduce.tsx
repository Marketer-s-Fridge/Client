"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import type { PanInfo } from "framer-motion";
import Image from "next/image";

/*****************
 * Types
 *****************/
export type CharacterCard = {
  id: string;
  name: string;
  handle?: string;
  tags?: string[];
  imageUri: string;
  description: string;
};

export type CharacterIntroduceProps = {
  data: CharacterCard[];
  /** px or any CSS length. Default: clamp(240px, 76vw, 360px) */
  cardWidth?: string;
  /** width/height. Default: 313/396 */
  cardAspectRatio?: number; // e.g. 313/396
  onIndexChange?: (index: number) => void;
};

/*****************
 * Component
 *****************/
export default function CharacterIntroduce({
  data,
  cardWidth = "clamp(320px, 92vw, 520px)", // 더 넓게
  cardAspectRatio = 313 / 396,
  onIndexChange,
}: CharacterIntroduceProps) {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false); // 현재 카드만 플립
  const dragStartX = useRef(0);

  // 드래그용 X 모션값(카드만 움직임, 화면 고정)
  const x = useMotionValue(0);
  const draggingRef = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let sx = 0,
      sy = 0;
    const EDGE = 24; // 화면 가장자리 24px은 히스토리 제스처 방지

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      sx = t.clientX;
      sy = t.clientY;
    };

    const onMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      const cx = t.clientX;
      const nearEdge = cx < EDGE || cx > window.innerWidth - EDGE;

      // 엣지에서 가로로 크게 움직이면 브라우저 제스처 막기
      if (nearEdge && Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
      }
    };

    // 반드시 passive:false 로! (그래야 preventDefault가 먹음)
    el.addEventListener("touchstart", onStart, { passive: false });
    el.addEventListener("touchmove", onMove, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
    };
  }, []);

  // index 바뀌면 플립 초기화 + 부모 콜백
  useEffect(() => {
    setIsFlipped(false);
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  // ← 추가: 이전/다음 카드 이미지 미리 로드(전환 끊김 방지)
  useEffect(() => {
    const preload = (src?: string) => {
      if (!src) return;
      if (typeof window === "undefined") return;
      const img = new window.Image();
      img.decoding = "async";
      img.src = src;
    };
    preload(data[index - 1]?.imageUri);
    preload(data[index + 1]?.imageUri);
  }, [index, data]);

  // 스와이프 시작
  const onDragStart = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      dragStartX.current = info.point.x ?? 0;
    },
    []
  );

  // 스와이프 완료 후 인덱스 변경 애니메이션
  const commitSwipe = useCallback(
    async (dir: "next" | "prev") => {
      draggingRef.current = true;
      const sign = dir === "next" ? -1 : 1; // 왼쪽으로 빠져나가면 next
      // 화면 밖으로 살짝 밀어내기
      await animate(x, sign * 400, { duration: 0.18, ease: "easeIn" });
      // 인덱스 변경
      setIndex((prev) =>
        dir === "next"
          ? Math.min(data.length - 1, prev + 1)
          : Math.max(0, prev - 1)
      );
      // 반대쪽에서 들어오게 초기 위치 세팅
      x.set(-sign * 400);
      // 중앙으로 스냅
      await animate(x, 0, { duration: 0.22, ease: "easeOut" });
      draggingRef.current = false;
    },
    [data.length, x]
  );

  const onDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (draggingRef.current) return;
      const dx = (info.point.x ?? 0) - dragStartX.current;
      const vx = info.velocity.x ?? 0;
      const DIST = 60; // 거리 임계치(부드럽게)
      const VEL = 500; // 속도 임계치(플릭)

      if ((dx > DIST || vx > VEL) && index > 0) {
        commitSwipe("prev");
        return;
      }
      if ((dx < -DIST || vx < -VEL) && index < data.length - 1) {
        commitSwipe("next");
        return;
      }
      animate(x, 0, { duration: 0.18, ease: "easeOut" });
    },
    [commitSwipe, data.length, index, x]
  );

  const current = data[index];

  return (
    <div
      ref={containerRef}
      className="relative flex-1 w-full flex flex-col items-center overscroll-contain mb-[50px] scroll-anchor-none"
      style={{ touchAction: "pan-y" }} // 가로 제스처는 내가 처리
    >
      {/* 고정 화면: 가운데에 카드 1장만 */}
      <p className="mt-[25%] mb-20 text-sm text-gray-500">
        밑으로 더 내려서 캐릭터 구경하기
      </p>
      <div
        className="relative"
        style={
          {
            width: "var(--card-w)",
            aspectRatio: cardAspectRatio, // ← 부모도 고정 비율로 높이 확보
            "--card-w": cardWidth,
          } as React.CSSProperties
        }
      >
        {/* 카드(드래그로 좌우 넘기기) */}
        <div className="relative flex items-center">
          <div className="w-[100%] h-[100%] bottom-0 absolute pointer-events-none items-center">
            <Image
              alt={"뒷배경"}
              src={"/icons/character/back.png"}
              width={359}
              height={439}
              className="self-center relative place-self-center bottom-[7.5%] w-[115%] h-[115%] object-contain z-0 "
            />
          </div>
          <motion.div
            drag="x"
            style={{ x, touchAction: "pan-y" }}
            dragElastic={0.18}
            dragMomentum={false}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className="cursor-grab active:cursor-grabbing"
          >
            <FlipCard
              imageUri={current.imageUri}
              name={current.name}
              handle={current.handle}
              description={current.description}
              isActive
              isFlipped={isFlipped}
              setIsFlipped={setIsFlipped}
              width={"var(--card-w)"}
              aspectRatio={cardAspectRatio}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/*****************
 * FlipCard
 *****************/
function FlipCard({
  imageUri,
  name,
  handle,
  description,
  width,
  aspectRatio,
  isActive,
  isFlipped,
  setIsFlipped,
}: {
  imageUri: string;
  name: string;
  handle?: string;
  description: string;
  width: string;
  aspectRatio: number; // 313/396
  isActive: boolean;
  isFlipped: boolean;
  setIsFlipped: (v: boolean) => void;
}) {
  const rotateY = useMotionValue(0);

  // 앞/뒷면 완전 분리: 0~90도 사이에 앞면 페이드아웃, 90~180도에 뒷면 페이드인
  const frontOpacity = useTransform(rotateY, [0, 90, 180], [1, 0, 0]);
  const backOpacity = useTransform(rotateY, [0, 90, 180], [0, 0, 1]);

  useEffect(() => {
    const target = isFlipped ? 180 : 0;
    const controls = animate(rotateY, target, {
      type: "spring",
      stiffness: 200,
      damping: 18,
    });
    return controls.stop;
  }, [isFlipped, rotateY]);

  const toggle = React.useCallback(() => {
    if (!isActive) return;
    setIsFlipped(!isFlipped);
  }, [isActive, isFlipped, setIsFlipped]);

  return (
    <div className="w-full relative" style={{ width, perspective: 1000 }}>
      <motion.div
        onTap={toggle} // ← 드래그했을 땐 실행 안 됨
        style={{
          width: "75%",
          aspectRatio,
          transformStyle: "preserve-3d",
          rotateY, // 회전 애니메이션
          touchAction: "pan-y", // 브라우저 가로제스처 방지
          willChange: "transform, opacity",
        }}
        className="relative mx-auto bg-white rounded-2xl overflow-hidden shadow-[0_10px_24px_rgba(0,0,0,0.15)] select-none"
      >
        {/* Front: 이미지 (뒤집힐 때 완전 투명) */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backfaceVisibility: "hidden",
            opacity: frontOpacity,
            transform: "translateZ(0.1px)",
          }}
          aria-hidden={isFlipped}
        >
          <div
            className="absolute inset-3 bg-white rounded-xl"
            style={{ opacity: "inherit" }}
          >
            {/* inset-2 = 0.5rem 여백 */}
            <div className="relative w-[95%] h-[95%] place-self-center">
              <Image
                src={imageUri}
                alt={name}
                fill
                sizes="(max-width: 768px) 80vw, 520px"
                quality={95}
                priority
                className="object-contain pointer-events-none select-none"
                draggable={false}
              />
            </div>
          </div>
        </motion.div>

        {/* Back: 순수 흰 배경 + 텍스트 */}
        <motion.div
          className="absolute inset-0 bg-white z-20 -scale-x-100"
          style={{
            backfaceVisibility: "hidden",
            transform: "scaleX(-1) translateZ(0)",
            opacity: backOpacity,
            transformOrigin: "center",
          }}
          aria-hidden={!isFlipped}
        >
          <div className="flex h-full flex-col p-4">
            <div className="mt-6 mb-2">
              <div className="text-[18px] font-bold text-neutral-900">
                {name}
                {handle ? (
                  <span className="font-semibold text-neutral-500">
                    {handle}
                  </span>
                ) : null}
              </div>
            </div>

            <hr className="border-neutral-200 mb-3" />

            <div
              className="text-[14px] leading-5 text-neutral-700 whitespace-pre-wrap overflow-y-auto pr-1"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {description}
            </div>
            <div className="mt-auto pt-3 text-right"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
