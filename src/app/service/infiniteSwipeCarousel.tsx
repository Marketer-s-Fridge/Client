"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, animate, PanInfo } from "framer-motion";

type Card = { title: string; description: string };

const CARDS: Card[] = [
  {
    title: "트렌드 리포트",
    description:
      "지금 소비자와 시장은 어디로 가고 있을까요?\n핵심만 정리된 인사이트를 간결하게 제공합니다",
  },
  {
    title: "광고 사례 분석",
    description:
      "성공한 캠페인 속 전략, 브랜드의 '한 수'를 마케터의 눈으로 해석합니다",
  },
  {
    title: "SNS 캠페인 모음",
    description:
      "인스타그램, 틱톡, 유튜브 쇼츠까지\n가장 반응 좋았던 콘텐츠들을 맥락과 함께 소개합니다",
  },
  {
    title: "브랜드 전략 코멘터리",
    description:
      "이 브랜드는 왜 이렇게 말할까?\n말투, 타이밍, 비주얼까지 뜯어보며 전략의 뒷면을 짚어드립니다.",
  },
];

const VISIBLE = 4; // 화면에 쌓아 보일 수
const OVERLAP = 25; // 층 간 간격(px)

// 떠나는 카드(고스트)
type Leaver = {
  idx: number; // 원본 인덱스(=front였던 카드)
  dir: 1 | -1; // +1: 오른쪽, -1: 왼쪽
  bottom: number; // 떠나기 시작 위치
  scale: number; // 떠나기 시작 스케일
  bg: string;
  fg: string;
  x0: number; // 드래그 종료 당시 x (연속성)
};

// 다시 들어올 카드(고스트)
type Arriver = {
  idx: number; // 같은 카드
  dir: 1 | -1; // 들어오는 방향
  bottom: number; // 맨 뒤 레이어의 bottom
  scale: number; // 맨 뒤 레이어의 scale
  bg: string;
  fg: string;
};

export default function InfiniteSwipeCarousel() {
  const n = CARDS.length;
  const [front, setFront] = useState(0); // 맨앞 카드의 원본 인덱스
  const [animating, setAnimating] = useState(false);

  // 컨테이너 폭 → 화면 밖 거리
  const wrapRef = useRef<HTMLDivElement>(null);
  const [offX, setOffX] = useState(600);
  useEffect(() => {
    const measure = () => {
      const w = wrapRef.current?.getBoundingClientRect().width ?? 600;
      setOffX(Math.max(480, Math.ceil(w * 1.1)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // 최상단 카드 드래그 X
  const x = useMotionValue(0);

  // 색 팔레트(앞에서부터)
  const bg = ["#FF4545", "#FF6C6C", "#FF9999", "#FFDADA"];
  const fg = ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#000000"];

  // 레이어(모든 카드 항상 마운트 → 끊김 X)
  const layers = useMemo(() => {
    return Array.from({ length: n }, (_, i) => {
      const rel = (i - front + n) % n; // 0=맨앞(맨아래), 1, 2 ...
      const visible = rel < VISIBLE;
      const depth = visible ? VISIBLE - 1 - rel : -1; // zIndex용
      return { idx: i, card: CARDS[i], rel, depth, visible };
    }).sort((a, b) => a.depth - b.depth); // 뒤→앞 순으로 그리기
  }, [front, n]);

  // 레이어 스타일 계산 헬퍼
  const relStyle = (rel: number) => {
    const r = Math.max(0, Math.min(rel, VISIBLE - 1));
    const bottom = OVERLAP * r * 2.5; // rel 0 → 0(맨 아래)
    const scale = 1 - r * 0.04; // rel 커질수록 살짝 작게
    const z = 100 + (VISIBLE - 1 - r);
    const bgc = bg[r] ?? bg[bg.length - 1];
    const fgc = fg[r] ?? fg[fg.length - 1];
    return { bottom, scale, z, bgc, fgc };
  };

  // 고스트(떠나는/들어오는)
  const [leaver, setLeaver] = useState<Leaver | null>(null);
  const [arriver, setArriver] = useState<Arriver | null>(null);
  const [hiddenIdx, setHiddenIdx] = useState<number | null>(null); // 덱에서 잠시 숨길 카드(중복 방지)

  const gx = useMotionValue(0); // 떠나는 고스트 x
  const ax = useMotionValue(0); // 들어오는 고스트 x

  // 스와이프 공통(오른쪽: dir=+1 / 왼쪽: dir=-1)
  const launchGhost = async (dir: 1 | -1) => {
    if (animating) return;
    setAnimating(true);

    // 현재 top(rel 0)의 스타일(맨 아래)
    const {
      bottom: topBottom,
      scale: topScale,
      bgc: topBg,
      fgc: topFg,
    } = relStyle(0);
    const startX = x.get();

    // 떠나는 고스트 생성(현재 top)
    setLeaver({
      idx: front,
      dir,
      bottom: topBottom,
      scale: topScale,
      bg: topBg,
      fg: topFg,
      x0: startX,
    });
    // 덱에서는 해당 카드 숨김(중복 방지)
    setHiddenIdx(front);

    // 덱 회전: 다음 카드가 top으로
    const nextFront = (front + (dir === 1 ? 1 : -1) + n) % n;
    setFront(nextFront);

    // top 드래그는 즉시 리셋(고스트가 떠나므로 시각적 튐 없음)
    x.set(0);

    // 떠나는 고스트 → 화면 밖
    gx.set(startX);
    await animate(gx, dir * offX, { duration: 0.22, ease: "easeIn" });

    // 👉 "맨 뒤" 자리(보여주는 마지막 레이어 rel = min(VISIBLE-1, n-1))
    const backRel = Math.min(VISIBLE - 1, n - 1);
    const {
      bottom: backBottom,
      scale: backScale,
      bgc: backBg,
      fgc: backFg,
    } = relStyle(backRel);

    // 들어오는 고스트 생성: 오른쪽(또는 왼쪽) 바깥에서 시작해서 맨 뒤 자리로 "들어오게"
    setArriver({
      idx: front /* oldFront */,
      dir,
      bottom: backBottom,
      scale: backScale,
      bg: backBg,
      fg: backFg,
    });
    ax.set(dir * offX);
    await animate(ax, 0, { duration: 0.22, ease: "easeOut" });

    // 고스트/숨김 해제
    setLeaver(null);
    setArriver(null);
    setHiddenIdx(null);
    setAnimating(false);
  };

  const swipeNext = () => launchGhost(1); // 오른쪽: 나갔다가 오른쪽에서 다시 들어와 맨 뒤로
  const swipePrev = () => launchGhost(-1); // 왼쪽도 동일 논리(원하면 유지)

  const onDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (animating) return;
    const dx = info.offset.x ?? 0;
    const vx = info.velocity.x ?? 0;
    const DIST = 60,
      VEL = 500;
    if (dx > DIST || vx > VEL) return swipeNext();
    if (dx < -DIST || vx < -VEL) return swipePrev();
    animate(x, 0, { duration: 0.18, ease: "easeOut" });
  };

  return (
    <div
      ref={wrapRef}
      className="w-full max-w-[420px] h-[430px] relative mx-auto"
    >
      <div className="relative h-full w-full">
        {/* 덱: 모든 카드 항상 마운트(끊김 방지) */}
        {layers.map(({ idx, card, rel, visible }) => {
          const isTop = rel === 0;
          const { bottom, scale, z, bgc, fgc } = relStyle(rel);

          return (
            <motion.div
              key={idx}
              className="absolute left-0 text-left w-full px-4"
              style={{
                zIndex: z,
                willChange: "transform",
                transformOrigin: "center bottom",
                x: isTop ? x : 0,
                pointerEvents: isTop ? "auto" : "none",
                opacity: visible && hiddenIdx !== idx ? 1 : 0, // 숨김 처리
              }}
              animate={{
                bottom,
                scale,
                opacity: visible && hiddenIdx !== idx ? 1 : 0,
              }}
              transition={{
                bottom: { type: "spring", stiffness: 320, damping: 30 },
                scale: { type: "spring", stiffness: 280, damping: 28 },
                opacity: { duration: 0.12 },
              }}
              drag={isTop ? "x" : false}
              dragElastic={0.15}
              dragMomentum={false}
              onDragEnd={isTop ? onDragEnd : undefined}
              whileTap={isTop ? { scale: 0.995 } : undefined}
            >
              <div
                className="flex flex-col rounded-xl px-5 py-6 h-[186px] text-base md:text-[20px] font-bold select-none"
                style={{ backgroundColor: bgc, color: fgc }}
              >
                <div className="leading-tight font-semibold">{card.title}</div>
                <p className="text-[13.5px] font-medium mt-7 leading-snug whitespace-pre-line">
                  {card.description}
                </p>

                {isTop && (
                  <button
                    type="button"
                    className="flex items-center justify-end text-sm mt-4 cursor-pointer gap-1"
                    onClick={() => (animating ? undefined : swipeNext())}
                    disabled={animating}
                    aria-label="다음 카드로"
                  >
                    <span className="absolute animate-pulse bottom-[7%] text-[13px] font-medium">
                      {"옆으로 스와이프 > >"}
                    </span>
                  
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* 떠나는 고스트: 현재 top이 방향대로 화면 밖으로 */}
        {leaver && (
          <motion.div
            className="absolute left-0 text-left w-full px-4 pointer-events-none"
            style={{
              zIndex: 999,
              willChange: "transform",
              transformOrigin: "center bottom",
              bottom: leaver.bottom,
              scale: leaver.scale,
              x: gx,
            }}
          >
            <div
              className="flex flex-col rounded-xl px-5 py-6 h-[186px] text-base md:text-[20px] font-bold select-none"
              style={{ backgroundColor: leaver.bg, color: leaver.fg }}
            >
              <div className="leading-tight font-semibold">
                {CARDS[leaver.idx].title}
              </div>
              <p className="text-[13.5px] font-medium mt-7 leading-snug whitespace-pre-line">
                {CARDS[leaver.idx].description}
              </p>
            </div>
          </motion.div>
        )}

        {/* 들어오는 고스트: 오른쪽(또는 왼쪽) 바깥 → 맨 뒤 레이어 자리로 */}
        {arriver && (
          <motion.div
            className="absolute left-0 text-left w-full px-4 pointer-events-none"
            style={{
              zIndex: 100, // 맨 뒤 레이어 z와 동일/유사
              willChange: "transform",
              transformOrigin: "center bottom",
              bottom: arriver.bottom,
              scale: arriver.scale,
              x: ax,
            }}
          >
            <div
              className="flex flex-col rounded-xl px-5 py-6 h-[186px] text-base md:text-[20px] font-bold select-none"
              style={{ backgroundColor: arriver.bg, color: arriver.fg }}
            >
              <div className="leading-tight font-semibold">
                {CARDS[arriver.idx].title}
              </div>
              <p className="text-[13.5px] font-medium mt-7 leading-snug whitespace-pre-line">
                {CARDS[arriver.idx].description}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
