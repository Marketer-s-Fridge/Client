// app/(whatever)/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import Header from "@/components/header";
import SearchInput from "@/components/searchInput";
import ScrollToTopButton from "@/components/scrollToTopButton";
import Image from "next/image";
import Footer from "@/components/footer";
import Pagination from "@/components/pagination";
import CardGrid from "@/components/cardGrid";
import MobileMenu from "@/components/mobileMenu";
import NoContentView from "@/components/noContentView";
import { usePosts } from "@/features/posts/hooks/usePosts";
import { usePostsByCategory } from "@/features/posts/hooks/usePostsByCategory";

interface Category {
  name: string;
  icon: string;
}

const categories: Category[] = [
  { name: "Food",      icon: "/icons/icon-food1.png" },
  { name: "Lifestyle", icon: "/icons/icon-lifestyle1.png" },
  { name: "Beauty",    icon: "/icons/icon-beauty1.png" },
  { name: "Tech",      icon: "/icons/icon-tech1.png" },
  { name: "Fashion",   icon: "/icons/icon-fashion1.png" },
];

const PAGE_SIZE = 12; // ✅ 한 페이지에 보여줄 카드 개수

export default function Page() {
  const [_, setLikedItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ 전체 게시물
  const {
    data: allPosts = [],
    isLoading: isAllLoading,
    error: allError,
  } = usePosts();

  // ✅ 카테고리별 게시물
  const {
    data: categoryPosts = [],
    isLoading: isCatLoading,
    error: catError,
  } = usePostsByCategory(selectedCategory);

  // ✅ 현재 선택된 카테고리에 따라 실제 사용할 posts
  const isLoading = isAllLoading || isCatLoading;
  const error = allError || catError || null;
  const posts = selectedCategory ? categoryPosts : allPosts;

  // ✅ 카테고리 바뀔 때마다 페이지를 1페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // ✅ 페이지네이션 계산 (게시글 수에 따라 자동)
  const { pagedPosts, totalPages } = useMemo(() => {
    if (!posts || posts.length === 0) {
      return { pagedPosts: [], totalPages: 1 };
    }

    const totalPagesCalc = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
    const safeCurrentPage = Math.min(currentPage, totalPagesCalc);
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    return {
      pagedPosts: posts.slice(startIndex, endIndex),
      totalPages: totalPagesCalc,
    };
  }, [posts, currentPage]);

  const toggleLike = (id: number) => {
    setLikedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full bg-white pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 검색 영역 */}
      <section className="flex flex-col items-center main-red pt-5 pb-6 gap-3 px-4 sm:px-8 lg:px-20 sm:pt-10 lg:pt-15 sm:pb-10">
        <div className="hidden md:flex w-[100vw]">
          <SearchInput showInstagramButton={false} />
        </div>

        {/* 카테고리 아이콘 */}
        <div className="flex justify-center mt-6 mb-4 sm:mt-10 sm:mb-6 gap-2 sm:gap-6 lg:gap-10">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() =>
                  setSelectedCategory((prev) =>
                    prev === cat.name ? null : cat.name
                  )
                }
                className="flex flex-col items-center text-white cursor-pointer transition-all duration-200"
              >
                <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-34 lg:h-34 flex items-center justify-center transition-all duration-300">
                  <Image
                    src={cat.icon}
                    alt={cat.name}
                    width={200}
                    height={200}
                    className={`object-contain transition-transform duration-300 ${
                      isSelected ? "scale-100" : "scale-90 opacity-80"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 카드 리스트 */}
      <section className="bg-white w-full max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-20 py-10 sm:py-16">
        {isLoading && <p className="text-center">로딩중...</p>}
        {error && <p className="text-center text-red-500">에러 발생!</p>}

        {(!isLoading && !error && pagedPosts.length === 0) ? (
          <NoContentView />
        ) : (
          <>
            <CardGrid
              items={pagedPosts.map((post) => ({
                id: post.id,
                title: post.title,
                imageUrl: post.images?.[0],
              }))}
              columns={4}
            />

            {/* 페이지가 2개 이상일 때만 표시 */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        )}

        <ScrollToTopButton />
      </section>

      <Footer />
    </div>
  );
}
