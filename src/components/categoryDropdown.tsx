"use client";

import React, { useState } from "react";
import Image from "next/image";

interface CategoryDropdownProps {
  items: string[];
  selected?: string;
  onSelect?: (value: string) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  items,
  selected: initialSelected,
  onSelect,
}) => {
  const [selected, setSelected] = useState(initialSelected || items[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item: string) => {
    setSelected(item);
    setIsOpen(false);
    onSelect?.(item);
  };

  return (
    <div className="relative w-[115px] text-sm font-semibold select-none">
      {/* 선택된 버튼 */}
      <div
        className="flex flex-row justify-between items-center px-4 py-3 bg-white cursor-pointer  border-gray-300 rounded-lg"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selected}</span>
        <Image
          src="/icons/down.png"
          alt="dropdown icon"
          width={20}
          height={20}
        />
      </div>

      {/* 드롭다운 리스트 */}
      {isOpen && (
        <div className="absolute w-full bg-white border border-gray-200 rounded-xl shadow z-50 py-1 mt-1">
          {items.map((item) => {
            const isSelected = item === selected;
            return (
              <div
                key={item}
                onClick={() => handleSelect(item)}
                className="px-2 py-1 cursor-pointer"
              >
                <span
                  className={`block w-full px-2 py-2 rounded-lg transition-colors duration-150 ${
                    isSelected
                      ? "bg-[#FF4545] text-white"
                      : "hover:bg-gray-100 text-black"
                  }`}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
