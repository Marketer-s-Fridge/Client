// src/components/cardGrid.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SaveToFridgeButton from "@/components/saveToFridgeButton";

interface CardItem {
  id: number;
  title: string;
  imageUrl?: string;
}

interface CardGridProps {
  items: CardItem[];
  columns?: number; // lg 이상에서만 적용
}

export default function CardGrid({ items, columns = 4 }: CardGridProps) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        return "lg:grid-cols-4";
    }
  };

  const displayedItems = isMobile ? items.slice(0, 6) : items;

  if (displayedItems.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 text-gray-500 text-sm sm:text-base">
        게시물이 없습니다.
      </div>
    );
  }

  // ✅ 상세 페이지 이동
  const goToPost = (id: number) => {
    router.push(`/contents/${id}`);
  };

  return (
    <>
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 ${getLgGridColsClass()} gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10`}
      >
        {displayedItems.map((item) => {
          return (
            <div key={item.id} className="w-full">
              <div
                className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-gray-100"
                onClick={() => goToPost(item.id)}
              >
                <Image
                  src={item.imageUrl || "/icons/rectangle-gray.png"}
                  alt={item.title}
                  width={300}
                  height={400}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
              <div className="pt-2 px-1 text-[15px] text-sm font-semibold flex items-center justify-between">
                <span
                  className="truncate whitespace-nowrap overflow-hidden pr-2 flex-1 cursor-pointer"
                  onClick={() => goToPost(item.id)}
                >
                  {item.title}
                </span>

                {/* ✅ 기존 하트 버튼 → 공통 컴포넌트로 교체 */}
                <div className="flex-shrink-0">
                  <SaveToFridgeButton postId={item.id} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
