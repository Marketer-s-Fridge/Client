"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Pagination from "@/components/pagination";
import ScrollToTopButton from "@/components/scrollToTopButton";
import CardGrid from "@/components/cardGrid";

const categories = ["전체", "Beauty", "Fashion", "Food", "Lifestyle", "Tech"];


const contents = [
  {
    id: 1,
    title: "셀럽들의 공항 패션 스타일",
    image: "/images/content1.jpg",
  },
  {
    id: 2,
    title: "재테크를 위한 중요한 원칙과 전략",
    image: "/images/content2.jpg",
    liked: true,
  },
  {
    id: 3,
    title: "고효율 작업을 위한 생산성 도구 추천",
    image: "/images/content3.jpg",
  },
  {
    id: 4,
    title: "건강한 라이프스타일을 위한 스트레스 관리 방법",
    image: "/images/content4.jpg",
    liked: true,
  },
  {
    id: 5,
    title: "자연 친화적인 라이프스타일을 위한 환경 보호 방법",
    image: "/images/content5.jpg",
  },
  {
    id: 6,
    title: "신규 브랜드 탐방: 떠오르는 디자이너들",
    image: "/images/content6.jpg",
  },
  {
    id: 7,
    title: "포인트 컬러로 완성하는 겨울 룩",
    image: "/images/content7.jpg",
  },
  {
    id: 8,
    title: "여름을 위한 에센셜 드레스 스타일링",
    image: "/images/content8.jpg",
    liked: true,
  },
  {
    id: 9,
    title: "지금 사야 할 하이엔드 트렌드 아이템",
    image: "/images/content9.jpg",
  },
  {
    id: 10,
    title: "세계 최초의 우주 관광선 예약 오픈, 대기 리스트 급증",
    image: "/images/content10.jpg",
    liked: true,
  },
  {
    id: 11,
    title: "지구 온난화 심각성 경보, 글로벌 대응 촉구 포럼 개최의 개최",
    image: "/images/content11.jpg",
  },
  {
    id: 12,
    title: "자유주행 트럭 시범 운영, 운송 업계의 변화 시작",
    image: "/images/content12.jpg",
  },
];

export default function MyFridgePage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const toggleLike = (id: number) => {
    setLikedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <Header />
      <div className=" px-[10%] sm:px-[17%] py-8">
        <h1 className="text-lg sm:text-2xl font-bold mb-4">MY 냉장고</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cursor-pointer px-2 py-1 sm:px-4 sm:py-1.5 rounded-full border text-[10px] sm:text-xs ${
                selectedCategory === cat
                  ? "bg-red-500 text-white"
                  : "bg-white text-black border-gray-300"
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <CardGrid
          items={contents}
          columns={4}
          likedItems={likedItems}
          onToggleLike={toggleLike}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={(page) => setCurrentPage(page)}
        />
        <ScrollToTopButton />
      </div>
      <Footer />
    </div>
  );
}
