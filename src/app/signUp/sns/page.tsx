"use client";

import React, { useState } from "react";
import Header from "@/components/header";
// import { useRouter } from "next/navigation";
import { AuthHeader, SubmitButton } from "@/components/authFormComponents";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  // const router = useRouter();

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="flex justify-center px-4 py-16">
        <div className="w-full max-w-[550px] flex flex-col items-center text-center">
          <AuthHeader />

          {/* 이메일 입력 */}
          <div className="w-9/11 flex flex-row items-start text-left mb-14 gap-3">
            <label className="text-[16px] font-semibold whitespace-nowrap self-center">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kakao1234@kakao.com"
              className="w-full border border-gray-300 rounded px-3 py-2 text-[16px]"
            />
          </div>

          {/* 동의 체크 영역 */}
          <div className="bg-[#F5F5F5] w-9/11 rounded-[18px] px-6 py-6 mb-10 text-left text-[14px]">
            <label className="flex items-center gap-2 mb-4 font-bold">
              <input type="checkbox" />
              모두 동의하기
            </label>

            <div className="pl-5 flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                [필수] 만 14세 이상입니다.
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                [필수] 개인정보 제공에 동의합니다.
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                [필수] 개인정보 수집 및 이용에 동의합니다.
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
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
