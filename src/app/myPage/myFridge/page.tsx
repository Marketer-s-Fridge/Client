// src/app/myFridge/page.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Pagination from "@/components/pagination";
import ScrollToTopButton from "@/components/scrollToTopButton";
import CardGrid from "@/components/cardGrid";
import CategoryFilter from "@/components/categoryFilter";
import MobileMenu from "@/components/mobileMenu";
import { useBookmarkedPosts } from "@/features/bookmarks/hooks/useBookmarkedPost";

const categories = ["전체", "Beauty", "Fashion", "Food", "Lifestyle", "Tech"];
const ITEMS_PER_PAGE = 12;

export default function MyFridgePage() {
  // ✅ 상태에는 "전체"를 넣지 않음
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: bookmarkedPosts = [], isLoading } = useBookmarkedPosts(null);

  // ✅ CategoryFilter에서 올라오는 값을 정리
  const handleCategoryChange = (next: string[]) => {
    // "전체"가 선택된 경우 → 실제 상태는 "아무 카테고리도 선택 안 함"으로 저장
    if (next.includes("전체")) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(next);
    }
  };

  // ✅ 카테고리 필터
  const filteredPosts = useMemo(() => {
    // 아무 카테고리도 선택 안 된 상태 = 전체 보기
    if (selectedCategories.length === 0) {
      return bookmarkedPosts;
    }

    const selectedSet = new Set(selectedCategories);
    return bookmarkedPosts.filter((post) => selectedSet.has(post.category));
  }, [bookmarkedPosts, selectedCategories]);

  // ✅ 카테고리 변경 시 페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories]);

  // ✅ 페이지네이션
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPageItems = filteredPosts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* 로딩 스피너 자리 */}
      </div>
    );
  }

  return (
    <div className="pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="px-[10%] sm:px-[17%] py-8">
        <h1 className="text-lg sm:text-2xl font-bold mb-4">MY 냉장고</h1>

        {/* 카테고리 필터 */}
        <CategoryFilter
          categories={categories}
          selectedCategories={
            // 상태엔 "전체"를 안 들고 있으니까, UI에서만 표시용으로 가공
            selectedCategories.length === 0
              ? ["전체"]
              : selectedCategories
          }
          onChange={handleCategoryChange}
        />

        {/* 콘텐츠 카드 영역 */}
        {filteredPosts.length === 0 ? (
          <div className="mt-10 text-center text-sm text-gray-500">
            아직 담아둔 콘텐츠가 없습니다.
          </div>
        ) : (
          <>
            <CardGrid
              items={currentPageItems.map((post) => ({
                id: post.id,
                title: post.title,
                imageUrl: post.images?.[0],
                liked: true,
              }))}
              columns={4}
            />

            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}

        <ScrollToTopButton />
      </div>

      <Footer />
    </div>
  );
}
