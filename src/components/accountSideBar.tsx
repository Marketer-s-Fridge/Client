"use client";

import { useRouter, usePathname } from "next/navigation";
import React from "react";

export default function AccountSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isMyInfo = pathname === "/myPage/account/myInfo";
  const isMyPwd = pathname === "/myPage/account/myPwd";

  return (
    <aside className="bg-gray-100 flex flex-col items-center py-10 px-4 text-center w-full md:w-[280px] h-auto md:h-screen">
      {/* 프로필 이미지 */}
      <img
        src="/images/profile-character.png"
        alt="프로필"
        className="w-24 h-24 md:w-36 md:h-36 rounded-full object-cover"
      />

      {/* 사용자 정보 */}
      <h2 className="mt-4 text-xl md:text-2xl font-bold">마케터</h2>
      <p className="text-sm text-gray-500">a123456789@gmail.com</p>

      {/* 메뉴 버튼 */}
      <div className="flex flex-col items-center gap-10 md:mt-14 text-sm w-full">
        <button
          className={`cursor-pointer py-1 ${
            isMyInfo ? "font-bold underline" : "text-gray-600"
          }`}
          onClick={() => router.push("/myPage/account/myInfo")}
        >
          회원정보 수정
        </button>
        <button
          className={`cursor-pointer py-1 ${
            isMyPwd ? "font-bold underline" : "text-gray-600"
          }`}
          onClick={() => router.push("/myPage/account/myPwd")}
        >
          비밀번호 변경
        </button>
      </div>

      {/* 탈퇴 */}
      <p className="mb-10 md:mt-auto text-xs text-gray-400">계정 탈퇴</p>
    </aside>
  );
}
