"use client";

import Header from "@/components/header";
import React, { useState } from "react";
import AccountSidebar from "@/components/accountSideBar";
import Banner from "@/components/banner";
import ConfirmModal from "@/components/confirmModal";
import { TextInput } from "@/components/authFormComponents";
import MobileMenu from "@/components/mobileMenu";
import ToggleButtons from "../toggleButtons";

export default function PasswordChangePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-white min-h-screen pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Banner title="계정 관리" />

      <main className="w-full max-w-[1024px] grid grid-cols-1 md:grid-cols-[280px_1fr] justify-self-center self-center">
        <AccountSidebar />
        <ToggleButtons></ToggleButtons>

        <section className="h-full place-items-center md:place-items-start  flex flex-1 flex-col w-full px-6 md:px-15 pt-6 md:pt-17.5 pb-25">
          <h3 className="hidden md:block text-[20px] sm:text-[22px] font-bold mb-10">
            비밀번호 변경
          </h3>

          <div className="w-full flex flex-col gap-5 max-w-[400px]">
            <TextInput
              label="새 비밀번호"
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              rounded="rounded-lg"
              borderColor="border-gray-300"
              required
              error="비밀번호는 영문, 숫자, 특수문자를 모두 포함한 8~20자리로 입력해주세요."
            />

            <TextInput
              label="새 비밀번호 확인"
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              required
              rounded="rounded-lg"
              borderColor="border-gray-300"
            />
          </div>

          <div className="flex flex-1 items-end self-end mt-25 md:mt-8 w-full sm:w-auto">
            <button
              onClick={() => setModalOpen(true)}
              className="cursor-pointer w-full sm:w-auto bg-red-500 text-white rounded-lg sm:rounded-full px-4 py-3 sm:py-1.5 text-[15px] sm:text-[11px] font-semibold hover:bg-red-600"
            >
              변경 완료
            </button>
          </div>
        </section>
      </main>

      <ConfirmModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <p>비밀번호가 변경되었습니다.</p>
      </ConfirmModal>
    </div>
  );
}
