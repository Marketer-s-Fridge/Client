// src/features/auth/api/emailVerificationApi.ts

import axios from "axios";

/** ✅ 이메일 인증 전용 Axios 인스턴스 (JWT 안 붙음) */
const api = axios.create({
  baseURL: "/",
  withCredentials: true,
});

/** ✅ 요청 로깅 (토큰 X) */
api.interceptors.request.use((config) => {
  console.log(
    `📡 [요청] ${config.method?.toUpperCase()} ${config.url}`,
    config.data || "",
    config.params || ""
  );
  return config;
});

/** ✅ 응답 로깅 */
api.interceptors.response.use(
  (res) => {
    console.log(`✅ [응답 성공] ${res.config.url} (${res.status})`, res.data);
    return res;
  },
  (err) => {
    console.error(
      `❌ [응답 오류] ${err.config?.url || "요청 URL 없음"} (${
        err.response?.status || "네트워크 에러"
      })`,
      err.response?.data || err.message
    );
    return Promise.reject(err);
  }
);

/** ✅ 아이디 중복 체크
 *  GET /auth/id_duplication_check?id=...
 */
export const checkIdDuplicationApi = async (id: string) => {
  const res = await api.get<string>("/auth/id_duplication_check", {
    params: { id },
  });
  return res.data; // "Available" 또는 "Duplicated" (백엔드 구현에 따라)
};

/** ✅ 인증코드 발송
 *  POST /auth/send_verification_code?email=...
 */
export const sendVerificationCodeApi = async (email: string) => {
  const res = await api.post<string>(
    "/auth/send_verification_code",
    null,
    {
      params: { email }, // @RequestParam("email")
    }
  );
  return res.data; // "Verification code sent: {code}" 등
};

/** ✅ 이메일 + 코드 검증
 *  GET /auth/verify_code?email=...&code=...
 */
export const verifyEmailCodeApi = async (params: {
  email: string;
  code: string;
}) => {
  const res = await api.get<string>("/auth/verify_code", {
    params,
  });
  return res.data; // "Email verified successfully" 또는 에러 메시지
};
