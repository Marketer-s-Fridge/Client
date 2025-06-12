"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import clsx from "clsx"; // 선택사항: tailwind에서 조건부 class 결합에 유용

interface CustomDropdownProps {
  options: string[];
  label: string;
  onSelect?: (value: string) => void;
  className?: string; // ✅ 외부에서 스타일 조정할 수 있게
  buttonClassName?: string; // ✅ 버튼 div에 줄 클래스
}

export default function CustomDropdown({
  options,
  label,
  onSelect,
  className = "",
  buttonClassName = "", // ✅ 버튼 div에 줄 클래스
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(label);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    onSelect?.(option);
  };

  return (
    <div className={clsx("relative w-full text-sm font-medium", className)}>
      {/* 드롭다운 버튼 */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          "flex items-center justify-between w-full px-4 py-2 border border-gray-300 focus:outline-none cursor-pointer z-20 relative bg-white",
          buttonClassName // ✅ 외부에서 전달받은 rounded 등 적용됨
        )}
      >
        <span>{selected}</span>
        <ChevronDown className="w-4 h-4" />
      </div>

      {/* 드롭다운 리스트 */}
      {isOpen && (
        <div
          className={clsx(
            "absolute top-0 left-0 w-full rounded-lg shadow-md bg-white border border-gray-100 z-50 pt-2 pb-2",
            buttonClassName
          )}
        >
          {/* 현재 선택된 항목 */}
          <div
            className="flex flex-1 flex-row justify-between cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <div className="px-2 my-1 mx-2 text-black rounded-md">
              {selected}
            </div>
            <Image
              alt="down"
              src="/icons/down.png"
              width={20}
              height={20}
              className="w-5 h-5 place-self-center mr-3"
            />
          </div>

          <hr className="border-t border-gray-200 my-2 mx-2" />

          {/* 나머지 옵션 */}
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
