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

// ✅ 정적 이미지 import (가장 중요한 부분)
import foodIcon from "public/icons/icon-food1.png";
import lifestyleIcon from "public/icons/icon-lifestyle1.png";
import beautyIcon from "public/icons/icon-beauty1.png";
import techIcon from "public/icons/icon-tech1.png";
import fashionIcon from "public/icons/icon-fashion1.png";

interface Category {
  name: string;
  icon: any; // StaticImageData
}

const categories: Category[] = [
  { name: "Food", icon: foodIcon },
  { name: "Lifestyle", icon: lifestyleIcon },
  { name: "Beauty", icon: beautyIcon },
  { name: "Tech", icon: techIcon },
  { name: "Fashion", icon: fashionIcon },
];

const PAGE_SIZE = 12;

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    data: allPosts = [],
    isLoading: isAllLoading,
    error: allError,
  } = usePosts();

  const {
    data: categoryPosts = [],
    isLoading: isCatLoading,
    error: catError,
  } = usePostsByCategory(selectedCategory);

  const isLoading = isAllLoading || isCatLoading;
  const error = allError || catError || null;

  const sortedPosts = useMemo(() => {
    const source = selectedCategory ? categoryPosts : allPosts;
    return [...source].reverse();
  }, [selectedCategory, categoryPosts, allPosts]);

  const posts = sortedPosts;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

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

  return (
    <div className="w-full bg-white pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 검색 영역 */}
      <section className="flex flex-col items-center main-red pt-5 pb-6 gap-3 px-4 sm:px-8 lg:px-20 sm:pt-10 sm:pb-10">
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
                <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center transition-all duration-300">
                  <Image
                    src={cat.icon}
                    alt={cat.name}
                    width={96}
                    height={96}
                    priority
                    loading="eager"
                    sizes="(max-width: 768px) 64px, (max-width: 1024px) 80px, 96px"
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

        {!isLoading && !error && pagedPosts.length === 0 ? (
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
