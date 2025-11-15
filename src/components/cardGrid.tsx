"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBookmarks } from "@/features/bookmarks/hooks/useBookmarks";
import BaseModal from "@/components/baseModal";
import LoginRequiredModal from "@/components/loginRequiredModal";

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
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { bookmarkIds, toggleBookmarkMutate, isLoading } = useBookmarks();

  // ✅ 로그인 여부 확인
  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

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

  // ✅ 하트 클릭 핸들러
  const handleToggleBookmark = (postId: number, isSaved: boolean) => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    toggleBookmarkMutate(postId, {
      onSuccess: () => {
        // 새로 추가된 경우에만 성공 모달 띄우기
        if (!isSaved) {
          setIsSuccessModalOpen(true);
          setTimeout(() => setIsSuccessModalOpen(false), 1000);
        }
      },
    });
  };

  return (
    <>
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 ${getLgGridColsClass()} gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10`}
      >
        {displayedItems.map((item) => {
          const isSaved = bookmarkIds.includes(item.id);
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
                <button
                  onClick={() => handleToggleBookmark(item.id, isSaved)}
                  className="flex-shrink-0 cursor-pointer"
                  disabled={isLoading}
                >
                  <Image
                    src={
                      isSaved
                        ? "/icons/redheart.png"
                        : "/icons/grayheart.png"
                    }
                    alt="MY 냉장고 저장"
                    width={20}
                    height={20}
                    className={`w-4.5 h-5 cursor-pointer transition-transform ${
                      isSaved ? "scale-105" : "opacity-30 grayscale scale-100"
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔒 로그인 안내 모달 */}
      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        message="로그인 후 MY 냉장고에 콘텐츠를 담을 수 있어요"
        redirectPath="/login"
      />

      {/* ✅ 저장 성공 모달 */}
      <BaseModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      >
        <div className="flex flex-col items-center justify-center py-1.5 px-3">
          <p className="text-medium font-medium text-gray-700 text-center">
            <strong className="text-lg font-semibold">저장 완료!</strong>
            <br />
            MY 냉장고에서 확인해보세요 🧊
          </p>
        </div>
      </BaseModal>
    </>
  );
}
