// components/CardNewsDetailPage.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/header";
import Image from "next/image";

const categories = ["Beauty", "Food", "Lifestyle", "Tech", "Fashion"];

export default function CardNewsDetailPage() {
  const [activeCategory, setActiveCategory] = useState("Beauty");
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft =
        activeSlide * scrollRef.current.clientWidth;
    }
  }, [activeSlide]);

  return (
    <div>
      <Header />

      {/* 상단 카테고리 탭 */}
      <nav className="flex justify-center border-b border-gray-200 text-sm font-medium mt-1 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <span
            key={cat}
            className={`whitespace-nowrap px-4 py-2 cursor-pointer ${
              cat === activeCategory
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-700"
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </span>
        ))}
      </nav>

      {/* 본문 */}
      <main className="max-w-[1024px] mx-auto px-4 sm:px-6 py-7">
        {/* 경로 표시 */}
        <div className="text-sm text-gray-400 mb-20">
          홈 &gt; 카테고리 &gt;{" "}
          <span className="text-black font-medium">{activeCategory}</span>
        </div>

        <div className="flex flex-col md:flex-row md:justify-center gap-8">
          {/* 카드 슬라이드 */}
          <div className="w-full sm:w-[260px] md:w-[340px] flex flex-col items-center">
            <div
              ref={scrollRef}
              className="overflow-x-auto flex snap-x snap-mandatory space-x-4 no-scrollbar w-full h-auto"
              style={{ aspectRatio: "4 / 5" }}
              onScroll={(e) => {
                const index = Math.round(
                  e.currentTarget.scrollLeft / e.currentTarget.clientWidth
                );
                setActiveSlide(index);
              }}
            >
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="w-full snap-center shrink-0 rounded-xl bg-black relative"
                  style={{ aspectRatio: "4 / 5" }}
                >
                  <Image
                    src="/images/content-beauty1.png"
                    alt="card"
                    fill
                    className="object-contain rounded-xl"
                  />
                </div>
              ))}
            </div>
            {/* 슬라이드 인디케이터 */}
            <div className="flex justify-center mt-4 gap-1">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full ${
                    idx === activeSlide ? "bg-red-500" : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* 텍스트 영역 + 버튼 포함 */}
          <div
            className="w-full md:w-[420px]  aspect-[4/5]"
          >
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-scroll pr-2 py-2 px-1 ">
                <h1 className="text-2xl font-bold mb-2">
                  뭐라고? 쿠션이 40가지나 된다고?!
                </h1>
                <div className="text-xs text-gray-500 mb-4">
                  2025.05.07 · 12,324 views · 냉장고에 담은 사람 1,231
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong className="block mb-2 text-black">
                    TIRTIR의 마케팅 전략: '소비자 중심'과 '다양한 색상'
                  </strong>
                  TIRTIR는 단순한 뷰티 브랜드가 아닙니다. 소비자의 목소리를
                  진지하게 듣고, 그들의 필요를 충족시키기 위해 끊임없이 노력하는
                  브랜드입니다. 특히 40가지 다양한 쿠션 색상으로 모든 피부 톤을
                  아우르는 제품을 선보이며, 누구나 자신에게 맞는 제품을 쉽게
                  찾을 수 있도록 배려하고 있습니다.
                  <br />
                  <br />
                  TIRTIR는 고객의 피드백을 반영해 제품을 개선하고, SNS와 온라인
                  소통을 통해 브랜드에 대한 신뢰를 쌓아가고 있습니다. 그 결과,
                  대중적인 인기를 얻고, 글로벌 시장에서도 인정받는 브랜드로 자리
                  잡았죠.
                  <br />
                  <br />
                  가장 중요한 건 바로 소비자 중심. 고객이 원하는 것을 듣고,
                  반영하는 브랜드가 되기 위해 항상 노력하고 있습니다. 피부 톤에
                  맞는 다양한 색상을 제공하는 것처럼, 고객이 원하는 맞춤형
                  서비스를 제공하기 위해 끊임없이 발전하고 있습니다.결국
                  TIRTIR는 소비자 중심의 브랜드로, 고객의 만족과 신뢰를 가장
                  중요한 가치로 삼고 있습니다.
                </p>
              </div>

              {/* 고정 버튼 */}
              <div className="bg-white flex justify-end gap-4 ">
                <button className="border border-gray-300 rounded-full px-4 py-1 text-sm flex items-center gap-2 ">
                  <Image
                    src="/icons/pinkheart.png"
                    alt="하트"
                    width={16}
                    height={16}
                  />
                  MY냉장고에 저장
                </button>
                <button className="border border-gray-300 rounded-full px-2 py-1 text-sm">
                  <Image
                    src="/icons/share.png"
                    alt="공유"
                    width={16}
                    height={16}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
