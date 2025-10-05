"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import SearchInput from "@/components/searchInput";
import ScrollToTopButton from "@/components/scrollToTopButton";
import CategoryTabBar from "@/components/categoryTabBar";
import Pagination from "@/components/pagination";
import CardGrid from "@/components/cardGrid";

const mockContents = [
  { id: 1, title: "신규 브랜드 탐방: 떠오르는 핫 브랜드" },
  { id: 2, title: "패션 아이콘들이 선택한 신상템" },
  { id: 3, title: "셀럽들의 공항 패션 스타일" },
  { id: 4, title: "KOREADB 2025 뉴 브랜드" },
  { id: 5, title: "시간을 초월한 클래식 아이템" },
  { id: 6, title: "포인트 컬러로 완성하는 룩" },
];

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const [selectedSort, setSelectedSort] = useState("최신순");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [likedItems, setLikedItems] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // ✅ 검색어 필터링
  const filteredContents = useMemo(() => {
    if (!query) return mockContents; // 검색어 없으면 전체 보기
    return mockContents.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <>
      {/* 검색 영역 */}
      <section className="hidden md:flex flex-col items-center main-red pb-10 px-4">
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
      <section className="px-[10%] md:px-[22.5%] py-12">
        <h2 className="text-xl font-bold mb-6">
          ‘{query || "전체"}’ 검색 결과
        </h2>

        {filteredContents.length > 0 ? (
          <>
            <CardGrid
              items={filteredContents}
              columns={3}
              likedItems={likedItems}
              onToggleLike={toggleLike}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        ) : (
          <p className="text-center text-gray-500 py-12">
            ‘{query}’에 해당하는 결과가 없습니다 😢
          </p>
        )}

        <ScrollToTopButton />
      </section>
    </>
  );
}
