// src/app/login/kakao/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import axios from "axios";

interface KakaoLoginResponse {
  token: string;
  isNewUser: boolean;
}

// 실제 로직이 들어가는 컴포넌트
function KakaoCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      alert("카카오 로그인에 실패했습니다.");
      router.replace("/login");
      return;
    }

    const doLogin = async () => {
      try {
        // ✅ 토큰 필요 없는 최초 로그인 요청이므로 apiClient 말고 axios 직접 사용
        const res = await axios.get<KakaoLoginResponse>("/auth/kakao/callback", {
          params: { code },
        });

        const data = res.data;

        // JWT 저장
        localStorage.setItem("accessToken", data.token);

        // 신규 유저면 추가 정보 입력 페이지로
        if (data.isNewUser) {
          router.replace("/signUp/kakao");
          return;
        }

        // 기존 유저면 홈으로
        router.replace("/");
      } catch (e) {
        // ⬇ 여기 타입 지정 아예 안 함 + 프로퍼티 접근 안 함 → TS 에러 안 남
        console.error("KAKAO CALLBACK ERROR:", e);
        alert("카카오 로그인 중 오류가 발생했습니다.");
        router.replace("/login");
      }
    };

    doLogin();
  }, [router, searchParams]);

  // 실제 화면은 거의 안 보이고, 대부분 라우팅으로 넘어감
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>카카오 로그인 처리 중입니다...</p>
    </div>
  );
}

// Suspense로 감싼 페이지 컴포넌트 (Next 요구사항 충족)
export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>카카오 로그인 처리 중입니다...</p>
        </div>
      }
    >
      <KakaoCallbackInner />
    </Suspense>
  );
}
