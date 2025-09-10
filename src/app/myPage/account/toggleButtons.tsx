"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ToggleButtons() {
  const router = useRouter();
  const pathname = usePathname();

  const [active, setActive] = useState<"회원정보" | "비밀번호">("회원정보");

  // ✅ 현재 경로에 따라 초기 상태 설정
  useEffect(() => {
    if (pathname === "/myPage/account/myPwd") {
      setActive("비밀번호");
    } else {
      setActive("회원정보");
    }
  }, [pathname]);

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
    </div>
  );
}
