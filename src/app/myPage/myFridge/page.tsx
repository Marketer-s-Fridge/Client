"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Pagination from "@/components/pagination";
import ScrollToTopButton from "@/components/scrollToTopButton";
import CardGrid from "@/components/cardGrid";
import CategoryFilter from "@/components/categoryFilter";
import MobileMenu from "@/components/mobileMenu";

const categories = ["전체", "Beauty", "Fashion", "Food", "Lifestyle", "Tech"];

const contents = [
  {
    title: "셀럽들의 공항 패션 스타일",
    image: "/images/content1.jpg",
  },
  {
    title: "재테크를 위한 중요한 원칙과 전략",
    image: "/images/content2.jpg",
    liked: true,
  },
  {
    title: "고효율 작업을 위한 생산성 도구 추천",
    image: "/images/content3.jpg",
  },
  {
    title: "건강한 라이프스타일을 위한 스트레스 관리 방법",
    image: "/images/content4.jpg",
    liked: true,
  },
  {
    title: "자연 친화적인 라이프스타일을 위한 환경 보호 방법",
    image: "/images/content5.jpg",
  },
  {
    title: "신규 브랜드 탐방: 떠오르는 디자이너들",
    image: "/images/content6.jpg",
  },
  {
    title: "포인트 컬러로 완성하는 겨울 룩",
    image: "/images/content7.jpg",
  },
  {
    title: "여름을 위한 에센셜 드레스 스타일링",
    image: "/images/content8.jpg",
    liked: true,
  },
  {
    title: "지금 사야 할 하이엔드 트렌드 아이템",
    image: "/images/content9.jpg",
  },
  {
    title: "세계 최초의 우주 관광선 예약 오픈, 대기 리스트 급증",
    image: "/images/content10.jpg",
    liked: true,
  },
  {
    title: "지구 온난화 심각성 경보, 글로벌 대응 촉구 포럼 개최의 개최",
    image: "/images/content11.jpg",
  },
  {
    title: "자유주행 트럭 시범 운영, 운송 업계의 변화 시작",
    image: "/images/content12.jpg",
  },
].map((item, i) => ({
  ...item,
  id: i,
}));

export default function MyFridgePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [likedItems, setLikedItems] = useState<number[]>(
    contents.map((item) => item.id) // ✅ 모든 아이템을 liked 상태로 초기화
  );
  const toggleLike = (id: number) => {
    setLikedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredContents =
    selectedCategories.length === 0
      ? contents
      : contents.filter((item) =>
          selectedCategories.some((cat) =>
            item.title.toLowerCase().includes(cat.toLowerCase())
          )
        );

  return (
    <div className="pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className=" px-[10%] sm:px-[17%] py-8">
        <h1 className="text-lg sm:text-2xl font-bold mb-4">MY 냉장고</h1>
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          onChange={setSelectedCategories}
        />
        <CardGrid
          items={filteredContents}
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
