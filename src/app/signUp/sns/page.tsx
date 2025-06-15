"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import {
  AuthHeader,
  SubmitButton,
  TextInput,
} from "@/components/authFormComponents";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [agreements, setAgreements] = useState({
    all: false,
    age: false,
    provide: false,
    collect: false,
    marketing: false,
  });
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

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="flex justify-center px-4 py-16">
        <div className="w-full max-w-[550px] flex flex-col items-center text-center">
          <AuthHeader />

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
          <div className="bg-[#F5F5F5] w-9/11 rounded-[18px] px-6 py-6 mb-10 text-left text-[14px]">
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
            text="나의 냉장고 열어보기"
            onClick={() => alert("아이디 찾기 요청됨")}
          />
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
