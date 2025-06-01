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
        <p className="text-lg font-normal my-5">{children}</p>
        <button
          onClick={onClose}
          className="bg-red-500 text-white text-xs font-semibold px-8 py-0.5 rounded-2xl hover:bg-red-600"
        >
          확인
        </button>
      </div>
    </BaseModal>
  );
}
