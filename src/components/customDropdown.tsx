"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import clsx from "clsx";

interface CustomDropdownProps {
  options: string[];
  label: string;
  onSelect?: (value: string) => void;
  className?: string;
  buttonClassName?: string;
}

export default function CustomDropdown({
  options,
  label,
  onSelect,
  className = "",
  buttonClassName = "",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(label);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // ESC 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSelect = useCallback(
    (option: string) => {
      setSelected(option);
      setIsOpen(false);
      onSelect?.(option);
    },
    [onSelect]
  );

  return (
    <div
      ref={dropdownRef}
      className={clsx("relative w-full text-xs md:text-sm font-medium", className)}
    >
      {/* 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={clsx(
          "flex items-center justify-between w-full gap-2 px-3 py-2 md:px-4 md:py-2 border border-gray-300 bg-white cursor-pointer rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300",
          buttonClassName
        )}
      >
        <span>{selected}</span>
        <Image
          src="/icons/down.png"
          alt="드롭다운 열기"
          width={20}
          height={20}
          className={clsx(
            "w-3.5 h-3.5 md:w-5 md:h-5 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )}
          unoptimized
        />
      </button>

      {/* 리스트 */}
      {isOpen && (
        <ul
          role="listbox"
          className={clsx(
            "absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto animate-fade-slide"
          )}
        >
          {/* 현재 선택 표시 + 닫기 */}
          <li
            role="option"
            aria-selected
            className="flex justify-between items-center px-3 py-2 md:px-4 md:py-2 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <span>{selected}</span>
            <Image
              alt="close"
              src="/icons/down.png"
              width={20}
              height={20}
              className="w-3.5 h-3.5 md:w-5 md:h-5 rotate-180"
              unoptimized
            />
          </li>

          <hr className="border-t border-gray-200 my-1 mx-2" />

          {options
            .filter((opt) => opt !== selected)
            .map((opt) => (
              <li
                key={opt}
                role="option"
                aria-selected={false}
                onClick={() => handleSelect(opt)}
                className="cursor-pointer px-2"
              >
                <div className="px-2 py-1.5 mb-2 rounded-md hover:bg-[#FF4545] hover:text-white transition-colors">
                  {opt}
                </div>
              </li>
            ))}
        </ul>
      )}

      {/* 애니메이션 키프레임 */}
      <style jsx>{`
        @keyframes fade-slide {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-slide {
          animation: fade-slide 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}
