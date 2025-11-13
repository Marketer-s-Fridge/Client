// src/features/auth/api/emailVerificationApi.ts
// import api from "@/lib/api";

/** ✅ Axios 인스턴스 */
import axios from "axios";

const api = axios.create({
    baseURL: "/",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  
  /** ✅ 인터셉터: 모든 요청에 JWT 자동 첨부 */
  api.interceptors.request.use((config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
  
    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }
  
    console.log(
      `📡 [요청] ${config.method?.toUpperCase()} ${config.url}`,
      config.data || ""
    );
    return config;
  });
  
  /** ✅ 인터셉터: 응답 로깅 */
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
    const res = await api.post("/auth/send_verification_code", null, {
      params: { email },   // ✅ 쿼리 파라미터로 전송
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
