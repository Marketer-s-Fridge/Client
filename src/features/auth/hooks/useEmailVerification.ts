// src/features/auth/hooks/useEmailVerification.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import {
  checkIdDuplicationApi,
  sendVerificationCodeApi,
  verifyEmailCodeApi,
} from "../api/emailVerificationApi";

export const useCheckIdDuplication = () => {
  return useMutation({
    mutationKey: ["auth", "id-duplication-check"],
    mutationFn: (id: string) => checkIdDuplicationApi(id),
  });
};

export const useSendVerificationCode = () => {
  return useMutation({
    mutationKey: ["auth", "send-verification-code"],
    mutationFn: (email: string) => sendVerificationCodeApi(email),
  });
};

export const useVerifyEmailCode = () => {
  return useMutation({
    mutationKey: ["auth", "verify-email-code"],
    mutationFn: (payload: { email: string; code: string }) =>
      verifyEmailCodeApi(payload),
  });
};
