"use client";

import Header from "@/components/header";
import React from "react";
import AccountSidebar from "@/components/accountSideBar";
import Banner from "@/components/banner";

export default function PasswordChangePage() {
  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* 상단 배너 */}
      <Banner title="계정 관리" />

      {/* 본문 영역 */}
      <main className="max-w-[1024px] mx-auto h-full grid grid-cols-1 md:grid-cols-[280px_1fr]">
        {/* 왼쪽 프로필 영역 */}
        <AccountSidebar />

        {/* 오른쪽 비밀번호 변경 영역 */}
        <section className="relative pt-14 px-20 h-lvh">
          <h3 className="text-xl font-bold mb-10">비밀번호 변경</h3>

          <div className="flex flex-col gap-6 text-sm w-full max-w-[600px]">
            {/* 기존 비밀번호 */}
            <div className="flex items-center">
              <label className="w-32 text-gray-700 font-semibold">
                기존 비밀번호
              </label>
              <input
                type="password"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1"
              />
            </div>

            {/* 새 비밀번호 */}
            <div>
              <div className="flex items-center">
                <label className="w-32 text-gray-700 font-semibold">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-1"
                />
              </div>
              <p className="pl-32 text-xs text-gray-500 mt-1">
                비밀번호는 영문, 숫자, 특수문자를 모두 포함한 8~20자리로 입력해주세요.
              </p>
            </div>

            {/* 새 비밀번호 확인 */}
            <div className="flex items-center">
              <label className="w-32 text-gray-700 font-semibold">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1"
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
