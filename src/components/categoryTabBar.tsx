'use client';

import React from 'react';

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
  sortOptions = ['최신순', '오래된순'],
  selectedSort = '최신순',
  onSortChange = () => {},
}: CategoryTabBarProps) {
  return (
    <>
      <div className="flex justify-between items-center max-w-screen-lg mx-auto px-4 sm:px-6 md:px-10 py-3 border-gray-200">
        {/* 카테고리 필터 버튼 */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`cursor-pointer px-4 py-1 text-sm rounded-full border ${
                selected === category
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onSelect(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 정렬 드롭다운 */}
        <div className="relative text-sm text-gray-700">
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-transparent pr-6 cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <img
            src="/icons/down.png"
            alt="드롭다운 아이콘"
            className="w-3 h-3 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>
      </div>

      {/* 💡 탭바 아래 구분선 */}
      <div className="w-full border-t border-gray-200" />
    </>
  );
}
