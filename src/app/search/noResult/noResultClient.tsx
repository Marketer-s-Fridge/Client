"use client";

import Header from "@/components/header";
import SearchInput from "@/components/searchInput";
import React, { useState, useMemo } from "react";
import CategoryTabBar from "@/components/categoryTabBar";
import Image from "next/image";
import Footer from "@/components/footer";
import MobileMenu from "@/components/mobileMenu";
import { useSearchParams } from "next/navigation";
import CardGrid from "@/components/cardGrid";
import { usePosts } from "@/features/posts/hooks/usePosts";

export default function NoResultClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedSort, setSelectedSort] = useState("최신순");
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // ✅ 전체 게시글 가져오기 (PUBLISHED)
  const { data: posts, isLoading, error } = usePosts();

  // ✅ 추천용 콘텐츠 3개 (걍 순서대로 앞에서 3개)
  const recommendedContents = useMemo(() => {
    if (!posts || posts.length === 0) return [];
    return posts.slice(0, 3);
  }, [posts]);

  return (
    <div className="min-h-screen bg-white mt-16 md:mt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section className="hidden md:flex flex-col items-center main-red pb-10">
        <SearchInput showInstagramButton={false} />
      </section>

      <CategoryTabBar
        categories={["All", "food", "lifestyle", "beauty", "tech", "fashion"]}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        sortOptions={["최신순", "오래된순", "인기순", "조회순"]}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
      />

      <section className="px-[7%] lg:px-[17%] py-18 text-center">
        <h1
          className="
            text-xl md:text-2xl font-bold mb-10
            text-center
          "
        >
          <span className="md:hidden">
            ‘{query || " "}’에 대한 콘텐츠가
            <br />
            아직 준비되지 않았습니다.
          </span>

          <span className="hidden md:inline">
            ‘{query || " "}’에 대한 콘텐츠가 아직 준비되지 않았습니다.
          </span>
        </h1>

        <div className="flex justify-center mb-8">
          <Image
            src="/icons/noContents.png"
            alt="no contents"
            className="w-[80%] md:w-[50%] h-auto object-contain"
            width={500}
            height={250}
          />
        </div>

        <section className="w-9/10 md:w-5/7 mx-auto flex flex-col items-center text-center py-12">
          <h3 className="text-lg justify-self-center md:text-2xl text-center font-bold mb-10">
            이런 콘텐츠는 어떠세요?
          </h3>

          {/* 로딩/에러 간단 처리 */}
          {isLoading && (
            <p className="text-center text-gray-500 py-8">
              추천 콘텐츠를 불러오는 중입니다...
            </p>
          )}

          {error && (
            <p className="text-center text-red-500 py-8">
              추천 콘텐츠를 불러오는 중 오류가 발생했습니다.
            </p>
          )}

          {/* ✅ 모바일: 카드 2개(2열), 데스크톱: 카드 3개(3열) */}
          {!isLoading && !error && recommendedContents.length > 0 && (
            <>
              {/* 모바일 (md 미만) → 2열 */}
              <div className="md:hidden w-full">
                <CardGrid
                  items={recommendedContents.map((post) => ({
                    id: post.id,
                    title: post.title,
                    imageUrl: post.images?.[0],
                  }))}
                  columns={2}
                />
              </div>

              {/* 데스크톱 (md 이상) → 3열 */}
              <div className="hidden md:block w-full">
                <CardGrid
                  items={recommendedContents.map((post) => ({
                    id: post.id,
                    title: post.title,
                    imageUrl: post.images?.[0],
                  }))}
                  columns={3}
                />
              </div>
            </>
          )}

          {!isLoading && !error && recommendedContents.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              아직 추천할 수 있는 콘텐츠가 없습니다.
            </p>
          )}
        </section>
      </section>

      <Footer />
    </div>
  );
}
