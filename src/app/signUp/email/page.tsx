"use client";

import { SubmitButton } from "@/components/authFormComponents";
import Header from "@/components/header";
import React, { useState } from "react";

export default function EmailJoinPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  return (
    <div>
      <Header />
      <div className="bg-white min-h-screen px-4 py-16 flex justify-center">
        <div className="w-full max-w-[600px] items-center self-center align-middle">
          <h1 className="text-4xl font-bold text-center mb-4">회원가입</h1>
          <p className="text-center text-gray-700 text-lg mb-10">
            마케터의 냉장고에 처음 오셨군요!
            <br />
            신선한 마케팅 아이디어를 꺼내보기 전에 먼저 나만의 냉장고를
            만들어보세요.
          </p>

          <form className="space-y-5 text-sm w-full">
            {/* 이메일 */}
            <div className="w-9/11 mx-auto flex items-center gap-1">
              <label className="text-[15px] w-32 font-semibold whitespace-nowrap">
                이메일주소<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border border-gray-400 rounded-lg px-3 py-2"
              />
              <button
                type="button"
                className="text-sm bg-gray-300 rounded-lg px-3 py-2"
              >
                중복확인
              </button>
            </div>

            {/* 아이디 */}
            <div className="w-9/11 mx-auto">
              <div className="flex items-center gap-[4px] mb-1">
                <label className="text-[15px] w-32 font-semibold whitespace-nowrap">
                  아이디<span className="text-red-500 ml-1">*</span>
                </label>
                <input className="flex-1 border border-gray-400 rounded-lg px-3 py-2" />
              </div>
              <p className="text-xs text-gray-600 pl-36">
                아이디는 영문, 숫자 포함 4-20자리를 입력해주세요.
              </p>
            </div>

            {/* 닉네임 */}
            <div className="w-9/11 mx-auto">
              <div className="flex items-center gap-[4px] mb-1">
                <label className="text-[15px] w-32 font-semibold whitespace-nowrap">
                  닉네임<span className="text-red-500 ml-1">*</span>
                </label>
                <input className="flex-1 border border-gray-400 rounded-lg px-3 py-2" />
              </div>
              <p className="text-xs text-gray-600 pl-36">
                닉네임은 2~8자까지 설정이 가능합니다.
              </p>
            </div>

            {/* 이름 */}
            <div className="w-9/11 mx-auto flex items-center gap-[4px]">
              <label className="text-[15px] w-32 font-semibold whitespace-nowrap">
                이름<span className="text-red-500 ml-1">*</span>
              </label>
              <input className="flex-1 border border-gray-400 rounded-lg px-3 py-2" />
            </div>

            {/* 휴대폰 */}
            <div className="w-9/11 mx-auto flex items-center gap-[4px]">
              <label className="text-[15px] w-32 font-semibold whitespace-nowrap">
                휴대폰<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                placeholder="-없이 숫자만"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 border border-gray-400 rounded-lg px-3 py-2"
              />
              <button
                type="button"
                className="text-sm bg-gray-300 rounded-lg px-3 py-2"
              >
                인증번호 전송
              </button>
            </div>

            {/* 인증번호 */}
            <div className="w-9/11 mx-auto flex items-center gap-[4px]">
              <label className="text-[15px] w-32 font-semibold whitespace-nowrap">
                인증번호<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 border border-gray-400 rounded-lg px-3 py-2"
              />
              <button
                type="button"
                className="text-sm bg-gray-300 rounded-lg px-3 py-2"
              >
                인증 완료
              </button>
            </div>

            {/* 생년월일 */}
            <div className="w-9/11 mx-auto flex items-center gap-[4px]">
              <label className="text-[15px] w-32 font-semibold whitespace-nowrap">
                생년월일
              </label>
              <select className="border border-gray-400 rounded-lg px-2 py-2">
                <option>1990</option>
              </select>
              <select className="border border-gray-400 rounded-lg px-2 py-2">
                <option>01</option>
              </select>
              <select className="border border-gray-400 rounded-lg px-2 py-2">
                <option>01</option>
              </select>
            </div>

            {/* 비밀번호 */}
            <div className="w-9/11 mx-auto">
              <div className="flex items-center gap-[4px] mb-1">
                <label className="text-[15px] w-32 font-semibold whitespace-nowrap">
                  비밀번호<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="password"
                  className="flex-1 border border-gray-400 rounded-lg px-3 py-2"
                />
              </div>
              <p className="text-xs text-gray-600 pl-36">
                비밀번호는 영문, 숫자, 특수문자를 포함한 8~20자리로
                입력해주세요.
              </p>
            </div>

            {/* 비밀번호 확인 */}
            <div className="w-9/11 mx-auto flex items-center gap-[4px]">
              <label className="text-[15px] w-32 font-semibold whitespace-nowrap">
                비밀번호 확인<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="password"
                className="flex-1 border border-gray-400 rounded-lg px-3 py-2"
              />
            </div>

            {/* 동의 체크박스 */}
            <div className="w-9/11 mx-auto mt-6 border-t border-gray-200 pt-6 space-y-2 text-sm">
              <label className="flex items-center gap-[4px]">
                <input type="checkbox" /> <b>모두 동의하기</b>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> [필수] 만 14세 이상입니다.
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> [필수] 개인정보 제공에 동의합니다.
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> [필수] 개인정보 수집 및 이용에
                동의합니다.
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> [선택] 마케팅 활용 및 광고 수신에
                동의합니다.
              </label>
            </div>

            <div className="text-center mt-10">
              <SubmitButton
                text="나의 냉장고 열어보기"
                onClick={() => alert("이메일 회원가입 완료")}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
