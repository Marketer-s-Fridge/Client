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

  const { user, isAuthenticated, isLoading } = useAuthStatus();

  const isMyInfo = pathname === "/myPage/account/myInfo";
  const isMyPwd = pathname === "/myPage/account/myPwd";

  // ✅ 카카오 로그인 여부 (필드명은 백엔드 응답에 맞춰 조정)
  const isKakaoUser = user?.id?.startsWith("kakao_");

  if (isLoading) {
    return (
      <aside className="bg-gray-100 flex items-center justify-center w-full h-screen text-sm text-gray-500">
        로딩 중...
      </aside>
    );
  }

  if (!isAuthenticated) {
    return (
      <aside className="bg-gray-100 flex items-center justify-center w-full h-screen text-sm text-gray-500">
        로그인 후 이용 가능합니다.
      </aside>
    );
  }

  const profileImageSrc =
    user?.profileImageUrl && user.profileImageUrl.trim() !== ""
      ? user.profileImageUrl
      : "/images/profile-character.png";

  return (
    <aside className="bg-gray-100 flex flex-col items-center py-5 md:py-10 px-2 md:px-4 text-center w-full md:w-[280px] h-auto md:h-screen">
      {/* 프로필 이미지 */}
      <Image
        src={profileImageSrc}
        alt="프로필"
        className="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover"
        width={200}
        height={200}
      />

      {/* 사용자 정보 */}
      <h2 className="mt-4 text-xl md:text-2xl font-bold">
        {user?.nickname ?? "사용자"}
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

        {/* ✅ 카카오 로그인 유저에게는 비밀번호 변경 메뉴 숨김 */}
        {!isKakaoUser && (
          <button
            className={`cursor-pointer py-1 ${
              isMyPwd ? "font-bold underline" : "text-gray-600"
            }`}
            onClick={() => router.push("/myPage/account/myPwd")}
          >
            비밀번호 변경
          </button>
        )}
      </div>

      {/* 탈퇴 */}
      <p
        className="mb-10 md:mt-auto text-xs text-gray-400 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        계정 탈퇴
      </p>

      <DeleteAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={user?.email ?? ""}
        onConfirm={() => {
          console.log("탈퇴 처리됨");
        }}
      />
    </aside>
  );
}
