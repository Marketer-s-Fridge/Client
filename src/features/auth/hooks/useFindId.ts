// useFindId.ts
import { useQuery } from "@tanstack/react-query";
import { findId } from "../api/authApi";
import { UserResponseDto } from "../types";

export function useFindId(name: string, email: string) {
  return useQuery<UserResponseDto | null>({
    queryKey: ["findId", name, email],
    enabled: !!name && !!email,
    queryFn: async () => {
      try {
        return await findId(name, email);
      } catch (e: any) {
        if (e?.response?.status === 404) return null; // ← 미존재를 null로
        throw e;
      }
    },
  });
}
