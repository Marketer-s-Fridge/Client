"use client";

import React from "react";
import Image from "next/image";

interface CardItem {
  id: number;
  title: string;
}

interface CardGridProps {
  items: CardItem[];
  columns?: number; // 기본 3
  likedItems: number[]; // ✅ 여기가 포인트!
  onToggleLike: (id: number) => void;
}

export default function CardGrid({
  items,
  columns = 3,
  likedItems,
  onToggleLike,
}: CardGridProps) {
  return (
    <div
      className={`grid gap-x-6 gap-y-10`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {items.map((item, index) => (
        <div key={item.id} className="w-full">
          <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-gray-100">
            <Image
              src="/icons/rectangle-gray.png"
              alt={item.title}
              width={300}
              height={350}
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
