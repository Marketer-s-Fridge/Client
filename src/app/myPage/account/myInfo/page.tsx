"use client";

import Header from "@/components/header";
import React from "react";
import { useRouter } from "next/navigation";
import AccountSidebar from "@/components/accountSideBar";
import Banner from "@/components/banner";

export default function AccountPage() {
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* 상단 배너 */}
      <Banner title="계정관리" />

      {/* 본문 영역 */}
      <main className="max-w-[1024px] mx-auto h-full grid grid-cols-1 md:grid-cols-[280px_1fr]">
        {/* 왼쪽 프로필 영역 */}
        <AccountSidebar />

        {/* 오른쪽 정보 수정 영역 */}
        <section className="relative pt-14 px-6 md:px-20 pb-20">
          <h3 className="text-xl font-bold mb-8">회원정보 수정</h3>
          <div className="flex flex-col gap-6 text-sm">
            {/* 계정 */}
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="md:w-28 text-gray-700 font-semibold">
                계정
              </label>
              <input
                type="email"
                value="a123456789@gmail.com"
                disabled
                className="w-full md:w-2/3 border border-gray-300 rounded-lg px-2 py-1 bg-gray-100"
              />
            </div>

            {/* 간편 로그인 */}
            <div className="md:ml-32 flex items-center  gap-10">
              {/* 카카오 */}
              <div className="flex flex-col items-center gap-1">
                <img
                  src="/icons/kakao-round.png"
                  alt="카카오"
                  className="w-9 h-9"
                />
                <span className="text-[10px] text-gray-700">연결완료</span>
              </div>
              {/* 네이버 */}
              <div className="flex flex-col items-center gap-1">
                <img
                  src="/icons/naver-round.png"
                  alt="네이버"
                  className="w-9 h-9"
                />
                <span className="text-[10px] text-gray-700">연결하기</span>
              </div>
              {/* 구글 */}
              <div className="flex flex-col items-center gap-1">
                <img
                  src="/icons/google-round.png"
                  alt="구글"
                  className="w-9 h-9"
                />
                <span className="text-[10px] text-gray-700">연결하기</span>
              </div>
            </div>

            {/* 이름 */}
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="md:w-28 text-gray-700 font-semibold">
                이름
              </label>
              <input
                type="text"
                placeholder="홍길동"
                className="w-full md:w-2/3 border border-gray-300 rounded-lg px-2 py-1"
              />
            </div>

            {/* 닉네임 */}
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="md:w-28 text-gray-700 font-semibold">
                닉네임
              </label>
              <input
                type="text"
                placeholder="마케터"
                className="w-full md:w-2/3 border border-gray-300 rounded-lg px-2 py-1"
              />
            </div>

            {/* 휴대폰 */}
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="md:w-28 text-gray-700 font-semibold">
                휴대폰
              </label>
              <input
                type="text"
                placeholder="010-1234-5678"
                className="w-full md:w-2/3 border border-gray-300 rounded-lg px-2 py-1"
              />
            </div>
          </div>

          <div className="absolute right-10 bottom-20 flex justify-end">
            <button className="bg-red-500 text-white rounded-full px-6 py-1 text-sm font-semibold hover:bg-red-600">
              변경 완료
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
