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
  // ✅ 초기에는 "전체" 선택 상태
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "전체",
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: bookmarkedPosts = [], isLoading } = useBookmarkedPosts(null);

  // ✅ CategoryFilter에서 올라오는 값 처리
  const handleCategoryChange = (next: string[]) => {
    // 아무 것도 안 고르면 => "전체"로 되돌림
    if (next.length === 0) {
      setSelectedCategories(["전체"]);
      return;
    }

    // "전체" + 다른 카테고리 같이 선택되면 "전체"만 제거
    if (next.includes("전체") && next.length > 1) {
      setSelectedCategories(next.filter((c) => c !== "전체"));
      return;
    }

    setSelectedCategories(next);
  };

  // ✅ 카테고리 필터
  const filteredPosts = useMemo(() => {
    // "전체"만 선택된 상태거나, 방어적으로 selectedCategories 비었을 때 => 전체 보기
    if (
      selectedCategories.length === 0 ||
      (selectedCategories.length === 1 && selectedCategories[0] === "전체")
    ) {
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
        {/* 로딩 스피너 있으면 여기 */}
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
          selectedCategories={selectedCategories}
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
