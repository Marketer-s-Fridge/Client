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

/** ✅ 토큰 헤더 헬퍼 */
const authHeader = () => {
  const t = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return t ? { Authorization: `Bearer ${t}` } : {};
};

/** ✅ 인터셉터 */
api.interceptors.request.use((config) => {
  console.log(`📡 [요청] ${config.method?.toUpperCase()} ${config.url}`, config.data || "");
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
  const res = await api.get<string>("/auth/signup/duplication_check", { params: { email } });
  return res.data.trim() === "Successful";
};

/** ✅ 로그인 */
export const signin = async (dto: SigninRequestDto): Promise<string> => {
  const res = await api.post("/auth/signin", dto);
  const token = typeof res.data === "string" ? res.data : null;
  if (token) localStorage.setItem("accessToken", token);
  return token!;
};

/** ✅ 아이디 찾기 */
export const findId = async (name: string, email: string): Promise<UserResponseDto> => {
  const res = await api.get<UserResponseDto>("/auth/signin/find_id", { params: { name, email } });
  return res.data;
};

/** ✅ 비밀번호 찾기 */
export const findPw = async (id: string, email: string): Promise<string> => {
  const res = await api.get<string>("/auth/signin/find_pw", { params: { id, email } });
  return res.data;
};

/** ✅ 회원 탈퇴 (DELETE with body) */
export const deleteAccount = async (currentPassword: string): Promise<string> => {
  const res = await api.request<string, any, { currentPassword: string }>({
    url: "/auth/delete",
    method: "DELETE",
    data: { currentPassword },
    headers: { ...authHeader() }, // 이미 객체면 스프레드 불필요. 상황에 맞게.
  });
  return res.data; // ← 캐스팅 제거
};

/** ✅ 닉네임 중복 체크 */
export const checkNickname = async (nickname: string): Promise<string> => {
  const res = await api.get<string>("/auth/nickname/check", { params: { nickname } });
  return res.data;
};

/** ✅ 닉네임 변경 */
export const updateNickname = async (nickname: string): Promise<string> => {
  const res = await api.patch<string>("/auth/nickname", { nickname }, { headers: { ...authHeader() } });
  return res.data;
};

/** ✅ 프로필 이미지 변경 */
export const updateProfileImage = async (profileImageUrl: string): Promise<string> => {
  const res = await api.patch<string>("/auth/profile/image", { profileImageUrl }, { headers: { ...authHeader() } });
  return res.data;
};

/** ✅ 회원 정보 수정 */
export const updateUserInfo = async (name: string, nickname: string, phone: string): Promise<string> => {
  const res = await api.patch<string>("/auth/update", { name, nickname, phone }, { headers: { ...authHeader() } });
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