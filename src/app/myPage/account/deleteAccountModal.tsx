import React, { useState } from "react";
import BaseModal from "@/components/baseModal";
import {  TextInput } from "@/components/authFormComponents";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onConfirm: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  email,
  onConfirm,
}) => {
  const [password, setPassword] = useState("");
  const [, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConfirm = () => {
    if (password === "1234") {
      // 예시: 실제로는 API로 비밀번호 검증
      setSuccess(true);
      setError(false);
      onConfirm();
    } else {
      setError(true);
      setSuccess(false);
    }
  };

  const resetAndClose = () => {
    setPassword("");
    setError(false);
    setSuccess(false);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={resetAndClose}>
      <div className="w-[420px] sm:w-[500px] text-left py-4">
        {!success ? (
          <>
            <h2 className="text-center text-lg sm:text-xl font-medium mb-1">
              <span className="text-[#FF4545] font-playfair font-semibold">
                Marketer’s Fridge
              </span>{" "}
              계정을 탈퇴하시겠습니까?
            </h2>
            <p className="text-center text-sm text-gray-600 mb-8">
              계속 진행하시려면 비밀번호를 입력해주세요.
            </p>

            <div className="flex flex-col gap-4 mb-8">
              <div className="flex flex-1 flex-row">
                <TextInput
                  type="email"
                  value={email}
                  label="계정"
                  onChange={() => {}}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500"
                />
              </div>

              <div className="flex flex-1 flex-row">
                <TextInput
                  label="비밀번호"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  error="비밀번호를 다시 확인해주세요."
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-1 justify-center gap-10 mt-6">
              <button
                onClick={resetAndClose}
                className="cursor-pointer px-9 py-1 rounded-2xl bg-gray-300 text-white text-xs hover:bg-gray-400"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="cursor-pointer px-9 py-1 rounded-2xl bg-[#FF4545] text-white text-xs  hover:bg-red-600"
              >
                확인
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4 px-4">
            <h2 className="text-lg sm:text-xl font-medium mb-3">
              <span className="text-[#FF4545] font-playfair">
                Marketer’s Fridge
              </span>{" "}
              계정이 탈퇴되었습니다.
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              그동안 이용해주셔서 감사합니다.
            </p>
            <button
              onClick={resetAndClose}
              className="cursor-pointer mb-[-10px] px-8 py-1 rounded-2xl bg-[#FF4545] text-white font-semiBold text-xs hover:bg-red-600"
            >
              확인
            </button>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default DeleteAccountModal;
