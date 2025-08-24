"use client";

import Header from "@/components/header";
import React, { useState } from "react";
import { TextInput } from "@/components/authFormComponents";
import AccountSidebar from "@/components/accountSideBar";
import Banner from "@/components/banner";
import Image from "next/image";
import ConfirmModal from "@/components/confirmModal";
import MobileMenu from "@/components/mobileMenu";
import ToggleButtons from "../toggleButtons";

export default function AccountPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="flex flex-1 flex-col bg-white min-h-screen pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Banner title="계정 관리" />

      <main className="w-full max-w-[1024px] grid grid-cols-1 md:grid-cols-[280px_1fr] justify-self-center self-center">
        <AccountSidebar />
        <ToggleButtons></ToggleButtons>

        <section className="place-items-center md:place-items-start  flex flex-1 flex-col w-full px-6 md:px-15 pt-6 md:pt-17.5 pb-25">
          <h3 className="hidden md:block text-[20px] sm:text-[22px] font-bold mb-10">
            회원정보 수정
          </h3>

          <div className="w-full flex flex-1 flex-col gap-5 max-w-[400px]">
            <div className="flex flex-col gap-2 text-sm ">
              {/* 계정 (readonly) */}
              <TextInput
                label="계정"
                type="email"
                value="a123456789@gmail.com"
                onChange={() => {}}
                rounded="rounded-lg"
                borderColor="border-gray-300"
                textColor="text-gray-500"
              />

              {/* 간편 로그인 */}
              <div className="flex flex-1   items-center flex-row justify-center sm:justify-start gap-4  mt-1 pl-2 sm:pl-[250px]">
                {[
                  {
                    name: "카카오",
                    src: "/icons/kakao-round.png",
                    status: "연결완료",
                  },
                  {
                    name: "네이버",
                    src: "/icons/naver-gray-round.png",
                    status: "연결하기",
                  },
                  {
                    name: "구글",
                    src: "/icons/google-gray-round.png",
                    status: "연결하기",
                  },
                ].map((sns) => (
                  <div
                    key={sns.name}
                    className="flex flex-col items-center gap-1"
                  >
                    <Image
                      src={sns.src}
                      alt={sns.name}
                      className="w-12 h-12 md:w-8 md:h-8 cursor-pointer"
                      width={50}
                      height={50}
                    />
                    <span className="text-[10px] text-gray-700">
                      {sns.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <TextInput
              label="이름"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              rounded="rounded-lg"
              borderColor="border-gray-300"
            />

            <TextInput
              label="닉네임"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              rounded="rounded-lg"
              borderColor="border-gray-300"
            />

            <TextInput
              label="휴대폰"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
        회원정보가 변경되었습니다.
      </ConfirmModal>
    </div>
  );
}
