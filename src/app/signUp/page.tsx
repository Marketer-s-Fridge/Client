"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import { useRouter } from "next/navigation"; // ✅ Next.js 클라이언트 라우팅

const SignUpPage: React.FC = () => {
  const [input1, onChangeInput1] = useState("");
  const router = useRouter(); // ✅ 라우터 객체 사용

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="flex justify-center px-4 py-16">
        <div className="w-full max-w-[550px]">
          <h1 className="text-4xl font-bold text-center mb-4">회원가입</h1>
          <p className="text-center text-gray-700 text-lg mb-15">
            마케터의 냉장고에 처음 오셨군요!
            <br />
            신선한 마케팅 아이디어를 꺼내보기 전에 먼저 나만의 냉장고를
            만들어보세요.
          </p>

          <div className="flex flex-col w-full mb-14 justify-self-center justify-center items-center self-center">
            {/* ✅ 이미지 버튼: 카카오 */}
            <button onClick={() => alert("카카오 회원가입")}>
              <img
                src="/icons/kakao-join-bt.png"
                alt="카카오로 시작하기"
                className="w-5/8  mb-4 mx-auto"
              />
            </button>

            {/* ✅ 이미지 버튼: 네이버 */}
            <button onClick={() => alert("네이버 회원가입")}>
              <img
                src="/icons/naver-join-bt.png"
                alt="네이버로 시작하기"
                className="w-5/8 mb-4 mx-auto"
              />
            </button>

            {/* ✅ 이미지 버튼: 구글 */}
            <button onClick={() => alert("구글 회원가입")}>
              <img
                src="/icons/google-join-bt.png"
                alt="Google로 시작하기"
                className="w-5/8 mb-4 mx-auto"
              />
            </button>

            {/* ✅ 이미지 버튼: 이메일 */}
            <button onClick={() => router.push("/signUp/email")}>
              <img
                src="/icons/email-join-bt.png"
                alt="이메일로 시작하기"
                className="w-5/8 mb-4 mx-auto"
              />
            </button>
          </div>

          <div className="w-full h-[1px] bg-[#9f9f9f] mb-4" />

          <div className="flex justify-center items-center gap-2">
            <span className="text-[14px]">이미 회원이신가요?</span>
            <button
              onClick={() => router.push("/login")}
              className="text-[14px] font-bold underline "
            >
              로그인
            </button>{" "}
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
