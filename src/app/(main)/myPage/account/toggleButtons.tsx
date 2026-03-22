"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStatus } from "@/features/auth/hooks/useAuthStatus";

export default function ToggleButtons() {
  const router = useRouter();
  const pathname = usePathname();

  const [active, setActive] = useState<"회원정보" | "비밀번호">("회원정보");

  // ✅ 로그인 사용자 정보 가져오기
  const { user } = useAuthStatus();

  // ✅ 카카오 로그인 여부 판단
  const isKakaoUser = user?.id?.startsWith("kakao_") ?? false;

  // ✅ 현재 경로에 따라 초기 상태 설정
  useEffect(() => {
    if (!isKakaoUser && pathname === "/myPage/account/myPwd") {
      setActive("비밀번호");
    } else {
      setActive("회원정보");
    }
  }, [pathname, isKakaoUser]);

  const handleClick = (type: "회원정보" | "비밀번호") => {
    setActive(type);
    router.push(
      type === "회원정보"
        ? "/myPage/account/myInfo"
        : "/myPage/account/myPwd"
    );
  };

  return (
    <div className="mx-5 my-5 flex gap-3 md:hidden">
      {/* 🔴 회원정보 버튼 */}
      <button
        onClick={() => handleClick("회원정보")}
        className={`px-4 py-1.5 rounded-full border text-sm font-semibold transition
          ${
            active === "회원정보"
              ? "bg-[#FF4D4F] text-white border-[#FF4D4F]"
              : "bg-transparent text-black border-black"
          }`}
      >
        회원정보 수정
      </button>

      {/* 🔴 카카오 유저가 아니면 비밀번호 변경 버튼 보이기 */}
      {!isKakaoUser && (
        <button
          onClick={() => handleClick("비밀번호")}
          className={`px-4 py-1.5 rounded-full border text-sm font-semibold transition
            ${
              active === "비밀번호"
                ? "bg-[#FF4D4F] text-white border-[#FF4D4F]"
                : "bg-transparent text-black border-black"
            }`}
        >
          비밀번호 변경
        </button>
      )}
    </div>
  );
}
