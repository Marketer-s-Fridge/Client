"use client";

import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Pagination from "@/components/pagination";
import ScrollToTopButton from "@/components/scrollToTopButton";
import CardGrid from "@/components/cardGrid";
import CategoryFilter from "@/components/categoryFilter";
import MobileMenu from "@/components/mobileMenu";
import { useBookmarkedPosts } from "@/features/bookmarks/hooks/useBookmarkedPost";

const categories = ["전체", "Beauty", "Fashion", "Food", "Lifestyle", "Tech"];

export default function MyFridgePage() {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const selectedCategory = selectedCategories[0] || null;
  const { data: bookmarkedPosts, isLoading } =
    useBookmarkedPosts(selectedCategory);

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
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          onChange={setSelectedCategories}
        />
        <CardGrid
          items={bookmarkedPosts.map((post) => ({
            id: post.id,
            title: post.title,
            imageUrl: post.images?.[0],
            liked: true,
          }))}
          columns={4}
        
        />
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
        <ScrollToTopButton />
      </div>
      <Footer />
    </div>
  );
}
