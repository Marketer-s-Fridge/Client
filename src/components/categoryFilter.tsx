"use client";

import React from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onChange: (updated: string[]) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  onChange,
}: CategoryFilterProps) {
  const toggleCategory = (cat: string) => {
    if (cat === "전체") {
      onChange([]);
    } else {
      const isSelected = selectedCategories.includes(cat);
      const updated = isSelected
        ? selectedCategories.filter((c) => c !== cat)
        : [...selectedCategories, cat];
      onChange(updated);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((cat) => {
        const isSelected =
          cat === "전체"
            ? selectedCategories.length === 0
            : selectedCategories.includes(cat);
        return (
          <button
            key={cat}
            className={`cursor-pointer px-2 py-1 sm:px-4 sm:py-1.5 rounded-full border text-[10px] sm:text-xs ${
              isSelected
                ? "bg-red-500 text-white"
                : "bg-white text-black border-gray-300"
            }`}
            onClick={() => toggleCategory(cat)}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
