// components/CharacterIntroduce.tsx
"use client";

/**
 * 카드 덱을 "아래에서 위로 쌓인" 형태로 보여 주고
 * 맨앞 카드를 좌/우로 스와이프하면
 *   - 현재 카드가 그 방향으로 화면 밖으로 나가고(고스트: leaver)
 *   - 같은 카드가 그 방향 바깥에서 다시 들어와 덱의 맨 뒤에 붙는다(고스트: arriver)
 * 이렇게 해서 ‘끊김 없이’ 무한 스와이프되는 느낌을 만든다.
 *
 * 핵심 아이디어
 *  1) 실제 덱(layers)은 모든 카드를 '항상 마운트' 한다. (key를 원본 인덱스 idx로 고정)
 *  2) 스와이프 순간엔, 떠나는 카드/다시 들어오는 카드를 '고스트 레이어'로 따로 렌더해서
 *     덱 위/뒤에서 애니메이션만 담당시킨다. (겹침과 순서를 눈속임)
 *  3) 덱의 맨앞(front) 인덱스만 회전시키며, 각 카드의 상대 위치(rel)로
 *     bottom/scale/zIndex 를 계산한다. (스무스한 층 이동)
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
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
  /** 카드 폭(px 또는 CSS 길이). 기본: clamp(320px, 92vw, 520px) */
  cardWidth?: string;
  /** width/height 비율. 기본: 313/396 */
  cardAspectRatio?: number;
  onIndexChange?: (index: number) => void;
};

/*****************
 * Deck settings
 *****************/
const VISIBLE = 4;  // 화면에 보일 카드 층수(덱 높이)
const OVERLAP = 5; // 층 간 간격(px) — rel 값에 곱해서 bottom 오프셋 계산

/*****************
 * Component
 *****************/
export default function CharacterIntroduce({
  data,
  cardWidth = "clamp(260px, 78vw, 360px)",
  cardAspectRatio = 313 / 396,
  onIndexChange,
}: CharacterIntroduceProps) {
  const n = data.length;

  /** 덱의 "맨앞 카드" 원본 인덱스 */
  const [front, setFront] = useState(0);
  /** 스와이프 중 중복 입력 방지 */
  const [animating, setAnimating] = useState(false);
  /** 맨앞(활성) 카드만 뒷면 플립 허용 */
  const [isFlipped, setIsFlipped] = useState(false);

  // 컨테이너 폭을 기준으로 "화면 밖까지" 보낼 거리 산출
  const wrapRef = useRef<HTMLDivElement>(null);
  const [offX, setOffX] = useState(600);
  useEffect(() => {
    const measure = () => {
      const w = wrapRef.current?.getBoundingClientRect().width ?? 600;
      setOffX(Math.max(480, Math.ceil(w * 1.1))); // 여유분 10%
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /** (맨앞 카드 전용) 드래그 X 모션값 */
  const x = useMotionValue(0);

  /**
   * 덱 레이어 계산:
   *  - 모든 카드를 항상 마운트하고, key=원본 idx 로 고정한다(remount 방지 → 끊김 제거)
   *  - rel = (i - front + n) % n  (0=맨앞, 1, 2, ...)
   *  - visible 여부/깊이(depth=정렬/zIndex용)를 rel 기준으로 계산
   *  - depth 오름차순으로 정렬해서 "뒤→앞" 순으로 그리기
   */
  const layers = useMemo(() => {
    return Array.from({ length: n }, (_, i) => {
      const rel = (i - front + n) % n;
      const visible = rel < Math.min(VISIBLE, n);
      const depth = visible ? Math.min(VISIBLE, n) - 1 - rel : -1;
      return { idx: i, card: data[i], rel, depth, visible };
    }).sort((a, b) => a.depth - b.depth);
  }, [front, n, data]);

  /** 맨앞 카드가 바뀌면 플립 해제 + 부모 콜백 */
  useEffect(() => {
    setIsFlipped(false);
    onIndexChange?.(front);
  }, [front, onIndexChange]);

  /**
   * rel을 카드 스타일로 변환:
   *  - rel 증가할수록 위로(bottom↑), 살짝 축소(scale↓), zIndex는 낮아짐
   *  - 덱이 ‘아래에서 위로’ 쌓인 느낌
   */
  const relStyle = (rel: number) => {
    const limit = Math.min(VISIBLE, n) - 1;
    const r = Math.max(0, Math.min(rel, limit));
    const bottom = OVERLAP * r * 2.5;        // 층 간격
    const scale  = 1 - r * 0.04;             // 뒤로 갈수록 살짝 축소
    const z      = 100 + (limit - r);        // 앞(아래)일수록 zIndex 큼
    return { bottom, scale, z };
  };

  /**************
   * 고스트(떠나는/들어오는 카드)
   *  - 스와이프 순간 덱과 별도의 레이어로 애니메이션만 수행
   *  - 떠나는/leaver: 맨앞 카드가 스와이프 방향으로 화면 밖으로 빠져나감
   *  - 들어오는/arriver: 같은 카드가 스와이프 방향 바깥에서 다시 나타나 ‘덱의 맨 뒤 자리’로 슬라이드 인
   **************/
  type Leaver = { idx: number; dir: 1 | -1; bottom: number; scale: number; x0: number };
  type Arriver = { idx: number; dir: 1 | -1; bottom: number; scale: number };

  const [leaver, setLeaver]   = useState<Leaver | null>(null);
  const [arriver, setArriver] = useState<Arriver | null>(null);
  /** 고스트와 겹치지 않도록 덱에서 잠시 숨길 카드(원본 idx) */
  const [hiddenIdx, setHiddenIdx] = useState<number | null>(null);

  /** 고스트 이동용 x */
  const gx = useMotionValue(0); // 떠나는 카드
  const ax = useMotionValue(0); // 들어오는 카드

  /**
   * 공통 스와이프 처리:
   *  dir=+1(오른쪽), -1(왼쪽)
   * 순서:
   *  1) leaver(현재 top) 생성 → gx를 이용해 화면 밖으로 이동
   *  2) 덱 front 인덱스 회전 → 다음 카드가 top
   *  3) arriver(같은 카드) 생성 → ax를 이용해 바깥에서 "덱의 맨 뒤 자리"로 슬라이드 인
   *  4) 고스트/숨김 정리
   */
  const launchGhost = async (dir: 1 | -1) => {
    if (animating || n === 0) return;
    setAnimating(true);

    /** 현재 top 카드의 시작 위치/스케일 산출(덱의 rel 0 기준) */
    const { bottom: topBottom, scale: topScale } = relStyle(0);
    const startX = x.get(); // 사용자가 드래그로 움직인 x를 그대로 이어받음(연속감)

    // 떠나는 고스트 생성
    setLeaver({ idx: front, dir, bottom: topBottom, scale: topScale, x0: startX });
    setHiddenIdx(front);   // 덱에서는 이 카드 잠시 숨김(겹침 방지)
    x.set(0);              // 새 top 카드의 드래그값 초기화

    // 떠나는 고스트 → 화면 밖
    gx.set(startX);
    await animate(gx, dir * offX, { duration: 0.22, ease: "easeIn" });

    // 덱 front 회전(다음/이전 카드가 top)
    const nextFront = (front + (dir === 1 ? 1 : -1) + n) % n;
    setFront(nextFront);

    // "덱의 맨 뒤 자리"는 rel = min(VISIBLE-1, n-1)
    const backRel = Math.min(Math.min(VISIBLE, n) - 1, n - 1);
    const { bottom: backBottom, scale: backScale } = relStyle(backRel);

    // 들어오는 고스트 생성: 방향 바깥(offX)에서 덱의 맨 뒤 자리로 슬라이드 인
    setArriver({
      idx: leaver?.idx ?? front, // 방금 떠난 카드(동일 카드)
      dir,
      bottom: backBottom,
      scale: backScale,
    });
    ax.set(dir * offX);
    await animate(ax, 0, { duration: 0.22, ease: "easeOut" });

    // 고스트 및 숨김 상태 정리
    setLeaver(null);
    setArriver(null);
    setHiddenIdx(null);
    setAnimating(false);
  };

  // 오른쪽/왼쪽 스와이프 트리거
  const swipeNext = () => launchGhost(1);
  const swipePrev = () => launchGhost(-1);

  /** 드래그 종료 시 스와이프 판정 (거리/속도 임계치) */
  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (animating) return;
    const dx = info.offset.x ?? 0;
    const vx = info.velocity.x ?? 0;
    const DIST = 60, VEL = 500;

    if (dx > DIST || vx > VEL)  return swipeNext(); // 오른쪽으로 넘김
    if (dx < -DIST || vx < -VEL) return swipePrev(); // 왼쪽으로 넘김

    // 되돌리기
    animate(x, 0, { duration: 0.18, ease: "easeOut" });
  };

  return (
    <div
      ref={wrapRef}
      className="relative flex-1 w-full flex flex-col items-center overscroll-contain mb-[50px] scroll-anchor-none"
      style={{
        touchAction: "pan-y",
        // FlipCard/GhostCard 내부에서 동일 폭을 쓰기 위해 CSS 변수로 전파
        // @ts-ignore - CSS var
        ["--card-w" as any]: cardWidth,
      }}
    >
      {/* 1) 배경 이미지: 모든 카드보다 ‘뒤’(z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          alt="뒷배경"
          src={"/icons/character/back.png"}
          fill
          className="object-contain opacity-95"
          priority
        />
      </div>

      {/* 2) 덱: 모든 카드를 항상 마운트(z-10). rel 변화만으로 위치/스케일이 자연스럽게 이동 */}
      <div className="relative z-10" style={{ width: "var(--card-w)", aspectRatio: cardAspectRatio }}>
        <div className="absolute inset-0">
          {layers.map(({ idx, card, rel, depth, visible }) => {
            const isTop = rel === 0;
            const { bottom, scale, z } = relStyle(rel);

            return (
              <motion.div
                key={idx}                               // 원본 인덱스로 고정: remount 방지
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  zIndex: z,
                  willChange: "transform",
                  transformOrigin: "center bottom",
                  x: isTop ? x : 0,                     // 맨앞 카드만 드래그 반영
                  opacity: visible && hiddenIdx !== idx ? 1 : 0,
                  width: "var(--card-w)",
                }}
                animate={{ bottom, scale, opacity: visible && hiddenIdx !== idx ? 1 : 0 }}
                transition={{
                  bottom: { type: "spring", stiffness: 320, damping: 30 },
                  scale:  { type: "spring", stiffness: 280, damping: 28 },
                  opacity:{ duration: 0.12 },
                }}
                drag={isTop ? "x" : false}
                dragElastic={0.15}
                dragMomentum={false}
                onDragEnd={isTop ? onDragEnd : undefined}
                whileTap={isTop ? { scale: 0.995 } : undefined}
              >
                <FlipCard
                  imageUri={card.imageUri}
                  name={card.name}
                  handle={card.handle}
                  description={card.description}
                  isActive={isTop}
                  isFlipped={isTop ? isFlipped : false}
                  setIsFlipped={isTop ? setIsFlipped : () => {}}
                  width={"var(--card-w)"}
                  aspectRatio={cardAspectRatio}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3) 떠나는 고스트: 덱 위 최상단(z-30)에서 화면 밖으로 */}
      {leaver && (
        <motion.div
          className="absolute z-30 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            willChange: "transform",
            transformOrigin: "center bottom",
            bottom: leaver.bottom,
            scale: leaver.scale,
            x: gx,
            width: "var(--card-w)",
          }}
        >
          <GhostCard card={data[leaver.idx]} width={"var(--card-w)"} aspectRatio={cardAspectRatio} />
        </motion.div>
      )}

      {/* 4) 들어오는 고스트: 덱의 맨 뒤 자리 근처(z-5)로 슬라이드 인 */}
      {arriver && (
        <motion.div
          className="absolute z-[5] left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            willChange: "transform",
            transformOrigin: "center bottom",
            bottom: arriver.bottom,
            scale: arriver.scale,
            x: ax,
            width: "var(--card-w)",
          }}
        >
          <GhostCard card={data[arriver.idx]} width={"var(--card-w)"} aspectRatio={cardAspectRatio} />
        </motion.div>
      )}
    </div>
  );
}

/*****************
 * FlipCard: 맨앞(활성) 카드만 ‘뒤집힘’ 허용
 * - 앞면/뒷면을 분리하고 rotateY(0↔180) 구간에서 opacity 크로스페이드
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
  aspectRatio: number;
  isActive: boolean;
  isFlipped: boolean;
  setIsFlipped: (v: boolean) => void;
}) {
  const rotateY = useMotionValue(0);

  // 회전 각도에 따른 앞/뒤 면의 투명도
  const frontOpacity = useTransform(rotateY, [0, 90, 180], [1, 0, 0]);
  const backOpacity  = useTransform(rotateY, [0, 90, 180], [0, 0, 1]);

  // isFlipped 변화에 따라 회전 애니메이션
  useEffect(() => {
    const target = isFlipped ? 180 : 0;
    const controls = animate(rotateY, target, { type: "spring", stiffness: 200, damping: 18 });
    return controls.stop;
  }, [isFlipped, rotateY]);

  // 탭으로 앞/뒤 토글 (활성 카드에만 허용)
  const toggle = React.useCallback(() => {
    if (!isActive) return;
    setIsFlipped(!isFlipped);
  }, [isActive, isFlipped, setIsFlipped]);

  return (
    <div className="w-full relative" style={{ width, perspective: 1000 }}>
      <motion.div
        onTap={toggle}
        style={{
          width: "100%",
          aspectRatio,
          transformStyle: "preserve-3d",
          rotateY,                 // 0 ↔ 180deg
          touchAction: "pan-y",
          willChange: "transform, opacity",
        }}
        className="relative mx-auto bg-white rounded-2xl overflow-hidden shadow-[0_10px_24px_rgba(0,0,0,0.15)] select-none"
      >
        {/* Front (이미지) */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ backfaceVisibility: "hidden", opacity: frontOpacity, transform: "translateZ(0.1px)" }}
          aria-hidden={isFlipped}
        >
          <div className="absolute inset-3 bg-white rounded-xl" style={{ opacity: "inherit" }}>
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

        {/* Back (텍스트) */}
        <motion.div
          className="absolute inset-0 bg-white z-20"
          style={{
            backfaceVisibility: "hidden",
            transform: "scaleX(-1) translateZ(0)", // 3D 회전과 시각 일치
            opacity: backOpacity,
            transformOrigin: "center",
          }}
          aria-hidden={!isFlipped}
        >
          <div className="flex h-full flex-col p-4">
            <div className="mt-6 mb-2">
              <div className="text-[18px] font-bold text-neutral-900">
                {name}
                {handle ? <span className="font-semibold text-neutral-500">{handle}</span> : null}
              </div>
            </div>
            <hr className="border-neutral-200 mb-3" />
            <div className="text-[14px] leading-5 text-neutral-700 whitespace-pre-wrap overflow-y-auto pr-1" style={{ WebkitOverflowScrolling: "touch" }}>
              {description}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/*****************
 * GhostCard: 고스트 렌더 전용(플립/인터랙션 없음)
 *****************/
function GhostCard({
  card,
  width,
  aspectRatio,
}: {
  card: CharacterCard;
  width: string;
  aspectRatio: number;
}) {
  return (
    <div className="w-full relative" style={{ width }}>
      <div
        className="relative mx-auto bg-white rounded-2xl overflow-hidden shadow-[0_10px_24px_rgba(0,0,0,0.15)] select-none"
        style={{ aspectRatio }}
      >
        <div className="absolute inset-3 bg-white rounded-xl">
          <div className="relative w-[95%] h-[95%] place-self-center">
            <Image
              src={card.imageUri}
              alt={card.name}
              fill
              sizes="(max-width: 768px) 80vw, 520px"
              quality={95}
              priority
              className="object-contain pointer-events-none select-none"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
