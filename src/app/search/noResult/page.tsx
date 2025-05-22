"use client";
import Header from "@/components/header";
import SearchInput from "@/components/searchInput";
import React from "react";
import CategoryTabBar from "@/components/categoryTabBar";
import { useState } from "react";
const mockContents = [
  { title: "신규 브랜드 탐방: 떠오르는 핫 브랜드", category: "🔥 인기 콘텐츠" },
  { title: "패션 아이콘들이 선택한 신상템", category: "✨ 에디터 픽" },
  { title: "셀럽들의 공항 패션 스타일", category: "👀 최신 업로드" },
  // { title: "KOREADB 2025 뉴 브랜드" },
  // { title: "시간을 초월한 클래식 아이템" },
  // { title: "포인트 컬러로 완성하는 룩" },
];

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedSort, setSelectedSort] = useState("최신순");

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="flex flex-col items-center main-red pt-10 pb-10">
        <SearchInput showInstagramButton={false}></SearchInput>
      </section>

      <CategoryTabBar
        categories={["All", "food", "lifestyle", "beauty", "tech","fashion"]}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        sortOptions={["최신순", "오래된순"]}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
      />

      {/* 검색 결과 없음 메시지 */}
      <section className="max-w-screen-lg mx-auto px-4 py-18 text-center">
        <h1 className="text-xl md:text-2xl font-bold mb-10">
          ‘어쩌구저쩌구’에 대한 콘텐츠가 아직 준비되지 않았습니다.
        </h1>
        {/* 냉장고 비어있는 이미지 */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-40 border rounded-lg flex items-center justify-center text-xs text-gray-500">
            냉장고가 비어있는 이미지
          </div>
        </div>

        {/* 카드 리스트 */}
        <section className="w-6/7 max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 py-12">
          <h3 className="text-2xl font-bold mb-10">이런 콘텐츠는 어떠세요?</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
            {mockContents.map((item, index) => (
              <div key={index} className="w-full">
                <div className="relative aspect-[6/7] w-full rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src="/icons/rectangle-gray.png"
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="border-gray-700 border-1 bg-white w-auto px-2.5 py-0.5 h-6 text-sm rounded absolute top-3 right-3 text-center ">
                    {item.category}
                  </div>
                </div>
                <div className="pt-2 px-1 text-sm font-semibold truncate flex items-center justify-between">
                  {item.title}
                  <button>
                    <img
                      src="/icons/grayheart.png"
                      alt="찜하기"
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
