import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
// import { fetchMyProfile } from "@/features/user/api/authApi";
import { UserResponseDto } from "../types";
import { fetchUserInfo } from "../api/authApi";

/**
 * ✅ JWT 토큰 존재 여부 + 유저 데이터 세팅용 훅
 * - accessToken이 없으면 비로그인 상태
 * - 있으면 /auth/me로 프로필 요청
 */
export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery<UserResponseDto>({
    queryKey: ["myProfile"],
    queryFn: fetchUserInfo,
    enabled: !!token, // 토큰이 있을 때만 실행
    retry: false,
  });

  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  return {
    isAuthenticated, // 로그인 여부 (true/false)
    user,            // 유저 데이터 (로그인된 경우만 존재)
    isLoading,       // 프로필 로딩 상태
    isError,         // 프로필 불러오기 실패 여부
    refetch,         // 수동 갱신
  };
}
