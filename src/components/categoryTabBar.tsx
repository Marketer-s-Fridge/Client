"use client";

import React from "react";
import CustomDropdown from "./customDropdown";

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
      <div className="flex flex-row justify-between items-center max-w-screen-lg mx-auto px-3 md:px-27 py-3 border-gray-200">
        {/* 카테고리 필터 버튼 */}
        <div className="flex-1 overflow-x-auto scrollbar-hide whitespace-nowrap pr-3">
          <div className="inline-flex gap-1 sm:gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`cursor-pointer px-2.5 sm:px-4 py-2 text-xs sm:text-sm rounded-full border transition-colors ${
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
        </div>

        {/* 정렬 드롭다운 */}
        <div className="shrink-0 ml-3 sm:ml-6">
          <CustomDropdown
            options={sortOptions}
            label={selectedSort}
            onSelect={onSortChange}
            buttonClassName="rounded-lg"
          />
        </div>
      </div>

      {/* 탭바 아래 구분선 */}
      <div className="w-full border-t border-gray-200" />
    </>
  );
}
