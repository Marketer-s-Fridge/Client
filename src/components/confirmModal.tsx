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
              w-full max-w-[260px]
              py-3
              bg-red-500 text-white
              text-sm font-semibold
              rounded-2xl
              hover:bg-red-600
              transition
            "
          >
            확인
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
