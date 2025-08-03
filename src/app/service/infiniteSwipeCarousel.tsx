"use client";

import React, { useRef, useState } from "react";
import { FiChevronRight } from "react-icons/fi";

const initialCards = [
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

export default function InfiniteSwipeCarousel() {
  const [cards, setCards] = useState(initialCards);
  const [isSliding, setIsSliding] = useState(false);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const deltaY = touchStartY.current - touchEndY.current;
    if (deltaY > 30 && !isSliding) {
      setIsSliding(true);
    }
  };

  const handleClickNext = () => {
    if (!isSliding) {
      setIsSliding(true);
    }
  };

  const handleTransitionEnd = () => {
    if (isSliding) {
      // 가장 위 카드를 가장 아래로 보냄
      setCards((prev) => [...prev.slice(1), prev[0]]);
      setIsSliding(false);
    }
  };

  const overlapOffset = 26;
  const cardHeight = 186;
  const bgColors = ["#FF4545", "#FF6C6C", "#FF9999", "#FFDADA"];
  const textColors = ["white", "white", "white", "black"];

  return (
    <div className="w-full max-w-[420px] h-[430px] relative mx-auto">
      <div className="relative h-full w-full">
        {[...cards]
          .slice()
          .reverse()
          .map((card, idx) => {
            const position = idx;
            const isTopCard = idx === 0;
            const offset = overlapOffset * position * 2.5;
            const zIndex = cards.length - idx;

            const bgColor = bgColors[position];
            const textColor = textColors[position];

            return (
              <div
                key={card.title}
                className={`absolute left-0 w-full px-4 transition-transform duration-500 ease-in-out ${
                  isSliding && isTopCard
                    ? "-translate-y-[26px]"
                    : "translate-y-0"
                }`}
                style={{
                  bottom: `${offset}px`,
                  zIndex: zIndex,
                }}
                onTransitionEnd={isTopCard ? handleTransitionEnd : undefined}
              >
                <div
                  className="flex flex-col rounded-xl px-5 py-6 h-[186px] text-[20px] font-bold transition-all duration-300"
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                  }}
                  onTouchStart={isTopCard ? handleTouchStart : undefined}
                  onTouchMove={isTopCard ? handleTouchMove : undefined}
                  onTouchEnd={isTopCard ? handleTouchEnd : undefined}
                >
                  <div className="leading-tight font-semibold">
                    {card.title}
                  </div>

                  <p
                    className={`text-[13.5px] font-medium mt-7 leading-snug whitespace-pre-line ${
                      card.description ? "visible" : "invisible"
                    }`}
                  >
                    {card.description || " "}
                  </p>

                  {isTopCard && (
                    <div
                      className="flex items-center justify-end text-sm mt-8 cursor-pointer gap-1"
                      onClick={handleClickNext}
                    >
                      <span className="animate-pulse text-[13px] font-medium">
                        옆으로 스와이프
                      </span>
                      <FiChevronRight className="animate-pulse text-[18px]" />
                      <FiChevronRight className="animate-pulse text-[18px] -ml-1" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
