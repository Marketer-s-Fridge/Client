"use client";

import { useState } from "react";
import Image from "next/image";
import BaseModal from "@/components/baseModal";
import LoginRequiredModal from "@/components/loginRequiredModal";
import { useRouter } from "next/navigation";
import { useBookmarks } from "@/features/bookmarks/hooks/useBookmarks";

interface SaveToFridgeButtonProps {
  postId?: number; // ✅ 선택적 (필수 아님)
}

export default function SaveToFridgeButton({ postId }: SaveToFridgeButtonProps) {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // ✅ 로그인 여부 체크
  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  // ✅ 북마크 훅
  const { bookmarkIds, toggleBookmarkMutate, isLoading } = useBookmarks();

  // ✅ postId가 있을 때만 북마크 상태 확인
  const saved = postId ? bookmarkIds.includes(postId) : false;

  // ✅ 클릭 핸들러
  const handleClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!postId) return; // postId가 없으면 동작 안 함

    toggleBookmarkMutate(postId, {
      onSuccess: () => {
        // 북마크 추가 시에만 모달 띄움
        if (!saved) {
          setIsSuccessModalOpen(true);
          setTimeout(() => setIsSuccessModalOpen(false), 1000);
        }
      },
    });
  };

  return (
    <>
      {/* ❤️ 저장 버튼 */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading || !postId} // postId 없으면 클릭 불가
        className={`flex self-start items-center gap-2 px-4 py-1 text-sm border rounded-full transition
          ${
            isLoading || !postId
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-500 border-gray-300 hover:bg-gray-100 cursor-pointer"
          }`}
      >
        <Image
          src={saved ? "/icons/redheart.png" : "/icons/pinkheart.png"}
          alt="하트"
          width={16}
          height={16}
          className={`transition-transform duration-200 ${
            saved ? "scale-105" : "scale-100"
          }`}
        />
        {saved
          ? "MY냉장고에 저장됨"
          : postId
          ? "MY냉장고에 저장"
          : "준비중인 기능입니다"}
      </button>

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
            MY 냉장고에서 확인해보세요
          </p>
        </div>
      </BaseModal>
    </>
  );
}
