"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Banner from "@/components/banner";
import CustomDropdown from "@/components/customDropdown";
import MobileMenu from "@/components/mobileMenu";

export default function ContactPage() {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fileName, setFileName] = useState("");

  const isFormValid = category && title && email && content && agreed;

  const categoryOptions = [
    "시스템 오류",
    "회원/계정 관련",
    "콘텐츠 관련",
    "제안/피드백",
    "광고/제휴 문의",
    "기타",
  ];

  const placeholderMap: Record<string, string> = {
    "시스템 오류":
      "어떤 오류가 발생했는지 가능한 한 자세히 알려주세요! (예: 로그인 시 로딩이 멈춰요)",
    "회원/계정 관련":
      "회원가입/로그인/계정 정보와 관련된 문의 내용을 입력해주세요 :)",
    "콘텐츠 관련":
      "오탈자, 이미지 깨짐, 잘못된 정보 등 콘텐츠에서 발견한 내용을 알려주시면 빠르게 확인할게요!",
    "제안/피드백": "더 나은 서비스를 위한 의견이 있다면 편하게 말씀해주세요 :)",
    "광고/제휴 문의":
      "광고나 제휴 관련 내용을 자유롭게 작성해주세요. 담당자가 빠르게 확인할게요!",
    기타: "어떤 문의든 괜찮아요! 궁금한 점이나 불편한 점을 자유롭게 적어주세요 :)",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    alert("문의가 제출되었습니다.");
  };

  return (
    <div className="bg-white pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Banner title="문의하기" />

      <main className="max-w-[800px] mx-auto px-[5%] sm:px-4 py-12 relative">
        <form className="space-y-6" onSubmit={handleSubmit}>
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

          <div className="flex flex-col md:flex-row md:items-center gap-y-2">
            <label className="w-[100px] text-medium sm:text-lg text-gray-800 font-bold">
              제목
            </label>
            <input
              type="text"
              placeholder="문의 제목을 적어주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

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
              {/* 숨겨진 input */}
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => {
                  const fileName = e.target.files?.[0]?.name || "";
                  setFileName(fileName);
                }}
              />
              {/* 커스텀 버튼 */}
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-white bg-[#555555] hover:bg-[#959595] rounded px-3 py-2 text-sm"
              >
                파일 선택
              </label>
              {/* 파일 이름 표시 */}
              <span className="text-sm text-gray-600">
                {fileName || "PNG, JPG, PDF 가능 (최대 10MB)"}
              </span>
            </div>
          </div>

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
                placeholder={
                  placeholderMap[category] ||
                  "문제가 발생한 화면과 증상을 자세히 작성해주세요."
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <div className="absolute text-right text-xs text-gray-500 right-3 bottom-12">
                {`${content.length}/1000`}
              </div>

              <div className="flex items-start mt-4 text-sm gap-2">
                <div className="relative w-5 h-5">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 ${
                      agreed
                        ? "bg-[#FF4545] border-[#FF4545]"
                        : "border-gray-300"
                    } flex items-center justify-center transition-colors`}
                  >
                    {agreed && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <label htmlFor="agree" className="text-gray-500 leading-5">
                  개인정보 수집 및 이용에 동의합니다. [필수]
                  <a href="#" className="underline ml-2">
                    이용약관 보기
                  </a>
                </label>
              </div>
            </div>
          </div>

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
