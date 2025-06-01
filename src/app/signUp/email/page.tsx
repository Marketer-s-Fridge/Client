"use client";

import { AuthHeader, SubmitButton } from "@/components/authFormComponents";
import Header from "@/components/header";
import React, { useState } from "react";
import { useEffect } from "react";

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

  const [errors, setErrors] = useState({
    email: false,
    id: false,
    nickname: false,
    code: false,
    password: false,
    passwordCheck: false,
    agreements: false,
  });

  const isPasswordValid = (pwd: string) => {
    return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^\w\s]).{8,20}$/.test(pwd);
  };

  const [agreements, setAgreements] = useState({
    all: false,
    age: false,
    provide: false,
    collect: false,
    marketing: false,
  });

  const handleSubmit = () => {
    const newErrors = {
      email: !email.includes("@"),
      id: !id.trim(),
      nickname: !nickname.trim(),
      code: code !== "123456", // 예시
      password: !isPasswordValid(password),
      passwordCheck: password !== passwordCheck,
      agreements: !agreements.age || !agreements.provide || !agreements.collect,
    };
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (!hasError) alert("회원가입 완료");
  };

  // ✅ 필수 3개 체크 상태 감시하여 all 자동 반영
  useEffect(() => {
    const allChecked =
      agreements.age && agreements.provide && agreements.collect && agreements.marketing;
    if (agreements.all !== allChecked) {
      setAgreements((prev) => ({ ...prev, all: allChecked }));
    }
  }, [agreements.age, agreements.provide, agreements.collect,agreements.marketing]);

  // ✅ "모두 동의하기" 클릭 시 나머지 필수 전체 반영
  const handleAllAgree = (checked: boolean) => {
    setAgreements({
      all: checked,
      age: checked,
      provide: checked,
      collect: checked,
      marketing: checked, // 선택 항목은 유지
    });
  };

  return (
    <div className="bg-white">
      <Header />
      <div className="bg-white min-h-screen px-4 sm:px-6 md:px-8 py-16 flex justify-center">
        <div className="w-full max-w-[550px]">
          <AuthHeader />
          <form className="w-full flex flex-col gap-6 text-sm">
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
                  className="bg-gray-200 text-[13px] px-3 py-2 rounded cursor-pointer"
                >
                  인증번호 전송
                </button>
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 mt-1">
                  올바른 이메일 주소를 입력해주세요.
                </p>
              )}
            </InputRow>

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
              {errors.code && (
                <p className="text-[11px] text-red-500 mt-1">
                  인증번호를 다시 확인해주세요.
                </p>
              )}
            </InputRow>

            <InputRow label="아이디" required>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full border border-gray-400 rounded px-3 py-2 text-[13px]"
              />
              {errors.id && (
                <p className="text-[11px] text-red-500 mt-1">
                  이미 사용중인 아이디입니다.
                </p>
              )}
            </InputRow>

            <InputRow label="닉네임" required>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full border border-gray-400 rounded px-3 py-2 text-[13px]"
              />
              {errors.nickname && (
                <p className="text-[11px] text-red-500 mt-1">
                  중복된 닉네임입니다.
                </p>
              )}
            </InputRow>

            <InputRow label="이름" required>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-400 rounded px-3 py-2 text-[13px]"
              />
            </InputRow>

            <InputRow label="휴대폰">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="- 없이 숫자만"
                className="w-full border border-gray-400 rounded px-3 py-2 text-[13px]"
              />
            </InputRow>

            <InputRow label="생년월일">
              <div className="flex gap-2 w-full">
                <select
                  value={birth.year}
                  onChange={(e) => setBirth({ ...birth, year: e.target.value })}
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
                  onChange={(e) => setBirth({ ...birth, day: e.target.value })}
                  className="border border-gray-400 rounded px-2 py-2 text-[13px] w-1/3"
                >
                  <option value="">일</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d}>{String(d).padStart(2, "0")}</option>
                  ))}
                </select>
              </div>
            </InputRow>

            <InputRow label="비밀번호" required>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-400 rounded px-3 py-2 text-[13px]"
              />
              {errors.password && (
                <p className="text-[11px] text-red-500 mt-1">
                  비밀번호는 영문, 숫자, 특수문자를 모두 포함한 8~20자리를
                  입력해주세요.
                </p>
              )}
            </InputRow>

            <InputRow label="비밀번호 확인" required>
              <input
                type="password"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
                className="w-full border border-gray-400 rounded px-3 py-2 text-[13px]"
              />
              {errors.passwordCheck && (
                <p className="text-[11px] text-red-500 mt-1">
                  비밀번호를 다시 확인해주세요.
                </p>
              )}
            </InputRow>

            {/* 동의 체크박스 */}
            <div className="w-7/9 place-self-center mt-6 border-gray-200 pt-6 space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreements.all}
                  onChange={(e) => handleAllAgree(e.target.checked)}
                  className={`w-4 h-4 ${
                    agreements.all ? "accent-red-500" : "accent-gray-300"
                  }`}
                />
                <b>모두 동의하기</b>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreements.age}
                  onChange={(e) =>
                    setAgreements({ ...agreements, age: e.target.checked })
                  }
                  className={`w-3 h-3 ${
                    agreements.age ? "accent-red-500" : "accent-gray-300"
                  }`}
                />
                [필수] 만 14세 이상입니다.
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreements.provide}
                  onChange={(e) =>
                    setAgreements({ ...agreements, provide: e.target.checked })
                  }
                  className={`w-3 h-3 ${
                    agreements.provide ? "accent-red-500" : "accent-gray-300"
                  }`}
                />
                [필수] 개인정보 제공에 동의합니다.
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreements.collect}
                  onChange={(e) =>
                    setAgreements({ ...agreements, collect: e.target.checked })
                  }
                  className={`w-3 h-3 ${
                    agreements.collect ? "accent-red-500" : "accent-gray-300"
                  }`}
                />
                [필수] 개인정보 수집 및 이용에 동의합니다.
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreements.marketing}
                  onChange={(e) =>
                    setAgreements({
                      ...agreements,
                      marketing: e.target.checked,
                    })
                  }
                  className={`w-3 h-3 ${
                    agreements.marketing ? "accent-red-500" : "accent-gray-300"
                  }`}
                />
                [선택] 마케팅 활용 및 광고 수신에 동의합니다.
              </label>

              {errors.agreements && (
                <p className="text-[11px] text-red-500 mt-1">
                  필수 동의를 눌러주세요.
                </p>
              )}
            </div>

            <div className="text-center mt-10">
              <SubmitButton
                text="나의 냉장고 열어보기"
                onClick={handleSubmit}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

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
    <div className="w-7/9 mx-auto grid grid-cols-[112px_1fr] items-start gap-x-2 gap-y-0">
      {/* Label (항목 텍스트) */}
      <label className="text-[13px] font-semibold whitespace-nowrap leading-[38px]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input + Error (수직으로 쌓임) */}
      <div className="flex flex-col gap-1">
        {children}
      </div>
    </div>
  );
};

