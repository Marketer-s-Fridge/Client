"use client";
import React, { useState } from "react";
import BaseModal from "@/components/baseModal";
import { TextInput } from "@/components/authFormComponents";
import { useDeleteAccount } from "@/features/auth/hooks/useDeleteAccount";

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
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetAndClose = () => {
    setPassword("");
    setErrorMsg(null);
    setSuccess(false);
    onClose();
  };

  const { deleteAccountAsync, isLoading } = useDeleteAccount({
    onSuccess: () => {
      setSuccess(true);
      setErrorMsg(null);
      onConfirm?.();
      setTimeout(() => resetAndClose(), 700);
    },
    onError: (err) => {
      const msg =
        // @ts-expect-error axios-like
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : "탈퇴에 실패했습니다.");
      setErrorMsg(msg);
    },
    redirectTo: "/auth/signin",
  });

  const handlePasswordChange = (v: any) => {
    if (typeof v === "string") setPassword(v);
    else if (v?.target?.value) setPassword(v.target.value);
  };

  const handleConfirm = async () => {
    setErrorMsg(null);
    if (!password) {
      setErrorMsg("비밀번호를 입력하세요.");
      return;
    }
    try {
      await deleteAccountAsync(password);
    } catch {
      /* onError에서 처리됨 */
    }
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

            <div className="flex flex-col gap-4 mb-2">
              {/* ✅ 계정(이메일) - 비밀번호 TextInput과 동일 스타일, readOnly */}
              <div className="flex flex-1 flex-row">
                <TextInput
                  label="계정"
                  type="email"
                  value={email}
                  onChange={() => {}} // 수정 불가이므로 noop
                  placeholder=""
                  readOnly
                  bgColor="bg-gray-100"
                  textColor="text-gray-500"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-not-allowed"
                />
              </div>

              {/* 비밀번호 입력 */}
              <div className="flex flex-1 flex-row">
                <TextInput
                  label="비밀번호"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="비밀번호 입력"
                  error={errorMsg || undefined}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-center gap-10 mt-6">
              <button
                onClick={resetAndClose}
                disabled={isLoading}
                className="cursor-pointer px-9 py-1 rounded-2xl bg-gray-300 text-white text-xs hover:bg-gray-400 disabled:opacity-60"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading || password.length === 0}
                className="cursor-pointer px-9 py-1 rounded-2xl bg-[#FF4545] text-white text-xs hover:bg-red-600 disabled:opacity-60"
              >
                {isLoading ? "처리 중..." : "확인"}
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
              이용해주셔서 감사합니다.
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
