import React from "react";
import BaseModal from "@/components/baseModal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
export default function ConfirmModal({
  isOpen,
  onClose,
  children,
}: ConfirmModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <p className="text-base font-normal my-5">{children}</p>

        {/* 🔽 모바일: 전체폭 CTA 버튼 */}
        <div className="mt-2 flex justify-center w-full">
          <button
            onClick={onClose}
            className="
            cursor-pointer
            w-full              /* 모바일: 가득 */
            py-2
            bg-red-500 text-white
            text-[13px] sm:text-[12.5px] font-medium
            rounded-lg
            hover:bg-red-600
            transition
            sm:w-auto
            sm:px-9        /* ≥640px: 짧은 버튼 */
            sm:py-0.5             /* 데스크탑에서는 살짝 얇게 */
          "
          >
            확인
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
