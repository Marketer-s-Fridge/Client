"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

interface CustomDropdownProps {
  options: string[];
  label: string;
  onSelect?: (value: string) => void;
}

export default function CustomDropdown({
  options,
  label,
  onSelect,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(label);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    onSelect?.(option);
  };

  return (
    <div className="relative w-full max-w-[240px] text-sm font-medium">
      {/* 드롭다운 버튼 */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-4 py-2 border-b border-gray-300 focus:outline-none cursor-pointer z-20 relative bg-white"
      >
        <span>{selected}</span>
        <ChevronDown className="w-4 h-4" />
      </div>

      {/* 드롭다운 리스트 */}
      {isOpen && (
        <div className="absolute top-0 left-0 w-full rounded-lg shadow-md bg-white border border-gray-100 z-50 pt-2 pb-2">
          {/* 선택된 항목 (hover 미적용) */}
          <div
            className="flex flex-1 flex-row justify-between cursor-pointer"
            onClick={() => setIsOpen(false)} // 닫히도록!
          >
            <div className="px-2 my-1 mx-2  text-black rounded-md">
              {selected}
            </div>
            <Image
              alt="down"
              src="/icons/down.png"
              width={20}
              height={20}
              className="relative w-5 h-5 place-self-center mr-3"
            ></Image>
          </div>

          <hr className="border-t border-gray-200 my-2 mx-2" />

          {/* 나머지 항목들만 hover 적용 */}
          {options
            .filter((opt) => opt !== selected)
            .map((opt) => (
              <div
                key={opt}
                onClick={() => handleSelect(opt)}
                className="cursor-pointer px-2 py-2 mx-2 rounded-md text-gray-800 hover:bg-[#FF4545] hover:text-white transition-colors duration-150"
              >
                {opt}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
