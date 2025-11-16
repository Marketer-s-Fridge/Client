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
// import { useBookmarkedPosts } from "@/features/bookmarks/hooks/useBookmarkedPost";
import { useBookmarkedPosts } from "@/features/bookmarks/hooks/useBookmarkedPost";

const categories = ["전체", "Beauty", "Fashion", "Food", "Lifestyle", "Tech"];
const ITEMS_PER_PAGE = 12; // 한 페이지에 보여줄 카드 수 (원하면 조절)

export default function MyFridgePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

  const selectedCategory = selectedCategories[0] || "전체";

  // ✅ 전체 북마크 가져오기
  const { data: bookmarkedPosts = [], isLoading } = useBookmarkedPosts(null);

  // ✅ 카테고리 필터
  const filteredPosts = useMemo(() => {
    if (selectedCategory === "전체") return bookmarkedPosts;
    return bookmarkedPosts.filter(
      (post) => post.category === selectedCategory
    );
  }, [bookmarkedPosts, selectedCategory]);

  // ✅ 카테고리 바뀔 때마다 1페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // ✅ 페이지네이션 계산
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
        {/* <p className="text-gray-500">불러오는 중...</p> */}
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
          onChange={setSelectedCategories}
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
