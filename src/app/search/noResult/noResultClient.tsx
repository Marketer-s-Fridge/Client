"use client";

import Header from "@/components/header";
import SearchInput from "@/components/searchInput";
import React, { useState } from "react";
import CategoryTabBar from "@/components/categoryTabBar";
import Image from "next/image";
import Footer from "@/components/footer";
import MobileMenu from "@/components/mobileMenu";
import { useSearchParams } from "next/navigation";
import CardGrid from "@/components/cardGrid";

const mockContents = [
  { id: 1, title: "신규 브랜드 탐방: 떠오르는 핫 브랜드" },
  { id: 2, title: "패션 아이콘들이 선택한 신상템" },
  { id: 3, title: "셀럽들의 공항 패션 스타일" },
];

export default function NoResultClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedSort, setSelectedSort] = useState("최신순");
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const toggleLike = (id: number) => {
    setLikedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
        <h1 className="text-xl md:text-2xl font-bold mb-10">
          ‘{query || " "}’에 대한 콘텐츠가 아직 준비되지 않았습니다.
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

        <section className="w-9/10 md:w-5/7 justify-self-center text-left py-12">
          <h3 className="text-lg md:text-2xl text-center font-bold mb-10">
            이런 콘텐츠는 어떠세요?
          </h3>

          <CardGrid items={mockContents} columns={3} />
        </section>
      </section>

      <Footer />
    </div>
  );
}
