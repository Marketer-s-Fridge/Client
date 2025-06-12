"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Banner from "@/components/banner";
import CustomDropdown from "@/components/admin/customDropdown";

export default function ContactPage() {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [agreed, setAgreed] = useState(false);

  const isFormValid = category && title && email && content && agreed;
  const categoryOptions = ["버그 신고", "기능 제안", "기타"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    // 제출 처리 로직
    alert("문의가 제출되었습니다.");
  };

  return (
    <div className="bg-white">
      <Header />

      {/* 상단 배너 */}

      <Banner title="문의하기"></Banner>

      {/* 폼 섹션 */}
      <main className="max-w-[800px] mx-auto px-[5%] sm:px-4 py-12 relative">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* 분류 */}
          <div className="flex flex-col md:flex-row md:items-center gap-y-2">
            <label className="w-[100px] text-medium sm:text-lg text-gray-800 font-bold">
              분류
            </label>

            <div className="flex-1">
              <CustomDropdown
                options={categoryOptions}
                label={category || "문의유형을 선택하세요"}
                onSelect={(value) => setCategory(value)}
                buttonClassName="rounded-md"
              />
            </div>
          </div>

          {/* 제목 */}
          <div className="flex flex-col md:flex-row md:items-center gap-y-2">
            <label className="w-[100px] text-medium sm:text-lg text-gray-800 font-bold">
              제목
            </label>
            <input
              type="text"
              placeholder="ex) 콘텐츠를 저장할 수 없어요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          {/* 이메일 */}
          <div className="flex flex-col md:flex-row md:items-center gap-y-2">
            <label className="w-[100px] text-medium sm:text-lg text-gray-800 font-bold">
              이메일
            </label>
            <input
              type="email"
              placeholder="답변 받을 이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          {/* 파일첨부 */}
          <div className="flex flex-col md:flex-row md:items-center gap-y-2">
            <label className="w-[100px] text-medium sm:text-lg text-gray-800 font-bold">
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
          <div className="flex flex-col md:flex-row md:items-start gap-y-2">
            <label className="w-[100px] text-medium sm:text-lg text-gray-800 font-bold">
              내용
            </label>
            <div className="flex-1 relative">
              <textarea
                rows={10}
                maxLength={1000}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="문제가 발생한 화면과 증상을 자세히 작성해주세요."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <div className="absolute text-right text-xs text-gray-500 right-3 bottom-12">
                {`${content.length}/1000`}
              </div>

              {/* 개인정보 수집 동의 */}
              <div className="flex items-start mt-4 text-sm">
                <input
                  type="checkbox"
                  id="agree"
                  className="mr-2.5 mt-1 w-4 h-4"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <label htmlFor="agree" className="text-gray-500">
                  개인정보 수집 및 이용에 동의합니다. [필수]
                  <a href="#" className="underline ml-2">
                    이용약관 보기
                  </a>
                </label>
              </div>
            </div>
          </div>

          {/* 제출버튼 */}
          <div className="text-end mt-10">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`rounded-full px-6 py-1.5 text-sm font-medium transition-colors ${
                isFormValid
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              제출하기
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
