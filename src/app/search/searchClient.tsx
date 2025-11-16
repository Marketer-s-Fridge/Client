// src/app/search/searchClient.tsx (예시 경로)
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchInput from "@/components/searchInput";
import ScrollToTopButton from "@/components/scrollToTopButton";
import CategoryTabBar from "@/components/categoryTabBar";
import Pagination from "@/components/pagination";
import CardGrid from "@/components/cardGrid";
import { usePosts } from "@/features/posts/hooks/usePosts";

const PAGE_SIZE = 9; // 한 페이지 카드 개수 (3열 * 3행 기준)

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";

  const [selectedSort, setSelectedSort] = useState("최신순");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ 전체 게시물(PUBLISHED) 조회
  const { data: posts, isLoading, error } = usePosts();

  // ✅ 검색어 기반 필터링 (지금은 카테고리/정렬은 실제 필터에 아직 안 씀 — 원래 코드도 안 쓰고 있었음)
  const filteredContents = useMemo(() => {
    if (!posts) return [];

    // 검색어 없으면 전체 보기
    if (!query) return posts;

    const lower = query.toLowerCase();
    return posts.filter((item) => item.title.toLowerCase().includes(lower));
  }, [posts, query]);

  // 검색어/정렬/카테고리 바뀌면 페이지 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedSort, selectedCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredContents.length / PAGE_SIZE)
  );

  const pagedContents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredContents.slice(start, start + PAGE_SIZE);
  }, [filteredContents, currentPage]);

  return (
    <>
      {/* 검색 영역 (PC) */}
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

        {isLoading && (
          <p className="text-center text-gray-500 py-12">
            콘텐츠를 불러오는 중입니다...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 py-12">
            콘텐츠를 불러오는 중 오류가 발생했습니다.
          </p>
        )}

        {!isLoading && !error && (
          <>
            {filteredContents.length > 0 ? (
              <>
                <CardGrid items={pagedContents} columns={3} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
            ) : (
              <p className="text-center text-gray-500 py-12">
                ‘{query}’에 해당하는 결과가 없습니다 😢
              </p>
            )}
          </>
        )}

        <ScrollToTopButton />
      </section>
    </>
  );
}
