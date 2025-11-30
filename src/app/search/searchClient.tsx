// src/app/search/SearchClient.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchInput from "@/components/searchInput";
import ScrollToTopButton from "@/components/scrollToTopButton";
import CategoryTabBar from "@/components/categoryTabBar";
import Pagination from "@/components/pagination";
import CardGrid from "@/components/cardGrid";
import { usePosts } from "@/features/posts/hooks/usePosts";
import { Content } from "@/features/posts/hooks/usePosts";
const PAGE_SIZE = 9; // 한 페이지 카드 개수 (3열 * 3행 기준)

const getTime = (item: Content): number => {
  const dateStr = item.publishedAt ?? item.createdAt;
  return dateStr ? new Date(dateStr).getTime() : 0;
};

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q")?.trim() || "";

  const [selectedSort, setSelectedSort] = useState<"최신순" | "오래된순">(
    "최신순"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ 전체 게시물(PUBLISHED) 조회
  const { data: posts, isLoading, error } = usePosts();

  // ✅ 카테고리 + 검색어 + 정렬 한 번에 처리
  const filteredContents = useMemo<Content[]>(() => {
    if (!posts) return [];

    let result: Content[] = posts;

    // 1) 카테고리 필터 (All이면 전체)
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // 2) 검색어 필터 (title + subTitle)
    if (query) {
      const lower = query.toLowerCase();

      result = result.filter((item) => {
        const title = item.title.toLowerCase();
        const subTitle = item.subTitle?.toLowerCase?.() ?? "";
        return title.includes(lower) || subTitle.includes(lower);
      });
    }

    // 3) 정렬 (최신순 / 오래된순)
    const sorted = [...result].sort((a, b) => {
      const aTime = getTime(a);
      const bTime = getTime(b);

      if (selectedSort === "최신순") {
        return bTime - aTime; // 최신 먼저
      }
      if (selectedSort === "오래된순") {
        return aTime - bTime; // 오래된 먼저
      }
      return 0;
    });

    return sorted;
  }, [posts, query, selectedCategory, selectedSort]);

  // 검색 조건 바뀌면 페이지 1로 리셋
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

  // ✅ 검색 결과 없으면 /noResult 로 자동 이동 (검색어 있을 때만)
  useEffect(() => {
    if (!isLoading && !error && query && filteredContents.length === 0) {
      router.push(`/search/noResult?q=${encodeURIComponent(query)}`);
    }
  }, [isLoading, error, filteredContents, query, router]);

  return (
    <>
      {/* PC 상단 검색 영역 */}
      <section className="hidden md:flex flex-col items-center main-red pb-10 px-4">
        <SearchInput showInstagramButton={false} />
      </section>

      <CategoryTabBar
        categories={["All", "food", "lifestyle", "beauty", "tech", "fashion"]}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        sortOptions={["최신순", "오래된순"]}
        selectedSort={selectedSort}
        onSortChange={(value) =>
          setSelectedSort(value as "최신순" | "오래된순")
        }
      />

      {/* 카드 리스트 */}
      <section className="px-[10%] md:px-[22.5%] py-12">
        <h2 className="text-xl font-bold mb-6">
          ‘{query || (selectedCategory === "All" ? "전체" : selectedCategory)}’
          검색 결과
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

        {!isLoading && !error && filteredContents.length > 0 && (
          <>
            <CardGrid
              items={pagedContents.map((post) => ({
                id: post.id,
                title: post.title,
                imageUrl: post.images?.[0],
              }))}
              columns={3}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}

        <ScrollToTopButton />
      </section>
    </>
  );
}
