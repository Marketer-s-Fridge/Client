// src/app/contact/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Banner from "@/components/banner";
import CustomDropdown from "@/components/customDropdown";
import MobileMenu from "@/components/mobileMenu";
import { createEnquiry } from "@/features/enquiries/api/enquiriesApi";
import { EnquiryRequestDto } from "@/features/enquiries/types";
import LoginRequiredModal from "@/components/loginRequiredModal";
import { useImageUpload } from "@/features/posts/hooks/useImageUpload";
import BaseConfirmButton from "@/components/baseConfirmButton";
import BaseModal from "@/components/baseModal"; // ✅ 추가
import { useRouter } from "next/navigation"; // ✅ 추가

export default function ContactPage() {
  const router = useRouter(); // ✅ 추가

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // ✅ 추가

  const {
    mutateAsync: uploadImage,
    isPending: isUploading,
  } = useImageUpload();

  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    }
  }, [isLoggedIn]);

  const isFormValid = !!(category && title && email && content && agreed);

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

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setImageUrl(null);

    if (!selected) {
      setFileName("");
      return;
    }

    setFileName(selected.name);

    try {
      const url = await uploadImage(selected);
      setImageUrl(url);
      console.log("문의 이미지 업로드 성공: ", url);
    } catch (err) {
      console.error("문의 이미지 업로드 실패: ", err);
      alert("이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
      setFile(null);
      setFileName("");
      setImageUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    if (file && (isUploading || !imageUrl)) {
      alert("이미지 업로드가 완료된 후에 제출해주세요.");
      return;
    }

    try {
      setLoading(true);

      const dto: EnquiryRequestDto = {
        category,
        title,
        writerEmail: email,
        content,
        agreement: agreed,
        imageUrl: imageUrl ?? undefined,
      };

      const res = await createEnquiry(dto);
      console.log("문의 등록 성공:", res);

      // ✅ 폼 초기화
      setCategory("");
      setTitle("");
      setEmail("");
      setContent("");
      setFile(null);
      setFileName("");
      setImageUrl(null);
      setAgreed(false);

      // ✅ 성공 모달 오픈
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      console.error("문의 등록 실패:", error);
      alert("문의 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Banner title="문의하기" />

      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        message="로그인 후 문의를 남기실 수 있습니다"
        redirectPath="/login"
      />

      <main className="max-w-[800px] mx-auto px-[5%] sm:px-4 py-12 relative">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* 분류 */}
          <div className="flex flex-col md:flex-row md:items-center gap-y-2">
            <label className="w-[100px] sm:text-lg text-gray-800 font-bold">
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
            <label className="w-[100px] sm:text-lg text-gray-800 font-bold">
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

          {/* 이메일 */}
          <div className="flex flex-col md:flex-row md:items-center gap-y-2">
            <label className="w-[100px] sm:text-lg text-gray-800 font-bold">
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
            <label className="w-[100px] sm:text-lg text-gray-800 font-bold">
              파일첨부
            </label>
            <div className="flex-1 flex items-center gap-3">
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-white bg-[#555555] hover:bg-[#959595] rounded px-3 py-2 text-sm"
              >
                {isUploading ? "업로드 중..." : "파일 선택"}
              </label>
              <span className="text-sm text-gray-600">
                {fileName || "PNG, JPG, PDF 가능 (최대 10MB)"}
              </span>
            </div>
          </div>

          {/* 내용 */}
          <div className="flex flex-col md:flex-row md:items-start gap-y-2">
            <label className="w-[100px] sm:text-lg text-gray-800 font-bold">
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

              {/* 개인정보 동의 */}
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

          {/* 제출 버튼 */}
          <div className="text-end mt-10">
            <BaseConfirmButton
              type="submit"
              disabled={!isFormValid || loading || isUploading}
            >
              {loading
                ? "제출 중..."
                : isUploading
                ? "이미지 업로드 중..."
                : "제출하기"}
            </BaseConfirmButton>
          </div>
        </form>
      </main>

      {/* ✅ 제출 성공 모달 */}
      <BaseModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          router.push("/"); // ✅ 홈으로 라우팅
        }}
      >
        <div className="flex flex-col items-center justify-center px-4 py-2">
          <p className="text-center text-base text-gray-700 mb-1 leading-snug">
            <strong className="text-lg font-semibold block mb-1">
              문의 제출 완료!
            </strong>
            빠르게 확인 후 입력하신 이메일로 답변드릴게요.
          </p>
        </div>
      </BaseModal>

      <Footer />
    </div>
  );
}
