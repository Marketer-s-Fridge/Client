"use client";

import Header from "@/components/header";
import React, { useState } from "react";
import { TextInput, SubmitButton } from "@/components/authFormComponents";
import { useRouter } from "next/navigation"; // ✅ App Router 전용

const FindPwdPage: React.FC = () => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    // 간단한 유효성 검사
    if (!name.trim() || !userId.trim() || !email.trim()) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 모든 항목이 입력되었을 경우
    router.push("./findPwd/resetPwd");
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-start pt-[15vh] px-4">
        {/* 타이틀 */}
        <h1 className="text-[36px] font-bold mb-4">비밀번호 찾기</h1>

        {/* 서브텍스트 */}
        <p className="text-[16px] text-center text-gray-700 leading-relaxed mb-10 whitespace-pre-line">
          비밀번호가 기억나지 않으세요?
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
            label="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            type="text"
            required
          />

          <TextInput
            label="이메일주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />

          <SubmitButton text="다음 단계" onClick={handleSubmit} />
        </form>
      </main>
    </div>
  );
};

export default FindPwdPage;
