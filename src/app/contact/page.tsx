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
import BaseModal from "@/components/baseModal";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();

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
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false); // 서비스 이용약관 모달
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false); // 개인정보처리방침 모달

  const { mutateAsync: uploadImage, isPending: isUploading } = useImageUpload();

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // 폼 초기화
      setCategory("");
      setTitle("");
      setEmail("");
      setContent("");
      setFile(null);
      setFileName("");
      setImageUrl(null);
      setAgreed(false);

      // 성공 모달 오픈
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

          {/* 내용 + 약관 동의 */}
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
              <div className="flex flex-col mt-4 text-sm gap-1">
                <div className="flex items-start gap-2">
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
                  </label>
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 ml-7">
                  <button
                    type="button"
                    className="underline"
                    onClick={() => setIsTermsModalOpen(true)}
                  >
                    서비스 이용약관 보기
                  </button>
                  <button
                    type="button"
                    className="underline"
                    onClick={() => setIsPrivacyModalOpen(true)}
                  >
                    개인정보처리방침 보기
                  </button>
                </div>
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

      {/* 제출 성공 모달 */}
      <BaseModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          router.push("/");
        }}
      >
        <div className=" flex flex-col items-center justify-center px-4 py-2">
          <p className="text-center text-base text-gray-700 mb-1 leading-snug">
            <strong className="text-lg font-semibold block mb-1">
              문의 제출 완료!
            </strong>
            빠르게 확인 후 입력하신 이메일로 답변드릴게요.
          </p>
        </div>
      </BaseModal>

      {/* 서비스 이용약관 모달 */}
      <BaseModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        widthClassName="max-w-[520px] sm:max-w-[640px] md:max-w-[760px]"
      >
        <div className="justify-self-center w-full sm:w-[520px] max-h-[70vh] px-4 py-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            서비스 이용약관
          </h2>
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
            {`[서비스 이용약관]
제1조 (목적)
이 약관은 Marketer’s Fridge가 제공하는 Maeketer’s Fridge 홈페이지의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 이용조건 및 절차 등 기본적인 사항을 규정함을 목적으로 합니다.

제2조 (용어 정의)
"서비스"란 회사가 운영하는 웹사이트/앱에서 제공하는 모든 온라인 서비스를 의미합니다.
"회원"이란 본 약관에 동의하고 서비스를 이용하는 자를 말합니다.
"아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인한 문자·숫자의 조합을 의미합니다.
"비밀번호"란 회원이 부여받은 아이디와 일치되는 회원임을 확인하고 회원의 권익 보호를 위해 회원이 정한 문자와 숫자의 조합을 말합니다.

제3조 (약관의 효력 및 변경)
본 약관은 서비스를 통해 온라인으로 공지하거나 이메일 등으로 통지함으로써 효력을 발생합니다. 회사는 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있으며, 개정 시 사전 공지합니다.

제4조 (이용계약의 체결)
회원가입은 이용자가 약관에 동의하고, 회사가 정한 절차에 따라 회원가입을 신청하며 회사가 이를 승낙함으로써 성립됩니다.

제5조 (회원의 의무)
타인의 정보 도용
회사 또는 제3자의 지식재산권 침해
서비스 운영을 방해하는 행위
법령 또는 공서양속에 반하는 행위

제6조 (서비스의 제공 및 변경)
회사는 회원에게 다음과 같은 서비스를 제공합니다.
- 콘텐츠 열람
- 이용 이력 열람 기능
- 시청 기록 저장
- 개인화 통계 기반 콘텐츠 분석 기능

회사는 필요 시 서비스의 내용을 변경하거나 추가할 수 있으며, 변경 시 사전 공지합니다.

제7조 (서비스의 중단)
시스템 유지보수
천재지변 및 불가항력
기타 회사가 필요하다고 판단하는 경우

제8조 (계약 해지 및 이용제한)
회원은 언제든지 탈퇴할 수 있으며, 회사는 회원이 약관을 위반한 경우 이용을 제한하거나 탈퇴 처리할 수 있습니다.

제9조 (지적재산권)
서비스에 제공된 콘텐츠에 대한 저작권 및 지식재산권은 회사에 있으며, 무단 복제 및 사용을 금지합니다.

제10조 (면책조항)
회사는 천재지변 또는 이에 준하는 불가항력으로 인한 서비스 중단에 대해 책임지지 않습니다. 회사는 회원의 귀책 사유로 인한 서비스 이용 장애에 대해 책임지지 않습니다.`}
          </p>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setIsTermsModalOpen(false)}
              className="px-4 py-2 text-sm rounded-md bg-gray-800 text-white"
            >
              닫기
            </button>
          </div>
        </div>
      </BaseModal>

      {/* 개인정보처리방침 모달 */}
      <BaseModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        widthClassName="max-w-[520px] sm:max-w-[640px] md:max-w-[760px]"
      >
        <div className="justify-self-center w-full sm:w-[520px] max-h-[70vh] px-4 py-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            개인정보처리방침
          </h2>
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
            {`[개인정보처리방침]

■ 수집하는 개인정보 항목
회사는 회원가입 및 서비스 제공을 위해 다음 정보를 수집할 수 있습니다.

필수 항목: 이름, 생년월일, 성별, 이메일 주소, 비밀번호
선택 항목: 프로필 사진, 닉네임 등

■ 개인정보 수집 방법
- 회원가입 및 서비스 이용 시 이용자가 직접 입력
- 이벤트, 고객센터 문의 과정에서 수집

■ 개인정보의 이용 목적
- 회원관리: 본인 확인, 회원 식별, 불량회원 방지
- 서비스 제공: 콘텐츠 제공, 맞춤형 서비스 제공
- 마케팅 활용: 이벤트 안내

■ 개인정보 보유 및 이용 기간
회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관련 법령에 따라 보관이 필요한 경우 일정 기간 보관할 수 있습니다.

- 회원 탈퇴 시 즉시 삭제
- 전자상거래 관련 기록: 5년 (전자상거래법 기준)
- 소비자 불만 또는 분쟁처리 기록: 3년

■ 개인정보의 제3자 제공
회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 다음의 경우는 예외입니다.
- 법령에 근거한 요청이 있는 경우
- 이용자의 사전 동의를 받은 경우

■ 개인정보 처리 위탁
회사는 원활한 서비스 제공을 위해 개인정보를 외부 업체에 위탁할 수 있으며, 위탁 시 관련 법령에 따라 관리·감독합니다.

■ 이용자 및 법정대리인의 권리
이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다.

■ 개인정보의 보호조치
회사는 개인정보의 안전한 처리를 위하여 기술적·관리적 보호조치를 시행하고 있습니다.
- CSRF(Cross-Site Request Forgery) 방지 기능을 적용하여 비정상적인 요청 차단
- 비밀번호는 암호화 방식으로 저장

■ 개인정보 보호책임자
책임자: 진현진, 이재빈
이메일: marketersfridge@gmail.com
`}
          </p>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(false)}
              className="px-4 py-2 text-sm rounded-md bg-gray-800 text-white"
            >
              닫기
            </button>
          </div>
        </div>
      </BaseModal>

      <Footer />
    </div>
  );
}
