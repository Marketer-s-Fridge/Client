import { useQuery } from "@tanstack/react-query";
import { findPw } from "../api/authApi";

export function useFindPwd(name: string, id: string, email: string) {
  return useQuery<string>({
    queryKey: ["findPw", name, id, email],
    queryFn: () => findPw(name, id, email),
    enabled: !!name && !!id && !!email,
  });
}
