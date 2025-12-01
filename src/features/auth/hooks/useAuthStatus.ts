import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserResponseDto } from "../types";
import { fetchUserInfo } from "../api/authApi";
import { useEffect } from "react";

export function useAuthStatus() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const hasToken = !!token;
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<UserResponseDto, Error>({
    queryKey: ["auth", "me"],
    queryFn: fetchUserInfo,
    enabled: hasToken,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // 인증 실패(401/403)면 토큰 삭제
  useEffect(() => {
    const status = (error as any)?.response?.status;
    if (isError && (status === 401 || status === 403)) {
      localStorage.removeItem("accessToken");
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
    }
  }, [isError, error, queryClient]);

  // 🔹 토큰이 없으면 user는 무조건 undefined로 강제
  const user = hasToken ? data : undefined;

  const isAuthenticated = !isLoading && hasToken && !!user;

  return {
    isAuthenticated,
    user,
    isLoading,
    isError,
    error,
  };
}
