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
          취소
        </button>
        <button
          onClick={onConfirm}
          className="
              cursor-pointer
              w-full              /* 모바일: 가득 */
              py-3
              bg-red-500 text-white
              text-sm font-semibold
              rounded-2xl
              hover:bg-red-600
              transition

              sm:w-[120px]        /* ≥640px: 짧은 버튼 */
              sm:py-2             /* 데스크탑에서는 살짝 얇게 */
            "
        >
          탈퇴하기
        </button>
      </div>
    </BaseModal>
  );
};
