"use client";

import { AuthHeader, SubmitButton } from "@/components/authFormComponents";
import Header from "@/components/header";
import React, { useState } from "react";

export default function EmailJoinPage() {
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [birth, setBirth] = useState({ year: "", month: "", day: "" });

  return (
    <div>
      <Header />
      <div className="bg-white min-h-screen px-4 sm:px-6 md:px-8 py-16 flex justify-center">
        <div className="w-full max-w-[550px]">
          <AuthHeader />

          <form className="w-full flex flex-col gap-6 text-sm">
            {/* 이메일 */}
            <InputRow label="이메일주소" required>
              <div className="flex gap-2 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border border-gray-400 rounded px-3 py-2 text-[13px]"
                />
                <button
                  type="button"
                  className="bg-gray-200 text-[13px] px-3 py-2 rounded"
                >
                  중복확인
                </button>
              </div>
            </InputRow>

            {/* 아이디 */}
            <InputRow label="아이디" required>
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="flex-1 border border-gray-400 rounded px-3 py-2 text-[13px]"
                />
                <button
                  type="button"
                  className="bg-gray-200 text-[13px] px-3 py-2 rounded"
                >
                  중복확인
                </button>
              </div>
            </InputRow>

            {/* 닉네임 */}
            <InputRow label="닉네임" required>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full border border-gray-400 rounded px-3 py-2 text-[13px]"
              />
            </InputRow>

            {/* 이름 */}
            <InputRow label="이름" required>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-400 rounded px-3 py-2 text-[13px]"
              />
            </InputRow>

            {/* 휴대폰 */}
            <InputRow label="휴대폰" required>
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="- 없이 숫자만"
                  className="flex-1 border border-gray-400 rounded px-3 py-2 text-[13px]"
                />
                <button
                  type="button"
                  className="bg-gray-200 text-[13px] px-3 py-2 rounded"
                >
                  인증번호 전송
                </button>
              </div>
            </InputRow>

            {/* 인증번호 */}
            <InputRow label="인증번호" required>
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 border border-gray-400 rounded px-3 py-2 text-[13px]"
                />
                <button
                  type="button"
                  className="bg-gray-200 text-[13px] px-3 py-2 rounded"
                >
                  인증 완료
                </button>
              </div>
            </InputRow>

            {/* 생년월일 */}
            <InputRow label="생년월일">
              <div className="flex gap-2 w-full">
                <select
                  value={birth.year}
                  onChange={(e) =>
                    setBirth({ ...birth, year: e.target.value })
                  }
                  className="border border-gray-400 rounded px-2 py-2 text-[13px] w-1/3"
                >
                  <option value="">년도</option>
                  {Array.from({ length: 50 }, (_, i) => 1980 + i).map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
                <select
                  value={birth.month}
                  onChange={(e) =>
                    setBirth({ ...birth, month: e.target.value })
                  }
                  className="border border-gray-400 rounded px-2 py-2 text-[13px] w-1/3"
                >
                  <option value="">월</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m}>{String(m).padStart(2, "0")}</option>
                  ))}
                </select>
                <select
                  value={birth.day}
                  onChange={(e) =>
                    setBirth({ ...birth, day: e.target.value })
                  }
                  className="border border-gray-400 rounded px-2 py-2 text-[13px] w-1/3"
                >
                  <option value="">일</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d}>{String(d).padStart(2, "0")}</option>
                  ))}
                </select>
              </div>
            </InputRow>

            {/* 비밀번호 */}
            <InputRow label="비밀번호" required>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-400 rounded px-3 py-2 text-[13px]"
              />
            </InputRow>

            {/* 비밀번호 확인 */}
            <InputRow label="비밀번호 확인" required>
              <input
                type="password"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
                className="w-full border border-gray-400 rounded px-3 py-2 text-[13px]"
              />
            </InputRow>

            {/* 동의 체크박스 */}
            <div className="w-7/9 place-self-center mt-6 border-gray-200 pt-6 space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> <b>모두 동의하기</b>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> [필수] 만 14세 이상입니다.
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> [필수] 개인정보 제공에 동의합니다.
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> [필수] 개인정보 수집 및 이용에 동의합니다.
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> [선택] 마케팅 활용 및 광고 수신에 동의합니다.
              </label>
            </div>

            <div className="text-center mt-10">
              <SubmitButton
                text="나의 냉장고 열어보기"
                onClick={() => alert("회원가입 완료")}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ✅ label + input 정렬 맞추는 공통 row 컴포넌트
const InputRow = ({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-7/9 mx-auto grid grid-cols-[112px_1fr] gap-2 items-center">
      <label className="text-[13px] font-semibold whitespace-nowrap text-left">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
};
