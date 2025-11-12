"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteAccount } from "../api/authApi";

/** 토큰/세션 정리 */
function cleanupAuth() {
  try {
    localStorage.removeItem("accessToken");
  } catch {}
  // 필요하면 추가 쿠키 삭제 로직 삽입
}

type UseDeleteAccountOptions = {
  /** 성공 후 실행할 커스텀 동작 */
  onSuccess?: (message: string) => void;
  /** 실패 시 실행할 커스텀 동작 */
  onError?: (error: unknown) => void;
  /** 삭제 완료 후 이동할 경로. 기본값: /auth/signin */
  redirectTo?: string;
};

/**
 * 계정 탈퇴 훅
 * - 서버에 현재 비밀번호 전달해 탈퇴
 * - 성공 시 토큰 정리, 캐시 초기화, 로그인 화면으로 이동
 */
export function useDeleteAccount(options: UseDeleteAccountOptions = {}) {
  const { onSuccess, onError, redirectTo = "/auth/signin" } = options;
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (currentPassword: string) => {
      if (!currentPassword) throw new Error("현재 비밀번호가 필요합니다.");
      const msg = await deleteAccount(currentPassword);
      return msg;
    },
    onSuccess: async (message) => {
      // 인증 정리
      cleanupAuth();
      // 리액트쿼리 캐시 비움
      await queryClient.clear();

      // 커스텀 콜백
      onSuccess?.(message);

      // 라우팅
      router.replace(redirectTo);
    },
    onError: (err) => {
      onError?.(err);
      // 공통 에러 로깅만 남김
      // 필요하면 여기에 토스트 연결
      console.error("[계정 탈퇴 실패]", err);
    },
  });

  return {
    /** 계정 탈퇴 실행: mutate("현재비밀번호") */
    deleteAccount: mutation.mutate,
    /** Promise 형태로 사용하고 싶을 때 */
    deleteAccountAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data, // 서버가 반환한 메시지
  };
}
