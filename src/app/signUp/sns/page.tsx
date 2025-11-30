// src/app/signUp/page.tsx (예시 경로)
"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/header";
import {
  AuthHeader,
  SubmitButton,
  TextInput,
} from "@/components/authFormComponents";
import MobileMenu from "@/components/mobileMenu";
import { useRouter } from "next/navigation";
import api from "@/lib/apiClient";

const SignUpPage: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [agreements, setAgreements] = useState({
    all: false,
    age: false,       // [필수] 만 14세 이상
    provide: false,   // [필수] 개인정보 제공
    collect: false,   // [필수] 개인정보 수집/이용
    marketing: false, // [선택] 마케팅 동의
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 카카오 유저 이메일 기본값 세팅
  useEffect(() => {
    if (typeof window === "undefined") return;

    const rawUser = localStorage.getItem("user");
    if (!rawUser) return; // 카카오 로그인 안된 상태에서 들어오면 그냥 빈 상태

    try {
      const user = JSON.parse(rawUser);
      if (user?.email && typeof user.email === "string") {
        setEmail(user.email);
      }
    } catch {
      // 파싱 실패 시 무시
    }
  }, []);

  const handleAllAgree = (checked: boolean) => {
    setAgreements({
      all: checked,
      age: checked,
      provide: checked,
      collect: checked,
      marketing: checked,
    });
  };

  const handleSingleAgree = (
    key: keyof typeof agreements,
    checked: boolean
  ) => {
    const newAgreements = { ...agreements, [key]: checked };
    const allChecked =
      newAgreements.age &&
      newAgreements.provide &&
      newAgreements.collect &&
      newAgreements.marketing;

    setAgreements({ ...newAgreements, all: allChecked });
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    // 필수 약관 체크 확인
    if (!agreements.age || !agreements.provide || !agreements.collect) {
      alert("필수 약관에 모두 동의해주세요.");
      return;
    }

    try {
      setSubmitting(true);

      // ✅ 카카오 회원가입/프로필 완료 API 호출
      // 엔드포인트와 필드명은 백엔드랑 맞춰서 수정
      await api.post(
        "/auth/kakao",
        {
          email: email.trim(),
          agreeMarketing: agreements.marketing,
          // 필요하면 추가 필드 더 넣기 (예: company, position 등)
        }
        // JWT는 apiClient에서 Authorization 헤더 자동 셋업한다고 가정
      );

      alert("회원가입이 완료되었습니다.");
      router.replace("/");
    } catch (error) {
      console.error(error);
      alert("회원가입 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-18 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="flex justify-center px-4 py-16">
        <div className="w-full px-2 md:px-0 md:w-7/9 max-w-[550px] flex flex-col items-center">
          {/* 카카오 회원가입용 헤더 문구로 쓰고 싶으면 props 전달 */}
          <AuthHeader
            title="회원가입"
            description={`마케터의 냉장고 이용을 위해\n이메일과 약관 동의를 완료해주세요.`}
          />

          {/* 이메일 입력 */}
          <TextInput
            className="gap-10"
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kakao1234@kakao.com"
          />

          {/* 동의 체크 영역 */}
          <div className="bg-[#F5F5F5] w-10/11 rounded-[18px] px-6 py-6 mt-10 mb-10 text-left text-[14px]">
            {/* 모두 동의하기 */}
            <label className="flex items-center gap-2 mb-4 font-bold">
              <input
                type="checkbox"
                className="accent-red-500"
                checked={agreements.all}
                onChange={(e) => handleAllAgree(e.target.checked)}
              />
              모두 동의하기
            </label>

            {/* 개별 항목들 */}
            <div className="pl-5 flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-red-500"
                  checked={agreements.age}
                  onChange={(e) => handleSingleAgree("age", e.target.checked)}
                />
                [필수] 만 14세 이상입니다.
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-red-500"
                  checked={agreements.provide}
                  onChange={(e) =>
                    handleSingleAgree("provide", e.target.checked)
                  }
                />
                [필수] 개인정보 제공에 동의합니다.
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-red-500"
                  checked={agreements.collect}
                  onChange={(e) =>
                    handleSingleAgree("collect", e.target.checked)
                  }
                />
                [필수] 개인정보 수집 및 이용에 동의합니다.
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-red-500"
                  checked={agreements.marketing}
                  onChange={(e) =>
                    handleSingleAgree("marketing", e.target.checked)
                  }
                />
                [선택] 마케팅 활용 및 광고 수신에 동의합니다.
              </label>
            </div>
          </div>

          {/* 제출 버튼 */}
          <SubmitButton
            text={submitting ? "처리 중..." : "나의 냉장고 열어보기"}
            onClick={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
