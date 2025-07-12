"use client";

import { AuthHeader, SubmitButton } from "@/components/authFormComponents";
import ConfirmModal from "@/components/confirmModal";
import Header from "@/components/header";
import React, { useState } from "react";
import { useEffect } from "react";
import { TextInput } from "@/components/authFormComponents";
import CustomDropdown from "@/components/customDropdown";
import MobileMenu from "@/components/mobileMenu";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    if (!hasError) {
      setModalOpen(true);
    }
  };

  // ✅ 필수 3개 체크 상태 감시하여 all 자동 반영
  useEffect(() => {
    const allChecked =
      agreements.age &&
      agreements.provide &&
      agreements.collect &&
      agreements.marketing;
    if (agreements.all !== allChecked) {
      setAgreements((prev) => ({ ...prev, all: allChecked }));
    }
  }, [
    agreements.age,
    agreements.provide,
    agreements.collect,
    agreements.marketing,
    agreements.all, // ✅ 추가!
  ]);

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
  console.log(birth); // 예시: 임시로라도 써주면 빌드 통과함

  return (
    <div className="bg-white">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="bg-white min-h-screen px-4 sm:px-6 md:px-8 py-16 flex justify-center">
        <div className="w-full max-w-[550px]">
          <AuthHeader />
          <form className="w-full flex flex-col gap-6 text-sm">
            <TextInput
              required
              label="이메일주소"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email ? "올바른 이메일 주소를 입력해주세요." : ""}
              rightButtonText="인증번호 전송"
              onRightButtonClick={() => alert("인증번호 전송!")}
              className="rounded-lg"
            />

            <TextInput
              required
              label="인증번호"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={errors.code ? "인증번호를 다시 확인해주세요." : ""}
              rightButtonText="인증 완료"
              onRightButtonClick={() => alert("인증 완료!")}
              className="rounded-lg"
            />

            <TextInput
              required
              label="아이디"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              rightButtonText="중복 확인"
              onRightButtonClick={() => alert("중복 확인 메세지 전송!")}
              error={errors.id ? "이미 사용중인 아이디입니다." : ""}
              className="rounded-lg"
            />

            <TextInput
              required
              label="닉네임"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              rightButtonText="중복 확인"
              onRightButtonClick={() => alert("중복 확인 메세지 전송!")}
              error={errors.nickname ? "중복된 닉네임입니다." : ""}
              className="rounded-lg"
            />

            <TextInput
              required
              label="이름"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg"
            />

            <TextInput
              label="휴대폰"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="- 없이 숫자만"
              className="rounded-lg"
            />

            <InputRow label="생년월일">
              <div className="flex gap-2 w-full">
                <CustomDropdown
                  label="년도"
                  options={Array.from({ length: 50 }, (_, i) =>
                    String(1980 + i)
                  )}
                  onSelect={(val) =>
                    setBirth((prev) => ({ ...prev, year: val }))
                  }
                  buttonClassName="rounded-lg"
                />
                <CustomDropdown
                  label="월"
                  options={Array.from({ length: 12 }, (_, i) =>
                    String(i + 1).padStart(2, "0")
                  )}
                  onSelect={(val) =>
                    setBirth((prev) => ({ ...prev, month: val }))
                  }
                  buttonClassName="rounded-lg"
                />
                <CustomDropdown
                  label="일"
                  options={Array.from({ length: 31 }, (_, i) =>
                    String(i + 1).padStart(2, "0")
                  )}
                  onSelect={(val) =>
                    setBirth((prev) => ({ ...prev, day: val }))
                  }
                  buttonClassName="rounded-lg"
                />
              </div>
            </InputRow>

            <TextInput
              required
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={
                errors.password
                  ? "비밀번호는 영문, 숫자, 특수문자를 모두 포함한 8~20자리를 입력해주세요."
                  : ""
              }
              className="rounded-lg"
            />

            <TextInput
              required
              label="비밀번호 확인"
              type="password"
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
              error={
                errors.passwordCheck ? "비밀번호를 다시 확인해주세요." : ""
              }
              className="rounded-lg"
            />

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
      <ConfirmModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <p>회원가입이 완료되었습니다.</p>
      </ConfirmModal>
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
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
};
