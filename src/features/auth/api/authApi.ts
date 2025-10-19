import axios from "axios";
import { SignupRequestDto, SigninRequestDto, UserResponseDto } from "../types";

/** ✅ Axios 인스턴스 설정 */
const api = axios.create({
  baseURL: "/", // 👈 Next.js rewrite를 통해 백엔드로 전달됨
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/** ✅ 요청 & 응답 인터셉터 */
api.interceptors.request.use((config) => {
  console.log(`📡 [요청 전송] ${config.method?.toUpperCase()} ${config.url}`, config.data || "");
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
  console.log("📝 [회원가입 요청 시작]", dto);
  try {
    const res = await api.post<string>("/auth/signup", dto);
    console.log("🎉 [회원가입 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [회원가입 실패]", error);
    throw error;
  }
};

/** ✅ 이메일 중복 체크 */
export const checkEmailDuplication = async (email: string): Promise<boolean> => {
  console.log("🔍 [이메일 중복체크 요청]", email);
  try {
    const res = await api.get<boolean>("/auth/signup/duplication_check", {
      params: { email },
    });
    console.log("✅ [이메일 중복체크 완료]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [이메일 중복체크 실패]", error);
    throw error;
  }
};

/** ✅ 로그인 */
export const signin = async (dto: SigninRequestDto): Promise<string> => {
  console.log("🔐 [로그인 요청]", dto);
  try {
    const res = await api.post("/auth/signin", dto);
    const token = typeof res.data === "string" ? res.data : null;
    console.log("🎉 [로그인 성공] 토큰:", token);

    // ✅ 토큰을 localStorage 등에 저장
    localStorage.setItem("accessToken", token!);

    return token!;
  } catch (error) {
    console.error("🚨 [로그인 실패]", error);
    throw error;
  }
};


/** ✅ 아이디 찾기 */
export const findId = async (
  name: string,
  email: string
): Promise<UserResponseDto> => {
  console.log("🔎 [아이디 찾기 요청]", { name, email });
  try {
    const res = await api.get<UserResponseDto>("/auth/signin/find_id", {
      params: { name, email },
    });
    console.log("✅ [아이디 찾기 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [아이디 찾기 실패]", error);
    throw error;
  }
};

/** ✅ 비밀번호 찾기 */
export const findPw = async (id: string, email: string): Promise<string> => {
  console.log("🔑 [비밀번호 찾기 요청]", { id, email });
  try {
    const res = await api.get<string>("/auth/signin/find_pw", {
      params: { id, email },
    });
    console.log("✅ [비밀번호 찾기 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [비밀번호 찾기 실패]", error);
    throw error;
  }
};
