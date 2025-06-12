"use client";

import Header from "@/components/header";
import React, { useState } from "react";
import { TextInput } from "@/components/authFormComponents";
import AccountSidebar from "@/components/accountSideBar";
import Banner from "@/components/banner";
import Image from "next/image";
import ConfirmModal from "@/components/confirmModal";

export default function AccountPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <Banner title="계정 관리" />

      <main className="max-w-[1024px] mx-auto h-full grid grid-cols-1 md:grid-cols-[280px_1fr]">
        <AccountSidebar />

        <section className="relative pt-14 h-lvh">
          <h3 className="text-[22px] font-bold mb-13 ml-15">회원정보 수정</h3>

          <div className="flex flex-col w-[75%] relative gap-5">
            <div className="flex flex-col gap-2 text-sm">
              {/* 계정 (readonly) */}
              <TextInput
                label="계정"
                type="email"
                value="a123456789@gmail.com"
                onChange={() => {}}
                rounded="rounded-lg"
                borderColor="border-gray-300"
              />

              {/* 간편 로그인 */}
              <div className="flex gap-8 ml-45 mt-1">
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
                      className="w-8 h-8 cursor-pointer"
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
              placeholder="홍길동"
              rounded="rounded-lg"
              borderColor="border-gray-300"
            />

            <TextInput
              label="닉네임"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="마케터"
              rounded="rounded-lg"
              borderColor="border-gray-300"
            />

            <TextInput
              label="휴대폰"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              rounded="rounded-lg"
              borderColor="border-gray-300"
            />
          </div>

          <div className="absolute right-15 bottom-20">
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
        회원정보가 변경되었습니다.
      </ConfirmModal>
    </div>
  );
}
