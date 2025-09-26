"use client";

import Header from "@/components/header";
import SearchInput from "@/components/searchInput";
import React from "react";
import CategoryTabBar from "@/components/categoryTabBar";
import { useState } from "react";
import Image from "next/image";
import Footer from "@/components/footer";
import MobileMenu from "@/components/mobileMenu";

const mockContents = [
  { title: "신규 브랜드 탐방: 떠오르는 핫 브랜드", category: "🔥 인기 콘텐츠" },
  { title: "패션 아이콘들이 선택한 신상템", category: "✨ 에디터 픽" },
  { title: "셀럽들의 공항 패션 스타일", category: "👀 최신 업로드" },
  // { title: "KOREADB 2025 뉴 브랜드" },
  // { title: "시간을 초월한 클래식 아이템" },
  // { title: "포인트 컬러로 완성하는 룩" },
];

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedSort, setSelectedSort] = useState("최신순");

  return (
    <div className="min-h-screen bg-white mt-16 md:mt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <section className="hidden md:flex flex-col items-center main-red pb-10">
        <SearchInput showInstagramButton={false}></SearchInput>
      </section>

      <CategoryTabBar
        categories={["All", "food", "lifestyle", "beauty", "tech", "fashion"]}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        sortOptions={["최신순", "오래된순", "인기순", "조회순"]}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
      />

      {/* 검색 결과 없음 메시지 */}
      <section className="px-[7%] lg:px-[17%] py-18 text-center">
        <h1 className="text-xl md:text-2xl font-bold mb-10">
          ‘어쩌구저쩌구’에 대한 콘텐츠가 아직 준비되지 않았습니다.
        </h1>
        {/* 냉장고 비어있는 이미지 */}
        <div className="flex justify-center mb-8">
          <Image
            src="/icons/noContents.png"
            className="w-[80%] md:w-[50%] h-auto object-contain"
            alt=""
            width={500}
            height={250}
          ></Image>
        </div>

        {/* 카드 리스트 */}
        <section className="place-self-center py-12">
          <h3 className="text-lg md:text-2xl font-bold mb-10">
            이런 콘텐츠는 어떠세요?
          </h3>

          <div className="grid grid-cols-3 md:grid-cols-3 gap-x-6 gap-y-10">
            {mockContents.map((item, index) => (
              <div key={index} className="w-full">
                <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src="/icons/rectangle-gray.png"
                    alt={item.title}
                    className="w-full h-full object-cover cursor-pointer"
                    width={50}
                    height={50}
                  />
                  <div className="border-gray-400 border-1 bg-white w-auto px-1 py-0 sm:px-2.5 sm:py-0.5 h-6 text-[10px] sm:text-sm rounded absolute top-3 right-3 text-center ">
                    {item.category}
                  </div>
                </div>
                <div className="pt-2 px-1 text-[10px] sm:text-sm font-semibold truncate flex items-center justify-between">
                  {item.title}
                  <button>
                    <Image
                      src="/icons/grayheart.png"
                      alt="찜하기"
                      className="w-4 h-4"
                      width={50}
                      height={50}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
      <Footer />
    </div>
  );
}
