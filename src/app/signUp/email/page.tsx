// src/app/signUp/email/page.tsx (예시 경로)
"use client";

import React, { useState, useEffect } from "react";
import {
  GenderRadioGroup,
  SubmitButton,
  TextInput,
} from "@/components/authFormComponents";
import ConfirmModal from "@/components/confirmModal";
import CustomDropdown from "@/components/customDropdown";
import { useSignup } from "@/features/auth/hooks/useSignup";
import { useCheckNickname } from "@/features/auth/hooks/useCheckNickname";
import { SignupRequestDto } from "@/features/auth/types";
import { useRouter } from "next/navigation";
import AgreementsSection, {
  AgreementsState,
} from "@/components/agreementSection";
import AuthPageLayout from "@/components/authPageLayout";

import {
  useCheckIdDuplication,
  useSendVerificationCode,
  useVerifyEmailCode,
} from "@/features/auth/hooks/useEmailVerification";

const EmailJoinPage: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [birth, setBirth] = useState({ year: "", month: "", day: "" });
  const [gender, setGender] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);
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

  const [agreements, setAgreements] = useState<AgreementsState>({
    all: false,
    age: false,
    provide: false,
    collect: false,
    marketing: false,
  });

  const { mutate: signupMutate, isPending } = useSignup();

  const {
    data: nicknameCheckResult,
    isFetching: isCheckingNickname,
    refetch: refetchNicknameCheck,
  } = useCheckNickname(nickname);

  const { mutate: checkIdDuplication, isPending: isCheckingId } =
    useCheckIdDuplication();

  const { mutate: sendVerificationCode, isPending: isSendingCode } =
    useSendVerificationCode();

  const { mutate: verifyEmailCode, isPending: isVerifyingCode } =
    useVerifyEmailCode();

  const handleIdCheck = () => {
    const normalizedId = id.trim();
    if (!normalizedId) {
      alert("아이디를 입력해주세요.");
      return;
    }

    checkIdDuplication(normalizedId, {
      onSuccess: () => {
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

  const CURRENT_YEAR = new Date().getFullYear();
  const YEAR_START = 1900;
  const yearOptions = Array.from(
    { length: CURRENT_YEAR - YEAR_START + 1 },
    (_, i) => String(YEAR_START + i)
  );

  const handleSubmit = () => {
    const newErrors = {
      email: !email.includes("@") || !isEmailVerified,
      id: !id.trim() || !isIdChecked,
      nickname: !nickname.trim() || !isNicknameChecked,
      gender: !gender,
      code: !isEmailVerified,
      password: !isPasswordValid(password),
      passwordCheck: password !== passwordCheck,
      agreements: !agreements.age || !agreements.provide || !agreements.collect,
      name: !name.trim(),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

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
      nickname,
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
    agreements.all,
  ]);

  return (
    <AuthPageLayout
      title="회원가입"
      description={`마케터의 냉장고에 처음 오셨군요!\n신선한 마케팅 아이디어를 꺼내보기 전에 먼저 나만의 냉장고를 만들어보세요.`}
    >
      <form
        className="flex w-full px-2 md:px-0 flex-col gap-6 text-sm items-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="w-full md:w-7/9 mb-10 flex flex-col items-center gap-y-4">
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
              options={yearOptions}
              onSelect={(val) => setBirth((prev) => ({ ...prev, year: val }))}
              buttonClassName="rounded-lg border-[#C2C2C2]"
            />
            <CustomDropdown
              label="월"
              options={Array.from({ length: 12 }, (_, i) =>
                String(i + 1).padStart(2, "0")
              )}
              onSelect={(val) => setBirth((prev) => ({ ...prev, month: val }))}
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
            error={errors.passwordCheck ? "비밀번호를 다시 확인해주세요." : ""}
            className="rounded-lg"
          />

          <AgreementsSection
            agreements={agreements}
            onChange={setAgreements}
            showError={errors.agreements}
          />
        </div>
      </form>
      <div className="justify-self-center w-full md:w-11/12 text-center ">
        <SubmitButton
          type="submit"
          text={isPending ? "가입 중..." : "나의 냉장고 열어보기"}
          disabled={isPending}
        />
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          router.push("/login");
        }}
      >
        <p className="text-lg font-semibold text-gray-800 mb-3">
          가입이 완료되었어요!
        </p>
        <p className="text-sm text-gray-500">
          지금 바로 마케터의 냉장고를 시작해보세요.
        </p>
      </ConfirmModal>
    </AuthPageLayout>
  );
};

export default EmailJoinPage;

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
      <label className="justify-self-start text-[14px] sm:text-[14.5px] font-medium whitespace-nowrap mb-1 sm:mb-0">
        {label}
        {required && <span className="text-red-500 "> *</span>}
      </label>
      <div className="place-self-center flex flex-1 flex-row w-full sm:pl-1 gap-1.5">
        {children}
      </div>
    </div>
  );
};
