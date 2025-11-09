// src/features/user/api/authApi.ts
import axios from "axios";
import {
  SignupRequestDto,
  SigninRequestDto,
  UserResponseDto,
} from "../types";

/** Axios 인스턴스 */
const api = axios.create({
  baseURL: "/", // Next.js rewrite 사용
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/** 공통: 브라우저에서만 토큰 읽기 */
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") ?? "" : "";

/** 공통: 인증 헤더 생성 */
const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** 인터셉터 */
api.interceptors.request.use((config) => {
  console.log(`📡 [요청] ${config.method?.toUpperCase()} ${config.url}`, config.data ?? "");
  return config;
});
api.interceptors.response.use(
  (res) => {
    console.log(`✅ [응답 성공] ${res.config.url} (${res.status})`, res.data);
    return res;
  },
  (err) => {
    console.error(
      `❌ [응답 오류] ${err.config?.url || "요청 URL 없음"} (${err.response?.status || "네트워크 에러"})`,
      err.response?.data || err.message
    );
    return Promise.reject(err);
  }
);

/** ✅ 회원가입 */
export const signup = async (dto: SignupRequestDto): Promise<string> => {
  const res = await api.post<string>("/auth/signup", dto);
  return res.data;
};

/** ✅ 이메일 중복 체크 */
export const checkEmailDuplication = async (email: string): Promise<boolean> => {
  const res = await api.get<string>("/auth/signup/duplication_check", {
    params: { email },
  });
  return res.data.trim() === "Successful"; // 사용 가능 여부
};

/** ✅ 로그인 */
export const signin = async (dto: SigninRequestDto): Promise<string> => {
  const res = await api.post("/auth/signin", dto);
  const token = typeof res.data === "string" ? res.data : "";
  if (token && typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
  return token;
};

/** ✅ 아이디 찾기 */
export const findId = async (name: string, email: string): Promise<UserResponseDto> => {
  const res = await api.get<UserResponseDto>("/auth/signin/find_id", {
    params: { name, email },
  });
  return res.data;
};

/** ✅ 비밀번호 찾기 */
export const findPw = async (id: string, email: string): Promise<string> => {
  const res = await api.get<string>("/auth/signin/find_pw", {
    params: { id, email },
  });
  return res.data;
};

/**
 * ✅ 회원 탈퇴
 * axios 0.27 계열 호환 위해 request()로 DELETE + body 전송
 * (axios 1.x 사용 시 delete(url, { data })도 가능)
 */
export const deleteAccount = async (currentPassword: string): Promise<string> => {
  const res = await api.request<string>({
    url: "/auth/delete",
    method: "DELETE",
    data: { currentPassword },
    headers: { ...authHeader() },
  });
  return res.data;
};

/** ✅ 닉네임 중복 체크 */
export const checkNickname = async (nickname: string): Promise<string> => {
  const res = await api.get<string>("/auth/nickname/check", {
    params: { nickname },
  });
  return res.data;
};

/** ✅ 닉네임 변경 */
export const updateNickname = async (nickname: string): Promise<string> => {
  const res = await api.patch<string>(
    "/auth/nickname",
    { nickname },
    { headers: { ...authHeader() } }
  );
  return res.data;
};

/** ✅ 프로필 이미지 변경 */
export const updateProfileImage = async (profileImageUrl: string): Promise<string> => {
  const res = await api.patch<string>(
    "/auth/profile/image",
    { profileImageUrl },
    { headers: { ...authHeader() } }
  );
  return res.data;
};

/** ✅ 회원 정보 수정 (이름/닉네임/휴대폰 등) */
export const updateUserInfo = async (
  name: string,
  nickname: string,
  phone: string
): Promise<string> => {
  const res = await api.patch<string>(
    "/auth/update",
    { name, nickname, phone },
    { headers: { ...authHeader() } }
  );
  return res.data;
};

/** ✅ 비밀번호 변경 */
export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
): Promise<string> => {
  const res = await api.patch<string>(
    "/auth/password",
    { currentPassword, newPassword, confirmNewPassword },
    { headers: { ...authHeader() } }
  );
  return res.data;
};

/** ✅ 전체 사용자 수 조회 */
export const fetchUserCount = async (): Promise<number> => {
  const res = await api.get<number>("/auth/count");
  return res.data;
};
