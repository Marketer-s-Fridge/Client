// useFindId.ts
import { useQuery } from "@tanstack/react-query";
import { findId } from "../api/authApi";
import { UserResponseDto } from "../types";

export function useFindId(name: string, email: string) {
  return useQuery<UserResponseDto | null>({
    queryKey: ["findId", name, email],
    queryFn: () => findId(name, email),
    enabled: false,                // ✅ 입력 중 자동 호출 방지
    retry: false,                  // 선택: 자동 재시도 방지
    refetchOnWindowFocus: false,   // 선택: 포커스 시 재조회 방지
  });
}
