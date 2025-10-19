// useCheckEmailDuplication.ts
import { useQuery } from "@tanstack/react-query";
import { checkEmailDuplication } from "../api/authApi";

export function useCheckEmailDuplication(email: string) {
  return useQuery<boolean>({
    queryKey: ["emailDuplication", email],
    queryFn: () => checkEmailDuplication(email),
    enabled: false, // ✅ 자동 실행 막기 (버튼 클릭 시 refetch로만 실행)
    retry: false,
  });
}
