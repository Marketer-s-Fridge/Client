"use client";

import { useState } from "react";
import Image from "next/image";
import BaseModal from "@/components/baseModal";
import LoginRequiredModal from "@/components/loginRequiredModal";
import { useRouter } from "next/navigation";

interface SaveToFridgeButtonProps {
  initialSaved?: boolean;
  onToggle?: (saved: boolean) => void;
}

export default function SaveToFridgeButton({
  initialSaved = false,
  onToggle,
}: SaveToFridgeButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const router = useRouter();

  // ✅ 로그인 여부 체크 (토큰 여부 기준)
  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  const handleClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    const newState = !saved;
    setSaved(newState);
    if (onToggle) onToggle(newState);

    // ✅ 저장 성공 모달 (저장할 때만 표시)
    if (newState) {
      setIsSuccessModalOpen(true);
      setTimeout(() => setIsSuccessModalOpen(false), 1000); // 1초 후 자동 닫힘
    }
  };

  return (
    <>
      {/* ❤️ 저장 버튼 */}
      <button
        type="button"
        onClick={handleClick}
        className="flex self-start text-gray-500 border border-gray-300 rounded-full px-4 py-1 text-sm items-center gap-2 cursor-pointer hover:bg-gray-100 transition"
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
        {saved ? "MY냉장고에 저장됨" : "MY냉장고에 저장"}
      </button>

      {/* 🔒 로그인 안내 모달 */}
      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        // title="로그인이 필요해요!"
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
