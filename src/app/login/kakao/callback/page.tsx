// src/app/login/kakao/callback/page.tsx
"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { kakaoLogin } from "@/features/auth/api/authApi";

function KakaoCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCalledRef = useRef(false); // ✅ 중복 호출 방지 플래그

  useEffect(() => {
    // 이미 한 번 실행됐으면 더 이상 호출 X
    if (isCalledRef.current) return;
    isCalledRef.current = true;

    const code = searchParams.get("code");

    if (!code) {
      alert("카카오 로그인에 실패했습니다.");
      router.replace("/login");
      return;
    }

    const doLogin = async () => {
      try {
        // ✅ 공용 kakaoLogin API 사용
        const { token, isNewUser } = await kakaoLogin(code);

        // ✅ 액세스 토큰 저장
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
