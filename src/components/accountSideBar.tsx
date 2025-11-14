"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import DeleteAccountModal from "@/app/myPage/account/deleteAccountModal";
import { useAuthStatus } from "@/features/auth/hooks/useAuthStatus";

export default function AccountSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ 로그인 사용자 정보 가져오기
  const { user, isAuthenticated, isLoading } = useAuthStatus();

  const isMyInfo = pathname === "/myPage/account/myInfo";
  const isMyPwd = pathname === "/myPage/account/myPwd";

  // ✅ 로딩 상태
  if (isLoading) {
    return (
      <aside className="bg-gray-100 flex items-center justify-center w-full h-screen text-sm text-gray-500">
        로딩 중...
      </aside>
    );
  }

  // ✅ 비로그인 상태
  if (!isAuthenticated) {
    return (
      <aside className="bg-gray-100 flex items-center justify-center w-full h-screen text-sm text-gray-500">
        로그인 후 이용 가능합니다.
      </aside>
    );
  }

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

      {/* ✅ 사용자 정보 */}
      <h2 className="mt-4 text-xl md:text-2xl font-bold">
        {user?.name ?? "사용자"}
      </h2>
      <p className="text-sm text-gray-500">{user?.email ?? "-"}</p>

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

      {/* ✅ 모바일 하단 메뉴 */}
      <section className="flex md:hidden w-full justify-between items-center px-4">
        {/* 왼쪽 버튼 그룹 */}
        <div className="flex gap-5">
          <button
            onClick={() => router.push("/myPage/account/myInfo")}
            className={`${
              pathname === "/myPage/account/myInfo" ? "font-bold underline" : ""
            }`}
          >
            계정 관리
          </button>
          <button
            onClick={() => router.push("/myPage/myContact")}
            className={`${
              pathname === "/myPage/myContact" ? "font-bold underline" : ""
            }`}
          >
            내 문의 내역
          </button>
        </div>
      </section>

      {/* ✅ 탈퇴 확인 모달 */}
      <DeleteAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={user?.email ?? ""}
        onConfirm={() => {
          console.log("탈퇴 처리됨");
          // 실제 탈퇴 API 호출 가능
        }}
      />
    </aside>
  );
}
