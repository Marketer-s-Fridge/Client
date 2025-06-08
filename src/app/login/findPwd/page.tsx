"use client";

import Header from "@/components/header";
import React, { useState } from "react";
import { TextInput, SubmitButton } from "@/components/authFormComponents";
import { useRouter } from "next/navigation"; // ✅ App Router 전용

const FindPwdPage: React.FC = () => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [foundAccount, setFoundAccount] = useState(true);

  const router = useRouter();

  const handleFindAccount = () => {
    // 유효성 검사
    if (!name.trim() || !userId.trim() || !email.trim()) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 예시: 올바른 계정
    const isMatch =
      name === "테스트" &&
      userId === "test" &&
      email === "test@gmail.com";

    if (isMatch) {
      setFoundAccount(true);
      router.push("./findPwd/resetPwd"); // ✅ 다음 단계로 이동
    } else {
      setFoundAccount(false);
    }
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

          <SubmitButton text="다음 단계" onClick={handleFindAccount} />
        </form>

        {/* 회원정보 없음 */}
        {foundAccount === false && (
          <div className="mt-10 text-center">
            <p className="text-base text-black font-medium">
              일치하는 회원 정보가 없습니다.
            </p>
            <div className="mt-6 flex gap-4 justify-center">
              <button
                className="border bg-[#FF4545] text-white font-semibold py-2 px-6 rounded-lg cursor-pointer"
                onClick={() => router.push("/find-password")}
              >
                아이디 찾기
              </button>
              <button
                className="border border-[#FF4545] text-[#FF4545] font-semibold py-2 px-8 rounded-lg cursor-pointer"
                onClick={() => router.push("/register")}
              >
                회원가입
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FindPwdPage;
