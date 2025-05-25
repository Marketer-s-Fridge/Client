"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchInput from "@/components/searchInput";
import ScrollToTopButton from "@/components/scrollToTopButton";
import CategoryTabBar from "@/components/categoryTabBar";
import Image from "next/image";

const mockContents = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  title: [
    "신규 브랜드 탐방: 떠오르는 핫 브랜드",
    "패션 아이콘들이 선택한 신상템",
    "셀럽들의 공항 패션 스타일",
    "KOREADB 2025 뉴 브랜드",
    "시간을 초월한 클래식 아이템",
    "포인트 컬러로 완성하는 룩",
  ][i],
}));

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "전체";
  const [selectedSort, setSelectedSort] = useState("최신순");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  return (
    <>
      {/* 검색 영역 */}
      <section className="flex flex-col items-center main-red pt-10 pb-10 px-4">
        <SearchInput showInstagramButton={false} />
      </section>

      <CategoryTabBar
        categories={["All", "food", "lifestyle", "beauty", "tech", "fashion"]}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        sortOptions={["최신순", "오래된순"]}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
      />

      {/* 카드 리스트 */}
      <section className="w-4/7 max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 py-12">
        <h2 className="text-xl font-bold mb-6">‘{query}’ 검색 결과</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
          {mockContents.map((item) => (
            <div key={item.id} className="w-full">
              <div className="aspect-[6/7] w-full rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src="/icons/rectangle-gray.png"
                  alt={item.title}
                  width={300}
                  height={350}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pt-2 px-1 text-sm font-semibold truncate flex items-center justify-between">
                {item.title}
                <button>
                  <Image
                    src="/icons/grayheart.png"
                    alt="찜하기"
                    width={16}
                    height={16}
                    className="w-4 h-4 cursor-pointer"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center items-center gap-4 mt-14 mb-10">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-full text-sm font-semibold ${
                page === 1 ? "bg-red-500 text-white" : "text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
          <ScrollToTopButton />
        </div>
      </section>
    </>
  );
}
