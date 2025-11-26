// src/features/user/hooks/useResetPasswordByFindPw.ts
import { useMutation } from "@tanstack/react-query";
import { resetPasswordByFindPw } from "../api/authApi";

type ResetPasswordVars = {
  userId: string;
  newPassword: string;
  confirmNewPassword: string;
};

export function useResetPasswordByFindPw() {
  return useMutation<string, Error, ResetPasswordVars>({
    mutationFn: ({ userId, newPassword, confirmNewPassword }) =>
      resetPasswordByFindPw(userId, newPassword, confirmNewPassword),
  });
}
