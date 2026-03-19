// src/features/user/api/authApi.ts
import axios from "axios";
import {
  SignupRequestDto,
  SigninRequestDto,
  UserResponseDto,
} from "../types";

/** ✅ 토큰이 필요한 경로들만 정리 */
const AUTH_REQUIRED_PATHS = [
  "/auth/me",
  "/auth/delete",
  "/auth/nickname/check",
  "/auth/nickname",
  "/auth/profile-image",
  "/auth/update",
  "/auth/password",
  "/auth/profile", // ← 이거
];

/** ✅ Axios 인스턴스 */
const api = axios.create({
  baseURL: "/",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const setAccessTokenCookie = (token: string) => {
  if (typeof window === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    [
      `accessToken=${encodeURIComponent(token)}`,
      "Path=/",
      "SameSite=Lax",
      "Max-Age=604800",
    ].join("; ") + secure;
};

/** ✅ 인터셉터: 특정 요청에만 JWT 자동 첨부 + 로깅 */
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const url = config.url || "";
  const needsAuth = AUTH_REQUIRED_PATHS.some((path) =>
    url.startsWith(path)
  );

  if (!config.headers) config.headers = {};

  // ✅ 지정된 경로에만 Authorization 헤더 추가
  if (needsAuth && token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }

  console.log(
    `📡 [요청] ${config.method?.toUpperCase()} ${config.url}`,
    config.data || "",
    config.params || ""
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

/* ----------------------------------------------------------------
 *  회원가입 / 로그인
 * ---------------------------------------------------------------- */

/** ✅ 회원가입 */
export const signup = async (dto: SignupRequestDto): Promise<string> => {
  const res = await api.post<string>("/auth/signup", dto);
  return res.data;
};

/** ✅ 이메일 중복 체크 (true = 중복됨) */
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
  setAccessTokenCookie(token);
  return token;
};

/* ----------------------------------------------------------------
 *  아이디/비밀번호 찾기 (토큰 필요 없음)
 * ---------------------------------------------------------------- */

/** ✅ 아이디 찾기 */
export const findId = async (
  name: string,
  email: string
): Promise<UserResponseDto | null> => {
  try {
    const res = await api.get<UserResponseDto>("/auth/signin/find_id", {
      params: { name, email },
    });
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

/* ----------------------------------------------------------------
 *  계정 관련 (JWT 필요)
 * ---------------------------------------------------------------- */

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

/** ✅ 닉네임 중복 체크 (로그인 필요) */
export const checkNickname = async (nickname: string): Promise<string> => {
  const res = await api.get<string>("/auth/nickname/check", {
    params: { nickname },
  });
  return res.data; // "Duplicated" | "Available"
};

/** ✅ 닉네임 변경 */
export const updateNickname = async (nickname: string): Promise<string> => {
  const res = await api.patch<string>("/auth/nickname", { nickname });
  return res.data;
};

/** ✅ 프로필 이미지 변경 */
export const updateProfileImage = async (profileImageUrl: string): Promise<string> => {
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
  return res.data; // "Successful" 등
};

export const resetPasswordByFindPw = async (
  userId: string,
  newPassword: string,
  confirmNewPassword: string
): Promise<string> => {
  const res = await api.patch<string>("/auth/signin/find_pw/password", {
    userId,
    newPassword,
    confirmNewPassword,
  });
  return res.data;
};

/** ✅ 내 정보 */
export const fetchUserInfo = async (): Promise<UserResponseDto> => {
  const res = await api.get<UserResponseDto>("/auth/me");
  return res.data;
};

/* ----------------------------------------------------------------
 *  그 외 공용 API (토큰 필요 없음)
 * ---------------------------------------------------------------- */

/** ✅ 전체 사용자 수 조회 */
export const fetchUserCount = async (): Promise<number> => {
  // 백엔드: @GetMapping("/count")
  const res = await api.get<number>("/count");
  return res.data;
};

/** ✅ 아이디 중복 체크 (true = 사용 가능) */
export const checkIdDuplicationApi = async (id: string): Promise<boolean> => {
  try {
    const res = await api.get<string>("/auth/id_duplication_check", {
      params: { id },
    });
    const text = res.data.trim();
    return text === "Available";
  } catch (e: any) {
    if (e?.response?.status === 400) {
      // Duplicated
      return false;
    }
    throw e;
  }
};

/** ✅ 인증코드 발송 (토큰 X)
 *  백엔드: @RequestParam("email") 로 받으므로 query param으로 전송
 */
export const sendVerificationCodeApi = async (
  email: string
): Promise<string> => {
  const res = await api.post<string>(
    "/auth/send_verification_code",
    null,
    {
      params: { email },
    }
  );
  return res.data;
};

/** ✅ 이메일 인증 (코드 검증, 토큰 X) */
export const verifyEmailCodeApi = async (
  email: string,
  code: string
): Promise<string> => {
  const res = await api.get<string>("/auth/verify_code", {
    params: { email, code },
  });
  return res.data;
};

// 맨 아래 쯤에 추가
export interface KakaoLoginResponse {
  token: string;
  isNewUser: boolean;
}

/** ✅ 카카오 로그인 (코드 -> JWT) */
export const kakaoLogin = async (
  code: string
): Promise<KakaoLoginResponse> => {
  const res = await api.get<KakaoLoginResponse>("/auth/kakao/callback", {
    params: { code },
  });

  const { token, isNewUser } = res.data;

  if (!token) {
    console.error("🚨 카카오 로그인 응답에 token 없음:", res.data);
    throw new Error("카카오 로그인 토큰 없음");
  }

  // 공통 로그인 로직과 맞추고 싶으면 여기서도 저장
  localStorage.setItem("accessToken", token);
  setAccessTokenCookie(token);

  return { token, isNewUser };
};

/** ✅ 카카오 추가 정보 입력 (JWT 필요 + 동의 항목 포함) */
export const updateKakaoExtraProfile = async (
  name: string,
  nickname: string,
  birthday: string,
  gender: string,
  over14: boolean,
  agreeProvidePersonalInfo: boolean,
  agreeCollectPersonalInfo: boolean,
  agreeMarketing: boolean
): Promise<UserResponseDto> => {
  const res = await api.patch<UserResponseDto>("/auth/profile", {
    name,
    nickname,
    birthday,
    gender,
    over14,
    agreeProvidePersonalInfo,
    agreeCollectPersonalInfo,
    agreeMarketing,
  });

  return res.data;
};
