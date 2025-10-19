import api from "@/lib/apiClient";
import { SignupRequestDto, SigninRequestDto, UserResponseDto } from "../types";

// ✅ 회원가입
export const signup = async (dto: SignupRequestDto): Promise<string> => {
  console.log("🚀 [회원가입 요청 시작]", dto);
  try {
    const res = await api.post<string>("/auth/signup", dto);
    console.log("✅ [회원가입 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [회원가입 실패]:", error);
    throw error;
  }
};

// ✅ 이메일 중복 체크
export const checkEmailDuplication = async (email: string): Promise<boolean> => {
  console.log("🔍 [이메일 중복체크 요청]", email);
  try {
    const res = await api.get<boolean>("/auth/signup/email_duplication_check", {
      params: { email },
    });
    console.log("✅ [중복체크 결과]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [중복체크 실패]:", error);
    throw error;
  }
};

// ✅ 로그인
export const signin = async (dto: SigninRequestDto): Promise<UserResponseDto> => {
  console.log("🚀 [로그인 요청 시작]", dto);
  try {
    const res = await api.post<UserResponseDto>("/auth/signin", dto);
    console.log("✅ [로그인 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [로그인 실패]:", error);
    throw error;
  }
};

// ✅ 아이디 찾기
export const findId = async (name: string, email: string): Promise<UserResponseDto> => {
  console.log("🔍 [아이디 찾기 요청]", { name, email });
  try {
    const res = await api.get<UserResponseDto>("/auth/signin/find_id", {
      params: { name, email },
    });
    console.log("✅ [아이디 찾기 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [아이디 찾기 실패]:", error);
    throw error;
  }
};

// ✅ 비밀번호 찾기
export const findPw = async (id: string, email: string): Promise<string> => {
  console.log("🔍 [비밀번호 찾기 요청]", { id, email });
  try {
    const res = await api.get<string>("/auth/signin/find_pw", {
      params: { id, email },
    });
    console.log("✅ [비밀번호 찾기 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [비밀번호 찾기 실패]:", error);
    throw error;
  }
};
