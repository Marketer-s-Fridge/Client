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
    <BaseModal isOpen={isOpen} onClose={onClose}   closeOnBackdropClick={false} // ✅ 배경 클릭해도 닫히지 않음
    >
      <h2 className="text-lg font-semibold mt-2 mb-2">{title}</h2>
      <p className="text-base text-gray-600 mb-4">{message}</p>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            onClose();
            router.push(redirectPath);
          }}
          className="cursor-pointer px-4 py-1 bg-red-500 text-white rounded-2xl text-sm hover:bg-red-600"
        >
          {buttonText}
        </button>
      </div>
    </BaseModal>
  );
}
