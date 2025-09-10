"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import DeleteAccountModal from "@/app/myPage/account/deleteAccountModal";

export default function AccountSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isMyInfo = pathname === "/myPage/account/myInfo";
  const isMyPwd = pathname === "/myPage/account/myPwd";

  return (
    <aside className="bg-gray-100 flex flex-col items-center py-5 md:py-10 px-2 md:px-4 text-center w-full md:w-[280px] h-auto md:h-screen">
      {/* 프로필 이미지 */}
      <Image
        src="/images/profile-lovely.png"
        alt="프로필"
        className="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover"
        width={200}
        height={200}
      />

      {/* 사용자 정보 */}
      <h2 className="mt-4 text-xl md:text-2xl font-bold">마케터</h2>
      <p className="text-sm text-gray-500">a123456789@gmail.com</p>

      {/* 메뉴 버튼 */}
      <div className="hidden md:flex flex-col items-center gap-10 md:mt-14 text-sm w-full">
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
      <p
        className="mb-10 md:mt-auto text-xs text-gray-400 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        계정 탈퇴
      </p>
      <section className="flex md:hidden w-full justify-between items-center px-4">
  {/* 왼쪽 버튼 그룹 */}
  <div className="flex gap-5">
    <button
      onClick={() => router.push("/myPage/account/myInfo")}
      className={`${pathname === "/myPage/account/myInfo" ? "font-bold underline" : ""}`}
    >
      계정 관리
    </button>
    <button
      onClick={() => router.push("/myPage/myContact")}
      className={`${pathname === "/myPage/myContact" ? "font-bold underline" : ""}`}
    >
      내 문의 내역
    </button>
  </div>

  {/* 오른쪽 콘텐츠 소비 리포트 버튼 (원하는 페이지 있으면 경로 연결 가능) */}
  <button
    onClick={() => {
      // 예: 콘텐츠 소비 리포트 페이지 연결 시
      // router.push("/myPage/contentReport");
    }}
  >
    콘텐츠 소비 리포트
  </button>
</section>

      {/* 탈퇴 확인 모달 */}

      <DeleteAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email="a123456789@gmail.com"
        onConfirm={() => {
          console.log("탈퇴 처리됨");
          // 실제 탈퇴 API 호출 가능
        }}
      />
    </aside>
  );
}
