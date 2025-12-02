// src/app/signUp/kakao/extra/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  SubmitButton,
  TextInput,
  GenderRadioGroup,
} from "@/components/authFormComponents";
import CustomDropdown from "@/components/customDropdown";
import ConfirmModal from "@/components/confirmModal";
import { useRouter } from "next/navigation";
import { updateKakaoExtraProfile } from "@/features/auth/api/authApi";
import { useCheckNickname } from "@/features/auth/hooks/useCheckNickname";
import AgreementsSection, {
  AgreementsState,
} from "@/components/agreementSection";
import AuthPageLayout from "@/components/authPageLayout";

// 생년월일 인풋 라인 공통 컴포넌트
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

const KakaoExtraSignUpPage: React.FC = () => {
  const router = useRouter();

  // 입력값
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState({ year: "", month: "", day: "" });
  const [gender, setGender] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // 약관 동의 상태
  const [agreements, setAgreements] = useState<AgreementsState>({
    all: false,
    age: false,
    provide: false,
    collect: false,
    marketing: false,
  });

  // 에러 상태
  const [errors, setErrors] = useState({
    name: false,
    nickname: false,
    birthday: false,
    gender: false,
    agreements: false,
  });

  // 닉네임 중복 확인 플래그
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  // 닉네임 중복 체크 훅
  const { isFetching: isCheckingNickname, refetch: refetchNicknameCheck } =
    useCheckNickname(nickname);

  // 카카오 콜백 정상 거쳤는지 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  // 전체 동의 동기화
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

  // 닉네임 중복 확인
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
        setErrors((prev) => ({ ...prev, nickname: true }));
      } else {
        alert("사용 가능한 닉네임입니다 ✅");
        setIsNicknameChecked(true);
        setErrors((prev) => ({ ...prev, nickname: false }));
      }
    } catch {
      alert("닉네임 중복 확인 중 오류가 발생했습니다.");
      setIsNicknameChecked(false);
      setErrors((prev) => ({ ...prev, nickname: true }));
    }
  };

  // 닉네임 변경 시 플래그 리셋
  useEffect(() => {
    setIsNicknameChecked(false);
  }, [nickname]);

  const handleSubmit = async () => {
    const hasBirth = birthday.year && birthday.month && birthday.day;
    const birthdayStr = `${birthday.year}-${birthday.month}-${birthday.day}`;

    const newErrors = {
      name: !name.trim(),
      nickname: !nickname.trim() || !isNicknameChecked,
      birthday: !hasBirth,
      gender: !gender,
      agreements: !(agreements.age && agreements.provide && agreements.collect),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인 정보가 없습니다. 다시 로그인 해주세요.");
      router.replace("/login");
      return;
    }

    try {
      setSubmitting(true);

      await updateKakaoExtraProfile(
        name.trim(),
        nickname.trim(),
        birthdayStr,
        gender,
        agreements.age,
        agreements.provide,
        agreements.collect,
        agreements.marketing
      );

      setModalOpen(true);
    } catch (error) {
      console.error(error);
      alert("회원가입 처리 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPageLayout
      title="추가 정보 입력"
      description={`마케터의 냉장고 이용을 위해\n추가 정보를 입력해주세요.`}
    >
      <form
        className="flex w-full px-2 md:px-0 flex-col gap-6 text-sm items-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="w-full md:w-7/9 mb-10 flex flex-col items-center gap-y-4">
          {/* 이름 */}
          <TextInput
            required
            label="이름"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name ? "이름을 입력해주세요." : ""}
            className="rounded-lg"
          />

          {/* 닉네임 + 중복확인 */}
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
                ? !nickname.trim()
                  ? "닉네임을 입력해주세요."
                  : "닉네임 중복확인을 완료해주세요."
                : ""
            }
            className="rounded-lg"
          />

          {/* 생년월일 (드롭다운) */}
          <InputRow label="생년월일" required>
            <CustomDropdown
              label="년도"
              options={Array.from({ length: 50 }, (_, i) => String(1980 + i))}
              onSelect={(v) => setBirthday((prev) => ({ ...prev, year: v }))}
              buttonClassName="rounded-lg border-[#C2C2C2]"
            />

            <CustomDropdown
              label="월"
              options={Array.from({ length: 12 }, (_, i) =>
                String(i + 1).padStart(2, "0")
              )}
              onSelect={(v) => setBirthday((prev) => ({ ...prev, month: v }))}
              buttonClassName="rounded-lg border-[#C2C2C2]"
            />

            <CustomDropdown
              label="일"
              options={Array.from({ length: 31 }, (_, i) =>
                String(i + 1).padStart(2, "0")
              )}
              onSelect={(v) => setBirthday((prev) => ({ ...prev, day: v }))}
              buttonClassName="rounded-lg border-[#C2C2C2]"
            />
          </InputRow>

          {errors.birthday && (
            <p className="text-[11px] text-red-500 self-start px-2">
              생년월일을 선택해주세요.
            </p>
          )}

          {/* 성별 */}
          <GenderRadioGroup
            value={gender}
            onChange={setGender}
            required
            error={errors.gender ? "성별을 선택해주세요." : ""}
          />

          {/* 약관 동의 섹션 */}
          <AgreementsSection
            agreements={agreements}
            onChange={setAgreements}
            showError={errors.agreements}
          />
        </div>
      </form>
      <div className="justify-self-center w-full md:w-11/12 text-center ">
        <SubmitButton
          text={submitting ? "처리 중..." : "회원가입 완료하기"}
          type="submit"
        />
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          router.replace("/");
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

export default KakaoExtraSignUpPage;
