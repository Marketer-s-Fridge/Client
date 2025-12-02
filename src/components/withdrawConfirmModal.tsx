import React from "react";
import BaseModal from "./baseModal";

interface WithdrawConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
const WithdrawConfirmModalProps: React.FC<WithdrawConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="text-lg font-semibold mb-2 mt-3 text-center">
        정말 탈퇴하시겠어요?
      </div>
      <div className="text-sm text-gray-600 mb-5 text-center">
        탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
      </div>

      {/* 🔽 모바일: 두 버튼이 가로로 꽉 차게 */}
      <div className="flex w-full gap-3 mt-1">
        <button
          onClick={onClose}
          className="
            cursor-pointer
            flex-1
            py-3
            rounded-2xl
            bg-gray-200 text-gray-800
            text-sm font-medium
            hover:bg-gray-300
            transition
          "
        >
          취소
        </button>
        <button
          onClick={onConfirm}
          className="
            cursor-pointer
            flex-1
            py-3
            rounded-2xl
            bg-red-500 text-white
            text-sm font-medium
            hover:bg-red-600
            transition
          "
        >
          탈퇴하기
        </button>
      </div>
    </BaseModal>
  );
};
