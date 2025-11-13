// src/features/auth/api/emailVerificationApi.ts
// import api from "@/lib/api";
import api from "@/lib/apiClient";

// 응답 타입은 일단 any로 두고 나중에 인터페이스 정의해서 바꿔도 됨

/** 아이디 중복 체크 */
export const checkIdDuplicationApi = async (id: string) => {
  const res = await api.get("/auth/id_duplication_check", {
    params: { id },
  });
  return res.data; // ← 여기서 data만 꺼내서 리턴 (Promise<데이터타입>)
};

/** 인증코드 발송 */
export const sendVerificationCodeApi = async (email: string) => {
  const res = await api.post("/auth/send_verification_code", {
    email,
  });
  return res.data;
};

/** 이메일 + 코드 검증 */
export const verifyEmailCodeApi = async (params: {
  email: string;
  code: string;
}) => {
  const res = await api.get("/auth/verify_code", {
    params,
  });
  return res.data;
};
