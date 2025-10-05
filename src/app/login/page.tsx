"use client";

import Header from "@/components/header";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthHeader, SubmitButton } from "@/components/authFormComponents";
import Image from "next/image";
import ConfirmModal from "@/components/confirmModal";
import MobileMenu from "@/components/mobileMenu";
import { SigninRequestDto } from "@/features/auth/types";
import { useSignin } from "@/features/auth/hooks/useSignin"; // ✅ 훅 import

const LoginPage: React.FC = () => {
  const [input1, onChangeInput1] = useState(""); // 아이디
  const [input2, onChangeInput2] = useState(""); // 비밀번호
  const [menuOpen, setMenuOpen] = useState(false);
  const [rememberId, setRememberId] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();

  // ✅ React Query 훅 사용
  const { mutate: signinMutate, isPending } = useSignin();

  // ✅ 로그인 처리 함수
  const handleLogin = () => {
    if (!input1.trim() || !input2.trim()) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    const dto: SigninRequestDto = { id: input1, pw: input2 };

    signinMutate(dto, {
      onSuccess: (userData) => {
        console.log("로그인 성공:", userData);

        // ✅ 로그인 성공 시 유저 정보 저장
        localStorage.setItem("user", JSON.stringify(userData));

        if (autoLogin) {
          localStorage.setItem("autoLogin", "true");
        }

        setShowConfirm(true);
      },
      onError: (error) => {
        console.error("로그인 실패:", error);
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      },
    });
  };

  // ✅ 모달 닫기 후 이동
  const handleCloseModal = () => {
    setShowConfirm(false);
    router.push("/"); // 로그인 후 홈으로 이동
  };

  return (
    <div className="bg-white pt-18 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="flex justify-center bg-white py-16 px-4">
        <div className="w-full max-w-[480px] flex flex-col items-center">
          <AuthHeader
            title="로그인"
            description={`마케터의 냉장고에 오신 걸 환영합니다!
필요한 마케팅 콘텐츠를 골라보는 냉장고, 지금 로그인하세요!`}
          />

          {/* 아이디/비밀번호 입력 */}
          <div className="w-9/11 flex flex-col items-center gap-y-4 mb-3">
            <input
              placeholder="아이디"
              value={input1}
              onChange={(e) => onChangeInput1(e.target.value)}
              className="w-full border border-[#ccc] rounded px-4 py-3 text-[16px]"
            />
            <div className="w-full relative">
              <input
                placeholder="비밀번호"
                type={showPassword ? "text" : "password"}
                value={input2}
                onChange={(e) => onChangeInput2(e.target.value)}
                className="w-full border border-[#ccc] rounded px-4 py-3 text-[16px] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer opacity-30"
              >
                <Image
                  src={
                    showPassword
                      ? "/icons/eye-open.png"
                      : "/icons/eye-closed.png"
                  }
                  alt="비밀번호 보기 토글"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>

          {/* 체크박스 */}
          <div className="w-9/11 flex justify-baseline text-xs text-[#666] mb-6 px-1 gap-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberId}
                onChange={(e) => setRememberId(e.target.checked)}
                className="hidden"
              />
              <div className="w-5 h-5 relative">
                <Image
                  src={
                    rememberId
                      ? "/icons/checked-bt.png"
                      : "/icons/unchecked-bt.png"
                  }
                  alt="아이디 저장 체크박스"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-sm text-[#666]">아이디 저장</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
                className="hidden"
              />
              <div className="w-5 h-5 relative">
                <Image
                  src={
                    autoLogin
                      ? "/icons/checked-bt.png"
                      : "/icons/unchecked-bt.png"
                  }
                  alt="로그인 상태 유지 체크박스"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-sm text-[#666]">로그인 상태 유지</span>
            </label>
          </div>

          {/* 로그인 버튼 */}
          <SubmitButton
            text={isPending ? "로그인 중..." : "로그인"}
            onClick={handleLogin}
          />

          {/* 회원가입/찾기 버튼 */}
          <div className="flex justify-center gap-4 text-[11px] text-[#757575] mb-10 mt-3">
            <button
              className="cursor-pointer"
              onClick={() => router.push("/signUp")}
            >
              회원가입
            </button>
            <span>|</span>
            <button
              className="cursor-pointer"
              onClick={() => router.push("/login/findId")}
            >
              아이디 찾기
            </button>
            <span>|</span>
            <button
              className="cursor-pointer"
              onClick={() => router.push("/login/findPwd")}
            >
              비밀번호 찾기
            </button>
          </div>

          {/* 소셜 로그인 */}
          <div className="flex items-center w-full mb-8">
            <div className="flex-1 h-[1px] bg-[#ccc]"></div>
            <span className="mx-4 text-[#757575] text-xs">또는</span>
            <div className="flex-1 h-[1px] bg-[#ccc]"></div>
          </div>

          <div className="w-full flex flex-col items-center gap-y-3 mb-10">
            <button onClick={() => alert("카카오 로그인")}>
              <Image
                src="/icons/kakao-login-bt.png"
                alt="카카오 로그인"
                className="w-full max-w-[300px]"
                width={500}
                height={100}
              />
            </button>
            <button onClick={() => alert("네이버 로그인")}>
              <Image
                src="/icons/naver-login-bt.png"
                alt="네이버 로그인"
                className="w-full max-w-[300px]"
                width={500}
                height={100}
              />
            </button>
            <button onClick={() => alert("Google 로그인")}>
              <Image
                src="/icons/google-login-bt.png"
                alt="Google 로그인"
                className="w-full max-w-[300px]"
                width={500}
                height={100}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 로그인 성공 모달 */}
      <ConfirmModal isOpen={showConfirm} onClose={handleCloseModal}>
        <p>마케터의 냉장고에 오신 걸 환영합니다!</p>
      </ConfirmModal>
    </div>
  );
};

export default LoginPage;
