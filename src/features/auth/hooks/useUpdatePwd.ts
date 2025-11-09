// src/features/user/hooks/useUpdatePwd.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePassword } from "../api/authApi";

type UpdatePasswordVars = {
  currentPassword?: string;   // 비번 찾기 흐름이면 생략 가능
  newPassword: string;
  confirmNewPassword: string;
};

export function useUpdatePassword() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, UpdatePasswordVars>({
    mutationFn: ({ currentPassword = "", newPassword, confirmNewPassword }) =>
      updatePassword(currentPassword, newPassword, confirmNewPassword),
    onSuccess: () => {
      // 필요 시 사용자 정보 갱신
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    },
  });
}
