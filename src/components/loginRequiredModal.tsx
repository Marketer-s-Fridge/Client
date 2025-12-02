"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BaseModal from "@/components/baseModal";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // ✅ 제목 문구 변경 가능
  message?: string; // ✅ 내용 문구 변경 가능
  buttonText?: string; // ✅ 버튼 문구 변경 가능
  redirectPath?: string; // ✅ 이동할 경로 변경 가능
}
export default function LoginRequiredModal({
  isOpen,
  onClose,
  title = "아직 로그인하지 않으셨네요!",
  message = "로그인하면 나의 페이지를 자유롭게 이용할 수 있어요",
  buttonText = "로그인",
  redirectPath = "/login",
}: LoginRequiredModalProps) {
  const router = useRouter();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      closeOnBackdropClick={false} // ✅ 배경 클릭해도 닫히지 않음
    >
      <h2 className="text-lg font-semibold mt-2 mb-2 text-center">
        {title}
      </h2>
      <p className="text-sm text-gray-600 mb-5 text-center">{message}</p>

      {/* 🔽 모바일: 전체폭 버튼 / 데스크탑: 자연스러운 크기 */}
      <div className="mt-2 flex justify-center w-full">
        <button
          onClick={() => {
            onClose();
            router.push(redirectPath);
          }}
          className="
            cursor-pointer
            w-full max-w-[260px]          /* 모바일 풀, 최대폭 제한 */
            py-3                           /* 터치 영역 넉넉하게 */
            bg-red-500 text-white
            rounded-2xl
            text-sm font-semibold
            hover:bg-red-600
            transition
          "
        >
          {buttonText}
        </button>
      </div>
    </BaseModal>
  );
}
