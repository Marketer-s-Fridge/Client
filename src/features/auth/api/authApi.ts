// src/features/user/api/authApi.ts
import axios from "axios";
import {
  SignupRequestDto,
  SigninRequestDto,
  UserResponseDto,
} from "../types";

/** ✅ Axios 인스턴스 */
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

/** ✅ 회원가입 */
export const signup = async (dto: SignupRequestDto): Promise<string> => {
  const res = await api.post<string>("/auth/signup", dto);
  return res.data;
};

/** ✅ 이메일 중복 체크 */
export const checkEmailDuplication = async (
  email: string
): Promise<boolean> => {
  const res = await api.get<string>("/auth/signup/duplication_check", {
    params: { email },
  });
  const text = res.data.trim();
  return text === "Failed";
};

/** ✅ 로그인 */
export const signin = async (dto: SigninRequestDto): Promise<string> => {
  const res = await api.post("/auth/signin", dto);
  const body = res.data as any;

  const token =
    body?.data?.token ??
    body?.token ??
    (typeof body === "string" ? body : null);

  if (!token) {
    console.error("🚨 로그인 응답 구조 이상:", body);
    throw new Error("토큰 응답 없음");
  }

  localStorage.setItem("accessToken", token);
  return token;
};

/** ✅ 아이디 찾기 */
export const findId = async (name: string, email: string): Promise<UserResponseDto | null> => {
  try {
    const res = await api.get<UserResponseDto>("/auth/signin/find_id", { params: { name, email } });
    return res.data;
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
};

/** ✅ 비밀번호 찾기 */
export const findPw = async (
  name: string,
  id: string,
  email: string
): Promise<string> => {
  const res = await api.get<string>("/auth/signin/find_pw", {
    params: { name, id, email },
  });
  return res.data;
};

/** ✅ 회원 탈퇴 */
export const deleteAccount = async (
  currentPassword: string
): Promise<string> => {
  const res = await api.request({
    url: "/auth/delete",
    method: "DELETE",
    data: { currentPassword },
  });
  return String(res.data);
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
  const res = await api.patch<string>("/auth/nickname", { nickname });
  return res.data;
};

/** ✅ 프로필 이미지 변경 */
export const updateProfileImage = async (
  profileImageUrl: string
): Promise<string> => {
  const res = await api.patch<string>("/auth/profile-image", {
    profileImageUrl,
  });
  return res.data;
};

/** ✅ 회원 정보 수정 */
export const updateUserInfo = async (
  name: string,
  nickname: string,
  phone: string
): Promise<string> => {
  const res = await api.patch<string>("/auth/update", {
    name,
    nickname,
    phone,
  });
  return res.data;
};

/** ✅ 비밀번호 변경 */
export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
): Promise<string> => {
  const res = await api.patch<string>("/auth/password", {
    currentPassword,
    newPassword,
    confirmNewPassword,
  });
  return res.data;
};

/** ✅ 전체 사용자 수 조회 */
export const fetchUserCount = async (): Promise<number> => {
  const res = await api.get<number>("/auth/count");
  return res.data;
};

/** ✅ 내 정보 */
export const fetchUserInfo = async (): Promise<UserResponseDto> => {
  const res = await api.get<UserResponseDto>("/auth/me");
  return res.data;
};
