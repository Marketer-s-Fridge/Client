"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import MobileMenu from "@/components/mobileMenu";
import {
  AuthHeader,
  SubmitButton,
  TextInput,
  GenderRadioGroup,
} from "@/components/authFormComponents";
import CustomDropdown from "@/components/customDropdown";
import ConfirmModal from "@/components/confirmModal";
import { useRouter } from "next/navigation";
import axios from "axios"; // ✅ apiClient 대신 axios 직접 사용

// EmailJoinPage에서 사용한 것처럼 InputRow 따로 뺌
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
  const [menuOpen, setMenuOpen] = useState(false);

  // 입력값
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState({ year: "", month: "", day: "" });
  const [gender, setGender] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // 에러 상태
  const [errors, setErrors] = useState({
    name: false,
    nickname: false,
    birthday: false,
    gender: false,
  });

  // 카카오 콜백을 정상적으로 거쳤는지 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const handleSubmit = async () => {
    const hasBirth = birthday.year && birthday.month && birthday.day;
    const birthdayStr = `${birthday.year}-${birthday.month}-${birthday.day}`;

    const newErrors = {
      name: !name.trim(),
      nickname: !nickname.trim(),
      birthday: !hasBirth,
      gender: !gender,
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

      // ✅ apiClient 대신 axios로 직접 요청
      await axios.patch(
        "/auth/profile",
        {
          name: name.trim(),
          nickname: nickname.trim(),
          birthday: birthdayStr, // ← 여기
          gender,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    <div className="w-full bg-white pt-18 md:pt-0 min-h-[100svh]">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="w-full bg-white px-4 sm:px-6 md:px-8 min-h-[100svh] py-16 flex items-center justify-center">
        <div className="w-full max-w-[550px] self-center">
          <AuthHeader
            title="추가 정보 입력"
            description={`마케터의 냉장고 이용을 위해\n추가 정보를 입력해주세요.`}
          />

          <form
            className="flex w-full px-2 md:px-0 flex-col gap-6 text-sm items-center mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
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

            {/* 닉네임 */}
            <TextInput
              required
              label="닉네임"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              error={errors.nickname ? "닉네임을 입력해주세요." : ""}
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

            <div className="w-full text-center mt-8">
              <SubmitButton
                text={submitting ? "처리 중..." : "회원가입 완료하기"}
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>

      {/* 완료 모달 */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          router.replace("/");
        }}
      >
        <p className="text-lg font-semibold text-gray-800 mb-3">
          회원가입이 완료되었습니다 🎉
        </p>
        <p className="text-sm text-gray-500">즐거운 시간 보내세요!</p>
      </ConfirmModal>
    </div>
  );
};

export default KakaoExtraSignUpPage;
