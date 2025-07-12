"use client";

import Header from "@/components/header";
import React from "react";
import AccountSidebar from "@/components/accountSideBar";
import Banner from "@/components/banner";
import { useState } from "react";
import ConfirmModal from "@/components/confirmModal";
import { TextInput } from "@/components/authFormComponents"; // 상단에 추가
import MobileMenu from "@/components/mobileMenu";

export default function PasswordChangePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Banner title="계정 관리" />

      <main className="max-w-[1024px] mx-auto h-full grid grid-cols-1 md:grid-cols-[280px_1fr]">
        <AccountSidebar />

        <section className="relative pt-14  h-lvh">
          <h3 className="text-[22px] font-bold mb-13 ml-15">비밀번호 변경</h3>

          <div className="flex w-[75%] flex-col gap-5 text-sm">
            <div>
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
            </div>

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

          <div className="absolute right-15 bottom-20 flex justify-end">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-red-500 text-white rounded-full px-5 py-1.5 text-[12px] cursor-pointer font-semibold hover:bg-red-600"
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
