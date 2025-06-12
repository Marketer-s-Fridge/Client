"use client";

import React from "react";
import Image from "next/image";

interface CardItem {
  id: number;
  title: string;
  image?: string;
}

interface CardGridProps {
  items: CardItem[];
  columns?: number;
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
      className="grid gap-x-6 gap-y-10"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {items.map((item) => (
        <div key={item.id} className="w-full">
          <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={item.image || "/icons/rectangle-gray.png"}
              alt={item.title}
              width={300}
              height={350}
              className="w-full h-full object-cover cursor-pointer"
            />
            <button
              onClick={() => onToggleLike(item.id)}
              className="absolute bottom-2 right-2"
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
                className="w-5 h-5"
              />
            </button>
          </div>
          <div className="pt-2 px-1 text-[10px] sm:text-sm font-semibold truncate flex items-center justify-between">
            {item.title}
          </div>
        </div>
      ))}
    </div>
  );
}
