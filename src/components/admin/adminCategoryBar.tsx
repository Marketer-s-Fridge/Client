"use client";

import React, { useState } from "react";
import Image from "next/image";

interface AdminCategoryBarProps {
  items: string[];
  onSelect?: (value: string) => void;
}

const AdminCategoryBar: React.FC<AdminCategoryBarProps> = ({
  items,
  onSelect,
}) => {
  const [selected, setSelected] = useState(items[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item: string) => {
    setSelected(item);
    setIsOpen(false);
    onSelect?.(item);
  };

  return (
    <div className="relative pl-[10%] sm:pl-[15%] w-full border-b-2 border-gray-300 text-sm font-semibold select-none">
      {/* Selected Button */}
      <div className="relative w-[160px]">
        <div
          className=" flex flex-row justify-between items-center text-start px-5 py-3 bg-white cursor-pointer"
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

        {/* Dropdown List */}
        {isOpen && (
          <div className=" text-start w-full absolute top-0 left-0 bg-white border border-gray-200 rounded-xl shadow z-50 py-1">
            {items.map((item) => {
              const isSelected = item === selected;
              return (
                <div
                  key={item}
                  onClick={() => handleSelect(item)}
                  className="text-start px-2 py-1 flex justify-center cursor-pointer"
                >
                  <span
                    className={`text-start  w-full px-2 py-2 rounded-lg transition-colors duration-150
                      ${
                        isSelected
                          ? "bg-[#FF4545] text-white w-full text-start"
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
    </div>
  );
};

export default AdminCategoryBar;
