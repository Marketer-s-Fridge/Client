"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
// import WithdrawConfirmModal from "@/components/withdrawConfirmModal"; // ✅ 경로에 맞게 수정
import DeleteAccountModal from "@/app/myPage/account/deleteAccountModal";

export default function AccountSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isMyInfo = pathname === "/myPage/account/myInfo";
  const isMyPwd = pathname === "/myPage/account/myPwd";

  // const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const handleWithdrawConfirm = () => {
    // 여기에 탈퇴 처리 로직 추가
    console.log("탈퇴 처리 진행");
    setIsModalOpen(false);
    // 예: router.push("/goodbye");
  };

  return (
    <aside className="bg-gray-100 flex flex-col items-center py-10 px-4 text-center w-full md:w-[280px] h-auto md:h-screen">
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
      <p
        className="mb-10 md:mt-auto text-xs text-gray-400 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        계정 탈퇴
      </p>

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
