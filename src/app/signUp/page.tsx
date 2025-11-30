// pages/signUp/page.tsx
"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { AuthHeader } from "@/components/authFormComponents";
import Image from "next/image";
import MobileMenu from "@/components/mobileMenu";
import ConfirmModal from "@/components/confirmModal";
import { getKakaoAuthUrl } from "@/utils/getKakaoAuthUrl";

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ 네이버/구글은 아직 준비중 모달 유지
  const [showSocialModal, setShowSocialModal] = useState(false);

  const handleKakaoSignUp = () => {
    if (typeof window !== "undefined") {
      // ✅ 회원가입 플로우로 시작했다는 표시
      sessionStorage.setItem("kakaoFlow", "signup");
    }
    const url = getKakaoAuthUrl();
    if (url !== "#") {
      window.location.href = url;
    }
  };

  return (
    <div className="bg-white pt-18 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="flex justify-center px-4 py-16">
        <div className="w-full max-w-[550px]">
          <AuthHeader />

          <div className="flex flex-col px-8 md:px-0 w-full mb-6 md:mb-14 justify-self-center justify-center items-center self-center">
            {/* ✅ 카카오로 시작하기 -> 카카오 로그인 플로우 진입 */}
            <button onClick={handleKakaoSignUp}>
              <Image
                src="/icons/kakao-join-bt.png"
                alt="카카오로 시작하기"
                className="cursor-pointer w-full max-w-[350px] mb-4 mx-auto"
                width={600}
                height={200}
              />
            </button>

            {/* ✅ 네이버로 시작하기 (아직 준비중) */}
            <button onClick={() => setShowSocialModal(true)}>
              <Image
                src="/icons/naver-join-bt.png"
                alt="네이버로 시작하기"
                className="cursor-pointer w-full max-w-[350px] mb-4 mx-auto"
                width={600}
                height={200}
              />
            </button>

            {/* ✅ Google로 시작하기 (아직 준비중) */}
            <button onClick={() => setShowSocialModal(true)}>
              <Image
                src="/icons/google-join-bt.png"
                alt="Google로 시작하기"
                className="cursor-pointer w-full max-w-[350px] mb-4 mx-auto"
                width={600}
                height={200}
              />
            </button>

            {/* ✅ 이메일로 시작하기 (실제 라우팅) */}
            <button onClick={() => router.push("/signUp/email")}>
              <Image
                src="/icons/email-join-bt.png"
                alt="이메일로 시작하기"
                className="cursor-pointer w-full max-w-[350px] mb-4 mx-auto"
                width={600}
                height={200}
              />
            </button>
          </div>

          <div className="w-full h-[1px] bg-[#9f9f9f] mb-4" />

          <div className="flex justify-center items-center gap-2">
            <span className="text-[14px]">이미 회원이신가요?</span>
            <button
              onClick={() => router.push("/login")}
              className="text-[14px] font-bold underline"
            >
              로그인
            </button>
          </div>
        </div>
      </main>

      {/* ✅ SNS 회원가입 준비중 모달 (네이버/구글용) */}
      <ConfirmModal
        isOpen={showSocialModal}
        onClose={() => setShowSocialModal(false)}
      >
        <p>SNS 회원가입 기능은 준비중입니다.</p>
      </ConfirmModal>
    </div>
  );
};

export default SignUpPage;
