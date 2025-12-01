"use client";

import {
  AuthHeader,
  GenderRadioGroup,
  SubmitButton,
  TextInput,
} from "@/components/authFormComponents";
import ConfirmModal from "@/components/confirmModal";
import Header from "@/components/header";
import React, { useState, useEffect } from "react";
import CustomDropdown from "@/components/customDropdown";
import MobileMenu from "@/components/mobileMenu";
import { useSignup } from "@/features/auth/hooks/useSignup";
import { useCheckNickname } from "@/features/auth/hooks/useCheckNickname";
import { SignupRequestDto } from "@/features/auth/types";
import { useRouter } from "next/navigation";

// ✅ 새 훅들
import {
  useCheckIdDuplication,
  useSendVerificationCode,
  useVerifyEmailCode,
} from "@/features/auth/hooks/useEmailVerification";

export default function EmailJoinPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [birth, setBirth] = useState({ year: "", month: "", day: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [gender, setGender] = useState("");

  // ✅ 상태 플래그
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 완료 여부
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 발송 여부
  const [isIdChecked, setIsIdChecked] = useState(false); // 아이디 중복확인 완료 여부
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  const [errors, setErrors] = useState({
    email: false,
    id: false,
    nickname: false,
    gender: false,
    code: false,
    password: false,
    passwordCheck: false,
    agreements: false,
    name: false,
  });

  const [agreements, setAgreements] = useState({
    all: false,
    age: false,
    provide: false,
    collect: false,
    marketing: false,
  });

  const { mutate: signupMutate, isPending } = useSignup();

  // ✅ 닉네임 중복 체크 훅 (기존 그대로)
  const {
    data: nicknameCheckResult,
    isFetching: isCheckingNickname,
    refetch: refetchNicknameCheck,
  } = useCheckNickname(nickname);

  // ✅ 아이디 중복 체크 훅
  const { mutate: checkIdDuplication, isPending: isCheckingId } =
    useCheckIdDuplication();

  // ✅ 인증코드 발송 훅
  const { mutate: sendVerificationCode, isPending: isSendingCode } =
    useSendVerificationCode();

  // ✅ 이메일 + 코드 검증 훅
  const { mutate: verifyEmailCode, isPending: isVerifyingCode } =
    useVerifyEmailCode();

  // ✅ 아이디 중복 확인 버튼
  const handleIdCheck = () => {
    const normalizedId = id.trim();
    if (!normalizedId) {
      alert("아이디를 입력해주세요.");
      return;
    }

    checkIdDuplication(normalizedId, {
      onSuccess: () => {
        // 200이면 사용 가능, 400이면 onError로 빠진다고 가정
        alert("사용 가능한 아이디입니다 ✅");
        setIsIdChecked(true);
        setErrors((prev) => ({ ...prev, id: false }));
      },
      onError: (error: any) => {
        if (error?.response?.status === 400) {
          alert("이미 사용 중인 아이디입니다 ❌");
        } else {
          alert("아이디 중복 확인 중 오류가 발생했습니다.");
        }
        setIsIdChecked(false);
        setErrors((prev) => ({ ...prev, id: true }));
      },
    });
  };

  // ✅ 인증번호 발송 버튼
  const handleSendCode = () => {
    if (!email.includes("@")) {
      alert("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    sendVerificationCode(email, {
      onSuccess: () => {
        alert("인증번호가 발송되었습니다 ✅");
        setIsCodeSent(true);
        setIsEmailVerified(false);
        setErrors((prev) => ({ ...prev, email: false, code: false }));
      },
      onError: () => {
        alert("인증번호 발송 중 오류가 발생했습니다.");
        setIsCodeSent(false);
      },
    });
  };

  // ✅ 이메일 인증(코드 검증) 버튼
  const handleVerifyCode = () => {
    const trimmedCode = code.trim();
    if (!email.includes("@")) {
      alert("이메일 주소를 먼저 입력해주세요.");
      return;
    }
    if (!trimmedCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    verifyEmailCode(
      { email, code: trimmedCode },
      {
        onSuccess: () => {
          alert("이메일 인증이 완료되었습니다 ✅");
          setIsEmailVerified(true);
          setErrors((prev) => ({ ...prev, email: false, code: false }));
        },
        onError: () => {
          alert("인증번호가 올바르지 않습니다 ❌");
          setIsEmailVerified(false);
          setErrors((prev) => ({ ...prev, code: true }));
        },
      }
    );
  };

  // ✅ 닉네임 중복 확인 버튼 (기존 로직 유지)
  const handleNicknameCheck = async () => {
    const normalized = (nickname ?? "").trim();
    if (!normalized) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    try {
      const { data } = await refetchNicknameCheck();
      const result = (data ?? "").toString().trim();
      if (result === "Failed") {
        alert("이미 사용 중인 닉네임입니다 ❌");
        setIsNicknameChecked(false);
      } else {
        alert("사용 가능한 닉네임입니다 ✅");
        setIsNicknameChecked(true);
      }
    } catch {
      alert("닉네임 중복 확인 중 오류가 발생했습니다.");
      setIsNicknameChecked(false);
    }
  };

  // 입력 변경 시 플래그 초기화
  useEffect(() => {
    setIsNicknameChecked(false);
  }, [nickname]);

  useEffect(() => {
    setIsIdChecked(false);
  }, [id]);

  useEffect(() => {
    setIsEmailVerified(false);
    setIsCodeSent(false);
  }, [email]);

  useEffect(() => {
    setIsEmailVerified(false);
  }, [code]);

  const isPasswordValid = (pwd: string) =>
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^\w\s]).{8,20}$/.test(pwd);

  const handleSubmit = () => {
    const newErrors = {
      email: !email.includes("@") || !isEmailVerified, // 이메일 + 인증 완료 필수
      id: !id.trim() || !isIdChecked, // 아이디 입력 + 중복 확인 필수
      nickname: !nickname.trim() || !isNicknameChecked,
      gender: !gender,
      code: !isEmailVerified, // 코드 자체보다는 '인증 완료' 여부를 체크
      password: !isPasswordValid(password),
      passwordCheck: password !== passwordCheck,
      agreements: !agreements.age || !agreements.provide || !agreements.collect,
      name: !name.trim(),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    // 🔹 생년월일은 모두 선택됐을 때만 문자열로 만들어서 보내기
    const birthday =
      birth.year && birth.month && birth.day
        ? `${birth.year}-${birth.month}-${birth.day}`
        : undefined;

    const signupData: SignupRequestDto = {
      id,
      pw: password,
      email,
      name,
      birthday,
      nickname, // 🔥 약관 동의 값들 추가
      over14: agreements.age,
      agreeProvidePersonalInfo: agreements.provide,
      agreeCollectPersonalInfo: agreements.collect,
      agreeMarketing: agreements.marketing,
    };

    signupMutate(signupData, {
      onSuccess: () => setModalOpen(true),
      onError: () =>
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요."),
    });
  };

  // ✅ 전체 동의 체크 동기화
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
  ]);

  const handleAllAgree = (checked: boolean) => {
    setAgreements({
      all: checked,
      age: checked,
      provide: checked,
      collect: checked,
      marketing: checked,
    });
  };

  return (
    <div className="w-full bg-white pt-18 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="w-full bg-white px-4 sm:px-6 md:px-8 min-h-[100svh] py-16 flex items-center justify-center">
        <div className="w-full max-w-[550px] self-center">
          <AuthHeader description="" />
          <form
            className="flex w-full px-2 md:px-0 flex-col gap-6 text-sm items-center"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {/* 이메일 + 인증번호 발송 */}
            <TextInput
              required
              label="이메일주소"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={
                errors.email
                  ? !email.includes("@")
                    ? "올바른 이메일 주소를 입력해주세요."
                    : "이메일 인증을 완료해주세요."
                  : ""
              }
              rightButtonText={
                isSendingCode
                  ? "전송 중..."
                  : isCodeSent
                  ? "재전송"
                  : "인증번호 전송"
              }
              onRightButtonClick={handleSendCode}
              className="rounded-lg"
            />

            {/* 인증번호 + 이메일 검증 */}
            <TextInput
              required
              label="인증번호"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={errors.code ? "인증번호를 다시 확인해주세요." : ""}
              rightButtonText={
                isVerifyingCode
                  ? "확인 중..."
                  : isEmailVerified
                  ? "인증 완료"
                  : "인증하기"
              }
              onRightButtonClick={handleVerifyCode}
              className="rounded-lg"
            />

            {/* 아이디 + 중복 확인 */}
            <TextInput
              required
              label="아이디"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              rightButtonText={
                isCheckingId
                  ? "확인 중..."
                  : isIdChecked
                  ? "확인 완료"
                  : "중복 확인"
              }
              onRightButtonClick={handleIdCheck}
              error={
                errors.id
                  ? !id.trim()
                    ? "아이디를 입력해주세요."
                    : "아이디 중복확인을 완료해주세요."
                  : ""
              }
              className="rounded-lg"
            />

            {/* 닉네임 + 중복확인 (기존 로직) */}
            <TextInput
              required
              label="닉네임"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              rightButtonText={
                isCheckingNickname
                  ? "확인 중..."
                  : isNicknameChecked
                  ? "확인 완료"
                  : "중복 확인"
              }
              onRightButtonClick={handleNicknameCheck}
              error={
                errors.nickname
                  ? isNicknameChecked
                    ? "닉네임을 입력해주세요."
                    : "닉네임 중복확인을 완료해주세요."
                  : ""
              }
              className="rounded-lg"
            />

            {/* 이름 */}
            <TextInput
              required
              label="이름"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg"
              error={errors.name ? "이름을 입력해주세요." : ""}
            />

            <GenderRadioGroup
              value={gender}
              onChange={setGender}
              required
              error={errors.gender ? "성별을 선택해주세요." : ""}
            />

            <InputRow label="생년월일" required>
              <CustomDropdown
                label="년도"
                options={Array.from({ length: 50 }, (_, i) => String(1980 + i))}
                onSelect={(val) => setBirth((prev) => ({ ...prev, year: val }))}
                buttonClassName="rounded-lg border-[#C2C2C2]"
              />
              <CustomDropdown
                label="월"
                options={Array.from({ length: 12 }, (_, i) =>
                  String(i + 1).padStart(2, "0")
                )}
                onSelect={(val) =>
                  setBirth((prev) => ({ ...prev, month: val }))
                }
                buttonClassName="rounded-lg border-[#C2C2C2]"
              />
              <CustomDropdown
                label="일"
                options={Array.from({ length: 31 }, (_, i) =>
                  String(i + 1).padStart(2, "0")
                )}
                onSelect={(val) => setBirth((prev) => ({ ...prev, day: val }))}
                buttonClassName="rounded-lg border-[#C2C2C2]"
              />
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
            <div className="w-11/12 sm:w-7/9 place-self-center mt-6 border-gray-200 pt-6 space-y-2 text-sm">
              {[
                { key: "all", text: "모두 동의하기", bold: true },
                { key: "age", text: "[필수] 만 14세 이상입니다." },
                { key: "provide", text: "[필수] 개인정보 제공에 동의합니다." },
                {
                  key: "collect",
                  text: "[필수] 개인정보 수집 및 이용에 동의합니다.",
                },
                {
                  key: "marketing",
                  text: "[선택] 마케팅 활용 및 광고 수신에 동의합니다.",
                },
              ].map(({ key, text, bold }) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={agreements[key as keyof typeof agreements]}
                    onChange={(e) => {
                      if (key === "all") handleAllAgree(e.target.checked);
                      else
                        setAgreements((prev) => ({
                          ...prev,
                          [key]: e.target.checked,
                        }));
                    }}
                    className="w-3 h-3 accent-red-500"
                  />
                  {bold ? <b>{text}</b> : text}
                </label>
              ))}
              {errors.agreements && (
                <p className="text-[11px] text-red-500 mt-1">
                  필수 동의를 눌러주세요.
                </p>
              )}
            </div>

            <div className="w-full text-center mt-10">
              <SubmitButton
                type="submit"
                text={isPending ? "가입 중..." : "나의 냉장고 열어보기"}
                disabled={isPending}
              />
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          router.push("/login");
        }}
      >
        <p className="text-lg font-semibold text-gray-800 mb-3">
          회원가입이 완료되었습니다 🎉
        </p>
        <p className="text-sm text-gray-500">이제 로그인해주세요!</p>
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
    <div className="place-self-center w-full max-w-[500px] flex flex-col sm:grid sm:grid-cols-[112px_1fr] items-start sm:items-center gap-y-1 sm:gap-x-2">
      <label className="justify-self-start text-[14px] sm:text-[14.5px] font-semibold whitespace-nowrap mb-1 sm:mb-0">
        {label}
        {required && <span className="text-red-500 "> *</span>}
      </label>
      <div className="place-self-center flex flex-1 flex-row w-full sm:pl-1 gap-1.5">
        {children}
      </div>
    </div>
  );
};
