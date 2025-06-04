"use client";

import React from "react";
import Image from "next/image";

type CategoryTabBarProps = {
  categories: string[];
  selected: string;
  onSelect: (value: string) => void;
  sortOptions?: string[];
  selectedSort?: string;
  onSortChange?: (value: string) => void;
};

export default function CategoryTabBar({
  categories,
  selected,
  onSelect,
  sortOptions = ["최신순", "오래된순"],
  selectedSort = "최신순",
  onSortChange = () => {},
}: CategoryTabBarProps) {
  return (
    <>
      <div className="flex sm:flex-row justify-between sm:items-center gap-3 sm:gap-0 max-w-screen-lg mx-auto px-4 sm:px-6 md:px-27 py-3 border-gray-200">
        {/* 카테고리 필터 버튼 */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`cursor-pointer px-2.5 py-0.5 sm:px-4 sm:py-1 text-xs sm:text-sm rounded-full border transition-colors ${
                selected === category
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => onSelect(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 정렬 드롭다운 */}
        <div className="relative text-xs sm:text-sm text-gray-700 self-center ">
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-transparent pr-6 pl-1 cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <Image
            src="/icons/down.png"
            alt="드롭다운 아이콘"
            className="w-3 h-3 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none"
            width={20}
            height={20}
          />
        </div>
      </div>

      {/* 탭바 아래 구분선 */}
      <div className="w-full border-t border-gray-200" />
    </>
  );
}
