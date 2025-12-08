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

  // ✅ 1차: "검색어" 기준으로만 필터링한 검색 결과 집합
  const searchedContents = useMemo<Content[]>(() => {
    if (!posts) return [];

    // 검색어가 없으면 전체 게시물 반환
    if (!query) return posts;

    const lower = query.toLowerCase();

    return posts.filter((item) => {
      const title = item.title.toLowerCase();
      const subTitle = item.subTitle?.toLowerCase?.() ?? "";
      return title.includes(lower) || subTitle.includes(lower);
    });
  }, [posts, query]);

  // ✅ 2차: 검색 결과 집합(searchedContents) 위에서 카테고리 + 정렬 처리
  const filteredContents = useMemo<Content[]>(() => {
    let result: Content[] = searchedContents;

    // 1) 카테고리 필터 (All이면 전체)
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // 2) 정렬 (최신순 / 오래된순)
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
  }, [searchedContents, selectedCategory, selectedSort]);

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

  // ✅ 검색어 기준 1차 검색 결과가 0개일 때만 /noResult 이동
  useEffect(() => {
    if (!isLoading && !error && query && searchedContents.length === 0) {
      router.push(`/search/noResult?q=${encodeURIComponent(query)}`);
    }
  }, [isLoading, error, query, searchedContents, router]);

  // ✅ 헤더 문구
  const headerLabel = query
    ? `'${query}' 검색 결과`
    : selectedCategory === "All"
    ? "전체 콘텐츠"
    : `'${selectedCategory}' 카테고리`;

  return (
    <>
      {/* PC 상단 검색 영역 */}
      <section className="hidden md:flex flex-col items-center main-red pb-10 px-4">
        <SearchInput showInstagramButton={false} />
      </section>

      <CategoryTabBar
        categories={["All", "Food", "Lifestyle", "Beauty", "Tech", "Fashion"]}
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
        <h2 className="text-xl font-bold mb-3">{headerLabel}</h2>
        {!isLoading && !error && (
          <p className="text-sm text-gray-500 mb-6">
            총 {filteredContents.length}개의 콘텐츠가 있습니다.
          </p>
        )}

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

        {/* 정상 상태 */}
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

        {/* 검색 결과는 있지만, 현재 필터(카테고리/정렬) 조건으로는 0개일 때 */}
        {!isLoading && !error && searchedContents.length > 0 && filteredContents.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            이 조건에 맞는 콘텐츠가 없어요. 카테고리나 정렬을 바꿔보세요.
          </p>
        )}

        <ScrollToTopButton />
      </section>
    </>
  );
}
