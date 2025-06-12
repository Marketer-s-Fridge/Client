"use client";

import React, { useState } from "react";
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

export default function CardGrid({ items, columns = 3 }: CardGridProps) {
  const [likedItems, setLikedItems] = useState<boolean[]>(
    new Array(items.length).fill(false)
  );

  const toggleLike = (index: number) => {
    const updatedLikes = [...likedItems];
    updatedLikes[index] = !updatedLikes[index];
    setLikedItems(updatedLikes);
  };

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
          <div className="pt-2 px-1 text-wrap text-[10px] sm:text-sm font-semibold truncate flex items-center justify-between">
            {item.title}
            <button onClick={() => toggleLike(index)}>
              <Image
                src={
                  likedItems[index]
                    ? "/icons/redheart.png"
                    : "/icons/grayheart.png"
                }
                alt="찜하기"
                width={16}
                height={16}
                className="w-4 h-4 cursor-pointer"
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
