"use client";
import React, { useState } from "react";
import BigModal from "@/components/bigModal";
import { useDeleteAccount } from "@/features/auth/hooks/useDeleteAccount";
import { useAuthStatus } from "@/features/auth/hooks/useAuthStatus";

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

  const { user } = useAuthStatus();
  const isKakaoUser = user?.id?.startsWith("kakao_") ?? false;

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

    // 일반 회원은 비밀번호 필수
    if (!isKakaoUser && !password) {
      setErrorMsg("비밀번호를 입력하세요.");
      return;
    }

    try {
      // ✅ 카카오 로그인 유저는 "SOCIAL_LOGIN"을 비밀번호로 자동 사용
      const passwordToSend = isKakaoUser ? "SOCIAL_LOGIN" : password;
      await deleteAccountAsync(passwordToSend);
    } catch {
      /* onError에서 처리 */
    }
  };

  return (
    <BigModal isOpen={isOpen} onClose={resetAndClose}>
      <div className="w-full sm:max-w-[480px] mx-auto py-2 px-4 sm:px-6">
        {!success ? (
          <>
            <h2 className="text-center text-base sm:text-lg font-medium mb-1 leading-snug">
              <span className="text-[#FF4545] font-playfair font-semibold">
                Marketer’s Fridge
              </span>{" "}
              계정을 탈퇴하시겠습니까?
            </h2>
            <p className="text-center text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8">
              {isKakaoUser
                ? "카카오 로그인 계정을 탈퇴하시겠습니까?"
                : "계속 진행하시려면 비밀번호를 입력해주세요."}
            </p>

            {/* 🔹 필드 영역: 모바일/웹 모두 한 줄 정렬 */}
            <div className="flex flex-col gap-3 mb-2 text-xs sm:text-sm">
              {/* 계정 (라벨 + 입력 한 줄) */}
              <div className="flex items-center gap-2">
                <label className="w-14 sm:w-16 text-[11px] sm:text-xs font-semibold">
                  계정
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="flex-1 bg-gray-100 text-gray-500 border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm cursor-not-allowed"
                />
              </div>

              {/* 비밀번호 (일반 회원일 때만 노출, 라벨 + 입력 한 줄) */}
              {!isKakaoUser && (
                <div className="flex items-center gap-2">
                  <label className="w-14 sm:w-16 text-[11px] sm:text-xs font-semibold">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="비밀번호 입력"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
              )}

              {/* 에러 메시지 */}
              {errorMsg && (
                <p className="text-[11px] text-red-500 mt-1 ml-[4.2rem] sm:ml-[4.5rem]">
                  {errorMsg}
                </p>
              )}
            </div>

            {/* 버튼: 모바일은 양쪽 꽉, 데스크탑은 내용만 */}
            <div className="flex justify-center gap-3 sm:gap-6 mt-6 w-full">
              <button
                onClick={resetAndClose}
                disabled={isLoading}
                className="
                  cursor-pointer
                  w-full
                  py-2
                  bg-white text-gray-700
                  text-[13px] sm:text-[12.5px] font-medium
                  rounded-lg
                  hover:bg-gray-50
                  transition
                  sm:w-auto
                  sm:px-9
                  sm:py-0.5
                  border border-gray-300
                "
              >
                취소
              </button>

              <button
                onClick={handleConfirm}
                disabled={isLoading || (!isKakaoUser && password.length === 0)}
                className="
                  cursor-pointer
                  w-full
                  py-2
                  bg-red-500 text-white
                  text-[13px] sm:text-[12.5px] font-medium
                  rounded-lg
                  hover:bg-red-600
                  transition
                  sm:w-auto
                  sm:px-9
                  sm:py-0.5
                  border border-red-500
                  disabled:opacity-60
                "
              >
                {isLoading ? "처리 중..." : "확인"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4 px-1 sm:px-2">
            <h2 className="text-base sm:text-lg font-medium mb-3 leading-snug">
              <span className="text-[#FF4545] font-playfair">
                Marketer’s Fridge
              </span>{" "}
              계정이 탈퇴되었습니다.
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-5 sm:mb-6">
              이용해주셔서 감사합니다.
            </p>
            <button
              onClick={resetAndClose}
              className="cursor-pointer px-6 py-2 rounded-2xl bg-[#FF4545] text-white text-xs sm:text-[11px] hover:bg-red-600 w-full"
            >
              확인
            </button>
          </div>
        )}
      </div>
    </BigModal>
  );
};

export default DeleteAccountModal;
