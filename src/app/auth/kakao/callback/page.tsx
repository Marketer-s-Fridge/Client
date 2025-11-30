// src/app/auth/kakao/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import api from "@/lib/apiClient";

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
        const res = await api.get("/auth/kakao/callback", {
          params: { code },
        });

        const data = res.data as KakaoLoginResponse;

        // JWT 저장
        localStorage.setItem("accessToken", data.token);

        // 회원가입에서 시작했는지 or 로그인에서 시작했는지
        const flow =
          sessionStorage.getItem("kakaoFlow") === "signup"
            ? "signup"
            : "login";

        sessionStorage.removeItem("kakaoFlow");

        // 1) signup flow or 2) 백엔드에서 신규유저라고 보낸 경우 → 추가정보 입력
        if (flow === "signup" || data.isNewUser) {
          router.replace("/signUp/kakao");
          return;
        }

        // 기존 유저면 홈으로
        router.replace("/");
      } catch (e) {
        console.error(e);
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
