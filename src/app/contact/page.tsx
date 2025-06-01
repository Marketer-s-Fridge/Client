// components/ContactPage.tsx
"use client";

import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ContactPage() {
  return (
    <div className="bg-white">
      <Header />

      {/* 상단 배너 */}
      <section className="main-red py-10 text-center">
        <h1 className="text-white text-2xl font-bold">문의하기</h1>
      </section>

      {/* 폼 섹션 */}
      <main className="max-w-[800px] mx-auto px-4 py-12 relative">
        <form className="space-y-6">
          {/* 분류 */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-[100px] text-lg text-gray-800 font-bold">
              분류
            </label>
            <select
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
              defaultValue=""
            >
              <option value="" disabled>
                문의유형을 선택하세요
              </option>
              <option value="bug">버그 신고</option>
              <option value="feature">기능 제안</option>
              <option value="etc">기타</option>
            </select>
          </div>

          {/* 제목 */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-[100px] text-lg text-gray-800 font-bold">
              제목
            </label>
            <input
              type="text"
              placeholder="ex) 콘텐츠를 저장할 수 없어요."
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          {/* 이메일 */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-[100px] text-lg text-gray-800 font-bold">
              이메일
            </label>
            <input
              type="email"
              placeholder="답변 받을 이메일을 입력해주세요"
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          {/* 파일첨부 */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-[100px] text-lg text-gray-800 font-bold">
              파일첨부
            </label>
            <div className="flex-1 flex items-center gap-3">
              <input
                type="file"
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              />
              <span className="text-xs text-gray-500">
                PNG, JPG, PDF 가능 (최대 10MB)
              </span>
            </div>
          </div>

          {/* 내용 */}
          <div className="flex flex-col md:flex-row md:items-start">
            <label className="w-[100px] text-lg text-gray-800 font-bold">
              내용
            </label>

            <div className="flex-1 flex items-center gap-3 relative">
              <textarea
                rows={10}
                maxLength={1000}
                placeholder="문제가 발생한 화면과 증상을 자세히 작성해주세요."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              ></textarea>
              <div className="absolute text-right text-xs text-gray-500 mt-1 right-3 bottom-2">
                0 / 1000
              </div>
            </div>
          </div>

          {/* 개인정보 동의 */}
          <div className="absolute items-center text-sm left-3/21">
            <input type="checkbox" id="agree" className="mr-2.5 w-4.5 h-4.5" />
            <label
              htmlFor="agree"
              className="text-center align-top text-gray-400"
            >
              개인정보 수집 및 이용에 동의합니다. [필수]
              <a href="#" className="underline ml-3 text-gray-500">
                이용약관 보기
              </a>
            </label>
          </div>

          {/* 제출버튼 */}
          <div className="text-end mt-20">
            <button
              type="submit"
              className="border border-gray-300 rounded-full px-6 py-1.5 text-sm hover:bg-gray-100"
            >
              제출하기
            </button>
          </div>
        </form>
      </main>
      <Footer/>
    </div>
  );
}
