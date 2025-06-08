"use client";

import Header from "@/components/header";
import React, { useState } from "react";
import { TextInput, SubmitButton } from "@/components/authFormComponents";
import { useRouter } from "next/navigation";

const FindIdPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [foundId, setFoundId] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  const handleFindId = () => {
    // 실제 API 요청이 들어가야 할 자리!
    if (name === "test" && email === "test@gmail.com") {
      setFoundId("a123456789");
      setNotFound(false);
    } else {
      setFoundId(null);
      setNotFound(true);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-start pt-[15vh] px-4">
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

          <SubmitButton
            text="내 아이디 찾기"
            onClick={() => {
              handleFindId();
            }}
          />
        </form>

        {/* 결과 */}
        {foundId && (
          <div className="mt-10 text-center">
            <p className="text-lg font-semibold">
              내 아이디: <span className="text-black">{foundId}</span>
            </p>
            <div className="mt-6 flex gap-4 justify-center">
              <button
                className="flex flex-1 bg-[#FF4545] text-white font-semibold py-2 px-6 rounded-lg cursor-pointer"
                onClick={() => router.push("/login")}
              >
                로그인 하기
              </button>
              <button
                className="border border-[#FF4545] text-[#FF4545] font-semibold py-2 px-6 rounded-lg cursor-pointer"
                onClick={() => router.push("/find-password")}
              >
                비밀번호 찾기
              </button>
            </div>
          </div>
        )}

        {/* 회원정보 없음 */}
        {notFound && (
          <div className="mt-10 text-center">
            <p className="text-base text-black font-medium">
              일치하는 회원 정보가 없습니다.
            </p>
            <button
              className="mt-6 border border-[#FF4545] text-[#FF4545] font-semibold py-2 px-8 rounded-lg cursor-pointer"
              onClick={() => router.push("/register")}
            >
              회원가입
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default FindIdPage;
