// src/app/login/kakao/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { kakaoLogin } from "@/features/auth/api/authApi";

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
        // ✅ 이제 axios 생짜 말고, 공용 api 인스턴스 사용!
        const { token, isNewUser } = await kakaoLogin(code);

        // 혹시 kakaoLogin에서 localStorage 안 건드리게 하고 싶으면 여기에 둬도 됨
        localStorage.setItem("accessToken", token);

        if (isNewUser) {
          router.replace("/signUp/kakao");
          return;
        }

        router.replace("/");
      } catch (e) {
        console.error("KAKAO CALLBACK ERROR:", e);
        alert("카카오 로그인 중 오류가 발생했습니다.");
        router.replace("/login");
      }
    };

    doLogin();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>카카오 로그인 처리 중입니다...</p>
    </div>
  );
}

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
