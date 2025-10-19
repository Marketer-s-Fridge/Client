import axios from "axios";

// .env 파일에 NEXT_PUBLIC_API_URL=https://api.yourdomain.com 이런 식으로 설정
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://15.165.137.5:8081/",
  withCredentials: true, // 쿠키/세션 인증 필요할 때 true
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (ex: 토큰 자동 추가)
api.interceptors.request.use(
  (config) => {
    if (!config.headers) {
        config.headers = {}; // ✅ 없으면 빈 객체로 초기화
      }
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (에러 처리 공통화)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 처리 예시
    if (error.response?.status === 401) {
      console.warn("인증 만료! 다시 로그인 필요");
      // window.location.href = "/login"; <- 필요시 리다이렉트
    }
    return Promise.reject(error);
  }
);

export default api;
