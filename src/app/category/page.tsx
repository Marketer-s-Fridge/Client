"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import SearchInput from "@/components/searchInput";
import ScrollToTopButton from "@/components/scrollToTopButton";
import Image from "next/image";
import Footer from "@/components/footer";
import Pagination from "@/components/pagination";
import CardGrid from "@/components/cardGrid";
import MobileMenu from "@/components/mobileMenu";
import { usePosts } from "@/features/posts/hooks/usePosts";
import NoContentView from "@/components/noContentView";
interface Category {
  name: string;
  icon: string;
}

const categories: Category[] = [
  { name: "Food", icon: "/icons/icon-food1.png" },
  { name: "Lifestyle", icon: "/icons/icon-lifestyle1.png" },
  { name: "Beauty", icon: "/icons/icon-beauty1.png" },
  { name: "Tech", icon: "/icons/icon-tech1.png" },
  { name: "Fashion", icon: "/icons/icon-fashion1.png" },
];

export default function Page() {
  const [_, setLikedItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ 훅 사용 (지금은 mock 데이터 반환)
  const { data, isLoading, error } = usePosts(selectedCategory);

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
            const isSelected =
              selectedCategory === null || selectedCategory === cat.name;

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

        {/* ✅ 결과 있음 */}
        {data && data.length > 0 ? (
          <>
            <CardGrid
              items={data.map((post) => ({
                id: post.id,
                title: post.title,
                image: post.images,
              }))}
              columns={4}
            />

            {/* ✅ 결과가 있을 때만 페이지네이션 표시 */}
            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        ) : (
          // ✅ 결과 없음 뷰
          <NoContentView></NoContentView>
        )}

        <ScrollToTopButton />
      </section>

      <Footer />
    </div>
  );
}
