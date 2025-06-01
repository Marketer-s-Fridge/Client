"use client";

import Header from "@/components/header";
import React, { useState } from "react";
import { TextInput, SubmitButton } from "@/components/authFormComponents";
import Footer from "@/components/footer";

const FindIdPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center px-4 py-20">
        {/* 타이틀 */}
        <h1 className="text-[36px] font-bold mb-4">아이디 찾기</h1>

        {/* 서브텍스트 */}
        <p className="text-[16px] text-center text-gray-700 leading-relaxed mb-10 whitespace-pre-line">
          아이디가 기억나지 않으세요?
          {"\n"}걱정 마세요, 금방 찾아드릴게요.
        </p>

        {/* 입력 필드 */}
        <form className="w-3/8 flex flex-col gap-6 items-center">
          <TextInput
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <TextInput
            label="이메일주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />

          <div className="mb-1" />
          <SubmitButton
            text="내 아이디 찾기"
            onClick={() => alert("아이디 찾기 요청됨")}
          />
        </form>
      </main>
      <Footer/>
    </div>
  );
};

export default FindIdPage;
