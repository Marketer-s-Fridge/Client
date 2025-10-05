"use client";

import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/header";
import Image from "next/image";
import Footer from "@/components/footer";
import Breadcrumb from "@/components/breadCrumb";
import MobileMenu from "@/components/mobileMenu";
import SaveToFridgeButton from "@/components/saveToFridgeButton";

const categories = ["Beauty", "Food", "Lifestyle", "Tech", "Fashion"];

const slideImages = [
  "/images/cardNews/hot/001.png",
  "/images/cardNews/hot/002.png",
  "/images/cardNews/hot/003.png",
  "/images/cardNews/hot/004.png",
  "/images/cardNews/hot/005.png",
  "/images/cardNews/hot/006.png",
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
      <nav className="flex border-b border-gray-200 text-sm font-medium mt-1 overflow-x-auto no-scrollbar gap-5 px-[5%] lg:px-[17%] ">
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
      <main className="flex justify-center px-4 sm:px-[8%] lg:px-[17%] mt-10 mb-10 min-h-[70vh] pb-[-0]">
        <div className=" w-full max-w-screen-lg flex flex-col sm:flex-row gap-10">
          {/* 카드 슬라이드 */}
          <div className="self-center relative w-full sm:w-[45%] flex flex-col items-center">
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
            className="self-center w-full sm:w-[55%] flex flex-col mb-15 md:mb-0"
            style={{ height: slideHeight || "auto" }}
          >
            <div
              className={`
      pr-2 py-2
      ${slideHeight ? "sm:flex-1 sm:overflow-y-auto sm:no-scrollbar" : ""}
    `}
            >
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                콜라보의 새로운 기준 제니 X 스탠리
              </h1>
              <div className="text-xs text-gray-500 mb-6">
                2025.05.07 · 12,324 views · 냉장고에 담은 사람 1,231
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <strong className="text-lg sm:text-xl block mb-4 text-black">
                  제니효과 ✨ 들어보셨나요?
                </strong>
                제니(@jennierubyjane)의 취향은 곧 모두의 취향이 된다는 ’제니
                효과‘의 비밀은 단순한 유명세가 아니었어요. 제니는 단순한 모델
                역할을 넘어, 직접 디자인에 참여하는 크리에이터로서 한국 전통
                나전칠기의 우아한 감성을 담아냈죠.
                <br />
                <br /> 패키지부터 텀블러에 달린 귀여운 참까지, 그녀의 섬세한
                터치는 팬들의 소장 욕구를 완벽하게 자극했어요. 여기에
                스탠리(@stanley_korea)는 팝업 스토어에 팬들을 위한 백스테이지
                무드를 구현하고, 한정판 출시로 색다른 경험을 선물했습니다.
                <br />
                <br />
                이처럼 팬심을 이해하고 소통하는 마케팅은 역대급 반응을 일으키며,
                스탠리가 110년 전통을 넘어 라이프스타일의 완성으로 자리 잡게
                했어요. 이 콜라보가 성공할 수밖에 없었던 이유! 오늘도 제니
                스탠리와 함께 힙한 하루를 즐겨보세요! <br />
                <br />
                에디터 │ 지은
              </p>
            </div>

            <div className="bg-white flex justify-end gap-4 mt-4 ">
              <SaveToFridgeButton></SaveToFridgeButton>
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
