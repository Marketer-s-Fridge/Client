"use client";

import React from "react";
import Image from "next/image";

interface CardItem {
  id: number;
  title: string;
}

interface CardGridProps {
  items: CardItem[];
  columns?: number; // lg 이상에서만 적용
  likedItems: number[];
  onToggleLike: (id: number) => void;
}

export default function CardGrid({
  items,
  columns = 4,
  likedItems,
  onToggleLike,
}: CardGridProps) {
  // ✅ columns 값에 따라 Tailwind 클래스를 수동으로 지정
  const getLgGridColsClass = () => {
    switch (columns) {
      case 1:
        return "lg:grid-cols-1";
      case 2:
        return "lg:grid-cols-2";
      case 3:
        return "lg:grid-cols-3";
      case 4:
        return "lg:grid-cols-4";
      case 5:
        return "lg:grid-cols-5";
      case 6:
        return "lg:grid-cols-6";
      default:
        return "lg:grid-cols-4"; // 기본값
    }
  };

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 ${getLgGridColsClass()} gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10`}
    >
      {items.map((item) => (
        <div key={item.id} className="w-full">
          <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-gray-100">
            <Image
              src="/icons/rectangle-gray.png"
              alt={item.title}
              width={300}
              height={400}
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>
          <div className="pt-2 px-1 text-[10px] sm:text-sm font-semibold flex items-center justify-between">
            <span className="truncate whitespace-nowrap overflow-hidden pr-2 flex-1">
              {item.title}
            </span>
            <button
              onClick={() => onToggleLike(item.id)}
              className="flex-shrink-0"
            >
              <Image
                src={
                  likedItems.includes(item.id)
                    ? "/icons/redheart.png"
                    : "/icons/grayheart.png"
                }
                alt="찜하기"
                width={20}
                height={20}
                className={`w-4.5 h-5 cursor-pointer ${
                  likedItems.includes(item.id) ? "" : "opacity-30 grayscale"
                }`}
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
