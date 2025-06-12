"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import SearchInput from "@/components/searchInput";
import ScrollToTopButton from "@/components/scrollToTopButton";
import Image from "next/image";
import Footer from "@/components/footer";
import Pagination from "@/components/pagination";
import CardGrid from "@/components/cardGrid"; // ✅ 새 컴포넌트 import

interface Category {
  name: string;
  icon: string;
}

interface Content {
  id: number;
  title: string;
  image: string;
}

const categories: Category[] = [
  { name: "Food", icon: "/icons/icon-food1.png" },
  { name: "Lifestyle", icon: "/icons/icon-lifestyle1.png" },
  { name: "Beauty", icon: "/icons/icon-beauty1.png" },
  { name: "Tech", icon: "/icons/icon-tech1.png" },
  { name: "Fashion", icon: "/icons/icon-fashion1.png" },
];

const mockContents: Content[] = [
  { id: 1, title: "셀럽들의 공항 패션 스타일", image: "/images/content1.png" },
  {
    id: 2,
    title: "재테크를 위한 중요한 원칙과 전략",
    image: "/images/content2.png",
  },
  {
    id: 3,
    title: "고효율 작업을 위한 생산성 도구 추천",
    image: "/images/content3.png",
  },
  {
    id: 4,
    title: "건강한 라이프스타일을 위한 스트레스 관리 방법",
    image: "/images/content4.png",
  },
  {
    id: 5,
    title: "자연 친화적인 라이프스타일을 위한 환경 보호 방법",
    image: "/images/content5.png",
  },
  {
    id: 6,
    title: "신규 브랜드 탐방: 떠오르는 디자이너들",
    image: "/images/content6.png",
  },
  {
    id: 7,
    title: "포인트 컬러로 완성하는 겨울 룩",
    image: "/images/content7.png",
  },
  {
    id: 8,
    title: "여름을 위한 에센셜 드레스 스타일링",
    image: "/images/content8.png",
  },
  {
    id: 9,
    title: "지금 사야 할 하이엔드 브랜드 아이템",
    image: "/images/content9.png",
  },
  {
    id: 10,
    title: "세계 최초의 우주 관광선 예약 오픈, 대기 리스트 급증",
    image: "/images/content10.png",
  },
  {
    id: 11,
    title: "지구 온난화 심각성 경보, 글로벌 대응책 모색에 국제회의 개최",
    image: "/images/content11.png",
  },
  {
    id: 12,
    title: "자율주행 트럭 시범 운영, 운송 업계의 변화 시작",
    image: "/images/content12.png",
  },
  {
    id: 13,
    title: "시간을 초월한 클래식 아이템",
    image: "/images/content13.png",
  },
  {
    id: 14,
    title: "미니멀한 공간을 위한 인테리어 팁",
    image: "/images/content14.png",
  },
  {
    id: 15,
    title: "AI 시대, 마케터가 가져야 할 핵심 역량",
    image: "/images/content15.png",
  },
  {
    id: 16,
    title: "2025 패션 트렌드: 소재와 지속가능성",
    image: "/images/content16.png",
  },
];

export default function Page() {
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleLike = (id: number) => {
    setLikedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full bg-white">
      <Header />

      {/* 검색 영역 */}
      <section className="flex flex-col items-center main-red pt-10 pb-6 px-4 sm:px-6 sm:pt-20 sm:pb-6 md:px-10 lg:px-16">
        <SearchInput showInstagramButton={false} />

        {/* 카테고리 아이콘들 */}
        <div className="flex justify-center mt-7 mb-3 sm:mt-14 sm:mb-6 gap-1 sm:gap-4 md:gap-6">
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
                <div
                  className={`flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? "w-20 h-20 sm:w-26 sm:h-26 md:w-30 md:h-30 lg:w-40 lg:h-40 "
                      : "w-17.5 h-17.5 sm:w-22 sm:h-22 md:w-27.5 md:h-27.5 lg:w-35 lg:h-35 opacity-80"
                  }`}
                >
                  <Image
                    src={cat.icon}
                    alt={cat.name}
                    className="object-contain w-full h-full"
                    width={200}
                    height={200}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 카드 리스트 */}
      <section className="bg-white w-full max-w-screen-xl mx-auto px-10 lg:px-17 py-10 sm:py-16">
        <CardGrid
          items={mockContents}
          columns={4}
          likedItems={likedItems}
          onToggleLike={toggleLike}
        />
        {/* 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={(page) => setCurrentPage(page)}
        />
        <ScrollToTopButton />
      </section>
      <Footer />
    </div>
  );
}
