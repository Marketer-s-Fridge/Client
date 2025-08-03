"use client";

import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/header";
import Image from "next/image";
import Footer from "@/components/footer";
import Breadcrumb from "@/components/breadCrumb";
import MobileMenu from "@/components/mobileMenu";

const categories = ["Beauty", "Food", "Lifestyle", "Tech", "Fashion"];

const slideImages = [
  "/images/001.png",
  "/images/002.png",
  "/images/003.png",
  "/images/004.png",
  "/images/005.png",
  "/images/006.png",
];

export default function CardNewsDetailPage() {
  const [activeCategory, setActiveCategory] = useState("Beauty");
  const [activeSlide, setActiveSlide] = useState(0);
  const slideCount = slideImages.length;
  const [menuOpen, setMenuOpen] = useState(false);
  const slideBoxRef = useRef<HTMLDivElement>(null);
  const [slideHeight, setSlideHeight] = useState<number>(0);

  useEffect(() => {
    const node = slideBoxRef.current;
    if (!node) return;

    const updateHeight = () => {
      setSlideHeight(node.offsetHeight);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(node);
    updateHeight(); // 초기 설정

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="bg-white pt-17 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 상단 카테고리 탭 */}
      <nav className="flex border-b border-gray-200 text-sm font-medium mt-1 overflow-x-auto no-scrollbar gap-5 px-[5%] lg:px-[17%]">
        {categories.map((cat) => (
          <span
            key={cat}
            className={`whitespace-nowrap px-2 py-2 cursor-pointer ${
              cat === activeCategory
                ? "text-red-500 font-bold border-b-2 border-red-500"
                : "text-gray-700 font-bold"
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </span>
        ))}
      </nav>

      <Breadcrumb category={activeCategory} />

      {/* 본문 */}
      <main className="flex justify-center px-4 sm:px-[8%] lg:px-[17%] mt-10 mb-10 md:py-14 min-h-[80vh]">
        <div className="w-full max-w-screen-lg flex flex-col sm:flex-row gap-10">
          {/* 카드 슬라이드 */}
          <div className="relative w-full sm:w-[45%] flex flex-col items-center">
            <div
              ref={slideBoxRef}
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "4 / 5" }}
            >
              {/* 인디케이터 */}
              <div className="z-10 absolute bottom-[2%] left-1/2 -translate-x-1/2 flex gap-1">
                {[...Array(slideCount)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full ${
                      idx === activeSlide
                        ? "bg-white"
                        : "bg-gray-500 opacity-85"
                    }`}
                  ></div>
                ))}
              </div>

              {/* 슬라이드 컨테이너 */}
              <div
                className="relative flex transition-transform duration-500 ease-in-out"
                style={{
                  width: `${slideCount * 100}%`,
                  transform: `translateX(-${
                    (100 / slideCount) * activeSlide
                  }%)`,
                }}
              >
                {slideImages.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative"
                    style={{
                      width: `${100 / slideCount}%`,
                      aspectRatio: "4 / 5",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={src}
                      alt={`slide-${idx + 1}`}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                ))}
              </div>

              {/* 좌우 클릭 영역 */}
              <div
                className="absolute top-0 left-0 h-full w-1/2 z-10 cursor-pointer"
                onClick={() => setActiveSlide((prev) => Math.max(prev - 1, 0))}
              />
              <div
                className="absolute top-0 right-0 h-full w-1/2 z-10 cursor-pointer"
                onClick={() =>
                  setActiveSlide((prev) => Math.min(prev + 1, slideCount - 1))
                }
              />

              {/* 화살표 */}
              {activeSlide > 0 && (
                <Image
                  width={150}
                  height={150}
                  className="absolute w-6 h-6 top-[47.5%] left-[1%]"
                  src="/icons/cardnews-bt-left.png"
                  alt="←"
                />
              )}
              {activeSlide < slideCount - 1 && (
                <Image
                  width={150}
                  height={150}
                  className="absolute w-6 h-6 top-[47.5%] right-[1%]"
                  src="/icons/cardnews-bt-right.png"
                  alt="→"
                />
              )}
            </div>
          </div>

          {/* 텍스트 + 버튼 */}
          <div
            className="w-full sm:w-[55%] flex flex-col mb-15 md:mb-0"
            style={{ height: slideHeight || "auto" }}
          >
            <div
              className={`
      pr-2 py-2
      ${slideHeight ? "sm:flex-1 sm:overflow-y-auto sm:no-scrollbar" : ""}
    `}
            >
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                뭐라고? 쿠션이 40가지나 된다고?!
              </h1>
              <div className="text-xs text-gray-500 mb-4">
                2025.05.07 · 12,324 views · 냉장고에 담은 사람 1,231
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <strong className="text-lg sm:text-xl block mb-2 text-black">
                  TIRTIR의 마케팅 전략: 소비자 중심과 다양한 색상
                </strong>
                TIRTIR는 단순한 뷰티 브랜드가 아닙니다. 소비자의 목소리를
                진지하게 듣고, 그들의 필요를 충족시키기 위해 끊임없이 노력하는
                브랜드입니다. 특히 40가지 다양한 쿠션 색상으로 모든 피부 톤을
                아우르는 제품을 선보이며, 누구나 자신에게 맞는 제품을 쉽게 찾을
                수 있도록 배려하고 있습니다.
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
                서비스를 제공하기 위해 끊임없이 발전하고 있습니다. 결국 TIRTIR는
                소비자 중심의 브랜드로, 고객의 만족과 신뢰를 가장 중요한 가치로
                삼고 있습니다. {/* 생략 */}
              </p>
            </div>

            <div className="bg-white flex justify-end gap-4 mt-4 ">
              <button className="border border-gray-300 rounded-full px-4 py-1 text-sm flex items-center gap-2 cursor-pointer">
                <Image
                  src="/icons/pinkheart.png"
                  alt="하트"
                  width={16}
                  height={16}
                />
                MY냉장고에 저장
              </button>
              <button className="border border-gray-300 rounded-full px-2 py-1 text-sm cursor-pointer">
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
      </main>

      <Footer />
    </div>
  );
}
