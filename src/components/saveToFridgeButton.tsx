"use client";

import { useState } from "react";
import Image from "next/image";
import BaseModal from "@/components/baseModal";
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
    if (isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    const newState = !saved;
    setSaved(newState);
    if (onToggle) onToggle(newState);

    // ✅ 저장 성공 모달 (저장할 때만 표시)
    if (newState) {
      setIsSuccessModalOpen(true);
      setTimeout(() => setIsSuccessModalOpen(false), 1000); // 1.5초 후 자동 닫힘
    }
  };

  return (
    <>
      {/* ❤️ 버튼 */}
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
      <BaseModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      >
        <h2 className="text-lg font-semibold mt-2 mb-2">
          아직 로그인 안 하셨네요!
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          로그인하면 나만의 냉장고에 콘텐츠를 담을 수 있어요 🧊
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="cursor-pointer px-5 py-2 border border-gray-300 rounded-2xl text-xs hover:bg-gray-100"
          >
            닫기
          </button>
          <button
            onClick={() => {
              setIsLoginModalOpen(false);
              router.push("/login");
            }}
            className="cursor-pointer px-5 py-2 bg-red-500 text-white rounded-2xl text-xs hover:bg-red-600"
          >
            로그인
          </button>
        </div>
      </BaseModal>

      {/* ✅ 저장 성공 모달 */}
      <BaseModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      >
        <div className="flex flex-col items-center justify-center py-1.5 px-3">
          <p className="text-medium font-medium text-gray-700">
            <strong className="text-lg font-medium">저장 완료!</strong>
            <br />
            MY 냉장고에서 확인해보세요 🧊
          </p>
        </div>
      </BaseModal>
    </>
  );
}
