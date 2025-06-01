"use client";

import Header from "@/components/header";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthHeader, SubmitButton } from "@/components/authFormComponents";
import Image from "next/image";
import Footer from "@/components/footer";

const LoginPage: React.FC = () => {
  const [input1, onChangeInput1] = useState("");
  const [input2, onChangeInput2] = useState("");
  // const [input3, onChangeInput3] = useState("");

  const router = useRouter();

  return (
    <div className="bg-white">
      <Header />
      <div className="flex justify-center bg-white py-16 px-4">
        <div className="w-full max-w-[480px] flex flex-col items-center">
          <AuthHeader
            title="로그인"
            description={`마케터의 냉장고에 오신 걸 환영합니다!
필요한 마케팅 콘텐츠를 골라보는 냉장고, 지금 로그인하세요!`}
          />

          <h2 className="text-[24px] font-semibold mb-4">일반 로그인</h2>

          <div className="w-9/11 flex flex-col items-center gap-y-4 mb-3">
            <input
              placeholder="아이디"
              value={input1}
              onChange={(e) => onChangeInput1(e.target.value)}
              className="w-full border border-[#ccc] rounded px-4 py-3 text-[16px]"
            />
            <input
              placeholder="비밀번호"
              type="password"
              value={input2}
              onChange={(e) => onChangeInput2(e.target.value)}
              className="w-full border border-[#ccc] rounded px-4 py-3 text-[16px]"
            />
          </div>

          <div className="w-9/11 flex justify-baseline text-xs text-[#666] mb-6 px-1 gap-5">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              아이디 저장
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              로그인 상태 유지
            </label>
          </div>

          <SubmitButton text="로그인" onClick={() => alert("")} />

          <div className="flex justify-center gap-4 text-[11px] text-[#757575] mb-10 mt-3">
            <button onClick={() => router.push("/signUp")}>회원가입</button>
            <span>|</span>
            <button onClick={() => router.push("/login/findId")}>
              아이디 찾기
            </button>
            <span>|</span>
            <button onClick={() => router.push("/login/findPwd")}>
              비밀번호 찾기
            </button>
          </div>

          <div className="flex items-center w-full mb-8">
            <div className="flex-1 h-[1px] bg-[#ccc]"></div>
            <span className="mx-4 text-[#757575] text-xs">또는</span>
            <div className="flex-1 h-[1px] bg-[#ccc]"></div>
          </div>

          {/* ✅ 소셜 로그인 이미지 버튼 */}
          <div className="w-full flex flex-col items-center gap-y-3 mb-10">
            <button onClick={() => alert("카카오 로그인")}>
              <Image
                src="/icons/kakao-login-bt.png"
                alt="카카오 로그인"
                className="w-full max-w-[400px]"
                width={500}
                height={100}
              />
            </button>

            <button onClick={() => alert("네이버 로그인")}>
              <Image
                src="/icons/naver-login-bt.png"
                alt="네이버 로그인"
                className="w-full max-w-[400px]"
                width={500}
                height={100}
              />
            </button>

            <button onClick={() => alert("Google 로그인")}>
              <Image
                src="/icons/google-login-bt.png"
                alt="Google 로그인"
                className="w-full max-w-[400px]"
                width={500}
                height={100}
              />
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default LoginPage;
