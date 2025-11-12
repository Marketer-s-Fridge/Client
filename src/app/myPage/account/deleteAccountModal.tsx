import React, { useState } from "react";
import BaseModal from "@/components/baseModal";
import { TextInput } from "@/components/authFormComponents";
import { useDeleteAccount } from "@/features/auth/hooks/useDeleteAccount";
// import { useDeleteAccount } from "@/features/user/hooks/useDeleteAccount";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onConfirm: () => void; // 성공 시 추가 처리 필요하면 사용
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
    // 훅 내부에서 토큰 정리 + 캐시 초기화 + redirect 수행
    onSuccess: () => {
      setSuccess(true);
      setErrorMsg(null);
      onConfirm?.();
      // UI 피드백 잠깐 보여주고 닫기. 라우터가 이동하면 자동으로 사라짐.
      setTimeout(() => {
        resetAndClose();
      }, 700);
    },
    onError: (err) => {
      // 서버 메시지 우선 사용
      const msg =
        // @ts-expect-error: axios-like error shape
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : "탈퇴에 실패했습니다.");
      setErrorMsg(msg);
    },
    redirectTo: "/auth/signin",
  });

  const handleConfirm = async () => {
    setErrorMsg(null);
    if (!password) {
      setErrorMsg("비밀번호를 입력하세요.");
      return;
    }
    try {
      await deleteAccountAsync(password);
    } catch {
      // onError에서 처리함
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
                  error={errorMsg || undefined}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-1 justify-center gap-10 mt-6">
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
