// useCheckEmailDuplication.ts
import { useQuery } from "@tanstack/react-query";
import { checkEmailDuplication } from "../api/authApi";

export function useCheckEmailDuplication(email: string) {
  const normalized = (email ?? "").trim().toLowerCase();

  return useQuery({
    queryKey: ["emailDuplication", normalized],   // ✅ 키도 정규화(공백/대문자 이슈 방지)
    queryFn: () => checkEmailDuplication(normalized),
    enabled: false,   // 버튼 클릭 시 refetch로만 실행
    retry: false,
  });
}
