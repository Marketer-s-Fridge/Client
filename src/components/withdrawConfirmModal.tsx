import React from "react";
import BaseModal from "./baseModal";

interface WithdrawConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const WithdrawConfirmModal: React.FC<WithdrawConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="text-xl font-semibold mb-1 mt-3">
        정말 탈퇴하시겠어요?
      </div>
      <div className="text-medium text-gray-600 mb-4">
        탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
      </div>
      <div className="flex justify-center flex-row gap-2">
        <button
          onClick={onClose}
          className="w-[30%] text-xs px-4 py-1.5 rounded-2xl bg-gray-300 text-black hover:bg-gray-400 transition cursor-pointer"
        >
          취소
        </button>
        <button
          onClick={onConfirm}
          className="w-[30%] text-xs px-4 py-1.5 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
        >
          탈퇴하기
        </button>
      </div>
    </BaseModal>
  );
};

export default WithdrawConfirmModal;
