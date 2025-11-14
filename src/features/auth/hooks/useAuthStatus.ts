// src/features/auth/hooks/useAuthStatus.ts
"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "../api/authApi";
import type { UserResponseDto } from "../types";

export function useAuthStatus() {
  // 클라이언트에서만 토큰 조회
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const hasToken = !!token;

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<UserResponseDto, Error>({
    queryKey: ["auth", "me"],       // 유저 정보 캐시 키
    queryFn: fetchUserInfo,         // /auth/me 호출 함수
    enabled: hasToken,              // 토큰 있을 때만 호출
    staleTime: 5 * 60 * 1000,       // 5분 동안 재요청 X
    gcTime: 30 * 60 * 1000,         // (v5) 예전 cacheTime 역할
    refetchOnWindowFocus: false,    // 탭 포커스 시 재요청 X
    retry: false,
  });

  // 인증 실패(401/403)면 토큰 삭제
  useEffect(() => {
    const status = (error as any)?.response?.status;
    if (isError && (status === 401 || status === 403)) {
      localStorage.removeItem("accessToken");
    }
  }, [isError, error]);

  // 로딩 끝 + 토큰 있음 + 유저 데이터 존재 → 로그인 상태로 판단
  const isAuthenticated = !isLoading && hasToken && !!user;

  return {
    isAuthenticated,
    user,
    isLoading,
    isError,
    error,
  };
}
