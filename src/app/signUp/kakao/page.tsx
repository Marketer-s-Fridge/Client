// pages/signUp/kakao.tsx
"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import MobileMenu from "@/components/mobileMenu";
import {
  AuthHeader,
  SubmitButton,
  TextInput,
} from "@/components/authFormComponents";
import { useRouter } from "next/navigation";
import api from "@/lib/apiClient";

const KakaoExtraSignUpPage: React.FC = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // 추가 정보 상태
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birth, setBirth] = useState(""); // YYYY-MM-DD
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER" | "">("");
  const [submitting, setSubmitting] = useState(false);

  // 카카오 콜백을 정상적으로 거쳤는지(토큰 유무) 확인
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      // 토큰 없으면 비정상 진입 → 로그인 페이지로 보냄
      router.replace("/login");
    }
  }, [router]);

  const handleSubmit = async () => {
    if (submitting) return; // 중복 제출 방지

    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!birth.trim()) {
      alert("생년월일을 입력해주세요. (예: 1995-01-23)");
      return;
    }

    if (!gender) {
      alert("성별을 선택해주세요.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/auth/profile", {
        name: name.trim(),
        nickname: nickname.trim(),
        birth,
        gender,
      });

      alert("회원가입이 완료되었습니다.");
      router.replace("/");
    } catch (error) {
      console.error(error);
      alert("회원가입 처리 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-18 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="flex justify-center px-4 py-16">
        <div className="w-full px-2 md:px-0 md:w-7/9 max-w-[550px] flex flex-col items-center">
          <AuthHeader
            title="추가 정보 입력"
            description={`마케터의 냉장고 이용을 위해\n추가 정보를 입력해주세요.`}
          />

          {/* 이름 */}
          <TextInput
            label="이름"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            className="mt-6"
          />

          {/* 닉네임 */}
          <TextInput
            label="닉네임"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
            className="mt-6"
          />

          {/* 생년월일 */}
          <TextInput
            label="생년월일"
            type="text"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            placeholder="1995-01-23"
            className="mt-6"
          />

          {/* 성별 */}
          <div className="w-full mt-6 mb-8">
            <p className="mb-2 text-sm font-semibold">성별</p>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="FEMALE"
                  checked={gender === "FEMALE"}
                  onChange={() => setGender("FEMALE")}
                />
                여성
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="MALE"
                  checked={gender === "MALE"}
                  onChange={() => setGender("MALE")}
                />
                남성
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="OTHER"
                  checked={gender === "OTHER"}
                  onChange={() => setGender("OTHER")}
                />
                기타
              </label>
            </div>
          </div>

          <SubmitButton
            text={submitting ? "처리 중..." : "회원가입 완료하기"}
            onClick={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
};

export default KakaoExtraSignUpPage;
