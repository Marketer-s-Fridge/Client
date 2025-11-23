// pages/login/page.tsx
"use client";

import clsx from "clsx";
import Header from "@/components/header";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthHeader, SubmitButton } from "@/components/authFormComponents";
import Image from "next/image";
import ConfirmModal from "@/components/confirmModal";
import MobileMenu from "@/components/mobileMenu";
import { SigninRequestDto } from "@/features/auth/types";
import { useSignin } from "@/features/auth/hooks/useSignin";
import api from "@/lib/apiClient"; // 서버에 /auth/signout 있으면 사용

const LoginPage: React.FC = () => {
  const [input1, onChangeInput1] = useState(""); // 아이디
  const [input2, onChangeInput2] = useState(""); // 비밀번호
  const [menuOpen, setMenuOpen] = useState(false);
  const [rememberId, setRememberId] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // 로그인 성공 모달
  const [showSocialModal, setShowSocialModal] = useState(false); // SNS 준비중 모달

  // ✅ 초기에는 false로 두고, 클라이언트에서 storage 기준으로 계산
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const { mutate: signinMutate, isPending } = useSignin();

  // ✅ 초기 로드: 아이디 저장 + autoLogin + 로그인 여부 계산 + storage 이벤트 리스너
  useEffect(() => {
    // 1) 아이디 저장 불러오기
    const savedId = localStorage.getItem("rememberIdValue");
    const remember = localStorage.getItem("rememberId") === "true";
    if (remember && savedId) {
      onChangeInput1(savedId);
      setRememberId(true);
    }

    // 2) 로그인 상태 유지 값 불러오기
    const savedAutoLogin = localStorage.getItem("autoLogin") === "true";
    if (savedAutoLogin) {
      setAutoLogin(true);
    }

    // 3) 로그인 여부 계산 함수 (accessToken 기준)
    const computeLoggedIn = () => {
      const token =
        localStorage.getItem("accessToken") ??
        sessionStorage.getItem("accessToken");

      if (
        !token ||
        token === "null" ||
        token === "undefined" ||
        token === "false"
      ) {
        return false;
      }
      return true;
    };

    const loggedIn = computeLoggedIn();
    setIsLoggedIn(loggedIn);

    // ❌ 여기 있던 autoLogin + router.replace("/") 는 제거
    // if (loggedIn && savedAutoLogin) {
    //   router.replace("/");
    // }

    // 4) 다른 탭에서 로그인/로그아웃 반영
    const onStorage = () => {
      const nextLoggedIn = computeLoggedIn();
      setIsLoggedIn(nextLoggedIn);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [router]);

  const handleLogin = () => {
    if (!input1.trim() || !input2.trim()) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    const dto: SigninRequestDto = { id: input1.trim(), pw: input2 };

    signinMutate(dto, {
      onSuccess: (userData) => {
        // 프로젝트 정책에 맞게 유저 정보 저장
        localStorage.setItem("user", JSON.stringify(userData));

        // ⭐ accessToken 위치 정리
        //   - useSignin 안에서 accessToken을 localStorage에 저장한다고 가정
        const tokenFromLocal = localStorage.getItem("accessToken");
        if (tokenFromLocal) {
          if (autoLogin) {
            // 로그인 상태 유지 O → localStorage 유지 (추가 작업 X)
          } else {
            // 로그인 상태 유지 X → sessionStorage로 옮기고 localStorage에서는 제거
            sessionStorage.setItem("accessToken", tokenFromLocal);
            localStorage.removeItem("accessToken");
          }
        }

        // ⭐ 로그인 상태 유지 설정
        if (autoLogin) {
          localStorage.setItem("autoLogin", "true");
        } else {
          localStorage.removeItem("autoLogin");
        }

        // ⭐ 아이디 저장 설정
        if (rememberId) {
          localStorage.setItem("rememberId", "true");
          localStorage.setItem("rememberIdValue", input1.trim());
        } else {
          localStorage.removeItem("rememberId");
          localStorage.removeItem("rememberIdValue");
        }

        // 로그인 상태 갱신
        setIsLoggedIn(true);

        // 어드민 분기
        const idLower = input1.trim().toLowerCase();
        if (idLower === "mf-admin") {
          router.replace("/admin");
          return;
        }

        // 기본 흐름: 모달 → 확인 시 홈으로
        setShowConfirm(true);
      },
      onError: () => {
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      },
    });
  };

  const handleLogout = async () => {
    // ⭐ 로그아웃 전에 rememberId 관련 값 백업
    const remember = localStorage.getItem("rememberId") === "true";
    const savedId = localStorage.getItem("rememberIdValue") || "";

    try {
      await api.post("/auth/signout");
    } catch {
    } finally {
      // localStorage + sessionStorage 모두 초기화
      localStorage.clear();
      sessionStorage.clear();

      // ⭐ 아이디 저장 옵션은 유지
      if (remember && savedId) {
        localStorage.setItem("rememberId", "true");
        localStorage.setItem("rememberIdValue", savedId);
      }

      // autoLogin은 무조건 해제
      localStorage.removeItem("autoLogin");

      setIsLoggedIn(false);
      router.replace("/");
    }
  };

  const handleCloseModal = () => {
    setShowConfirm(false);
    router.replace("/"); // 기본 리다이렉트
  };

  return (
    <div className="bg-white pt-18 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="flex justify-center bg-white py-16 px-4">
        <div className="w-full max-w-[480px] flex flex-col items-center">
          <AuthHeader
            title={isLoggedIn ? "로그아웃" : "로그인"}
            description={
              isLoggedIn
                ? "현재 로그인 상태입니다. 원하면 로그아웃할 수 있어요."
                : `마케터의 냉장고에 오신 걸 환영합니다!
필요한 마케팅 콘텐츠를 골라보는 냉장고, 지금 로그인하세요!`
            }
          />

          {isLoggedIn ? (
            // ✅ 로그인 상태라면 로그아웃 UI 노출
            <div className="w-9/11 flex flex-col items-center gap-4 mt-4">
              <SubmitButton text="로그아웃" onClick={handleLogout} />
              <button
                className="text-sm text-[#757575] underline"
                onClick={() => router.replace("/")}
              >
                홈으로 이동
              </button>
            </div>
          ) : (
            <>
              {/* 아이디/비밀번호 입력 */}
              <div className="w-9/11 flex flex-col items-center gap-y-4 mb-3">
                <input
                  placeholder="아이디"
                  value={input1}
                  onChange={(e) => onChangeInput1(e.target.value)}
                  className="w-full border border-[#ccc] rounded px-4 py-3 text-[16px]"
                  autoComplete="username"
                />
                <div className="w-full relative">
                  <input
                    placeholder="비밀번호"
                    type={showPassword ? "text" : "password"}
                    value={input2}
                    onChange={(e) => onChangeInput2(e.target.value)}
                    className="w-full border border-[#ccc] rounded px-4 py-3 text-[16px] pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer opacity-30"
                    aria-label="비밀번호 보기"
                  >
                    <Image
                      src={
                        showPassword
                          ? "/icons/eye-open.png"
                          : "/icons/eye-closed.png"
                      }
                      alt=""
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
                  <div
                    className={clsx(
                      "w-5 h-5 relative ",
                      rememberId ? "scale-110" : "scale-90"
                    )}
                  >
                    <Image
                      src={
                        rememberId
                          ? "/icons/checked-bt.png"
                          : "/icons/unchecked-bt.png"
                      }
                      alt=""
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
                  <div
                    className={clsx(
                      "w-5 h-5 relative ",
                      autoLogin ? "scale-110" : "scale-90"
                    )}
                  >
                    <Image
                      src={
                        autoLogin
                          ? "/icons/checked-bt.png"
                          : "/icons/unchecked-bt.png"
                      }
                      alt=""
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

              {/* 회원가입/찾기 */}
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

              {/* 소셜 로그인 더미 */}
              <div className="flex items-center w-full mb-8">
                <div className="flex-1 h-[1px] bg-[#ccc]" />
                <span className="mx-4 text-[#757575] text-xs">또는</span>
                <div className="flex-1 h-[1px] bg-[#ccc]" />
              </div>

              <div className="w-full flex flex-col items-center gap-y-3 mb-10">
                <button
                  className="cursor-pointer"
                  onClick={() => setShowSocialModal(true)}
                >
                  <Image
                    src="/icons/kakao-login-bt.png"
                    alt=""
                    className="w-full max-w-[300px]"
                    width={500}
                    height={100}
                  />
                </button>
                <button
                  className="cursor-pointer"
                  onClick={() => setShowSocialModal(true)}
                >
                  <Image
                    src="/icons/naver-login-bt.png"
                    alt=""
                    className="w-full max-w-[300px]"
                    width={500}
                    height={100}
                  />
                </button>
                <button
                  className="cursor-pointer"
                  onClick={() => setShowSocialModal(true)}
                >
                  <Image
                    src="/icons/google-login-bt.png"
                    alt=""
                    className="w-full max-w-[300px]"
                    width={500}
                    height={100}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 로그인 성공 모달 */}
      <ConfirmModal isOpen={showConfirm} onClose={handleCloseModal}>
        <p>마케터의 냉장고에 오신 걸 환영합니다!</p>
      </ConfirmModal>

      {/* SNS 로그인 준비중 모달 */}
      <ConfirmModal
        isOpen={showSocialModal}
        onClose={() => setShowSocialModal(false)}
      >
        <p>SNS 로그인 기능은 준비중입니다.</p>
      </ConfirmModal>
    </div>
  );
};

export default LoginPage;
