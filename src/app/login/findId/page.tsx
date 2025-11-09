"use client";

import Header from "@/components/header";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthHeader,
  TextInput,
  SubmitButton,
} from "@/components/authFormComponents";
import MobileMenu from "@/components/mobileMenu";
import { useFindId } from "@/features/auth/hooks/useFindId"; // ✅ 커스텀 훅 import

const FindIdPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const router = useRouter();

  // ✅ useFindId 훅 사용
  const {
    data: foundData,
    isFetching,
    isError,
    refetch,
  } = useFindId(name, email);

  const handleFindId = async () => {
    if (!name.trim() || !email.trim()) {
      alert("이름과 이메일을 모두 입력해주세요.");
      return;
    }

    setShowResult(false);
    await refetch(); // ✅ 수동 실행
    setShowResult(true);
  };

  const foundId = foundData?.id ?? null;
  const notFound = showResult && !foundId && !isFetching && !isError;

  return (
    <div className="bg-white pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="flex justify-center bg-white py-[16vh] px-4">
        <div className="w-full max-w-[480px] flex flex-col items-center">
          <AuthHeader
            title="아이디 찾기"
            description={`아이디가 기억나지 않으세요?
걱정 마세요, 금방 찾아드릴게요.`}
          />

          {/* 입력 필드 */}
          <div className="w-8/9 md:w-7/9 mb-10 flex flex-col items-center gap-y-4 ">
            <TextInput
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextInput
              label="이메일주소"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <SubmitButton
            text={isFetching ? "조회 중..." : "내 아이디 찾기"}
            onClick={handleFindId}
          />

          {/* ✅ 조회 결과 표시 */}
          {showResult && foundId && (
            <div className="relative max-w-[480px] flex-col my-10 text-center w-full">
              <p className="text-lg font-semibold pb-10">
                내 아이디:{" "}
                <span className="text-black font-bold text-xl">{foundId}</span>
              </p>
              <div className="w-full flex flex-row gap-4">
                <SubmitButton
                  text="로그인 하기"
                  onClick={() => router.push("/login")}
                  fullWidth={false}
                  className="flex-1"
                />
                <SubmitButton
                  text="비밀번호 찾기"
                  onClick={() => router.push("/login/findPwd")}
                  variant="outline"
                  color="#FF4545"
                  fullWidth={false}
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {notFound && (
            <div className="max-w-[480px] mt-10 text-center w-full">
              <p className="text-base text-black font-medium">
                일치하는 회원 정보가 없습니다.
              </p>
              <div className="mt-10">
                <SubmitButton
                  text="회원가입"
                  onClick={() => router.push("/signUp")}
                  fullWidth
                  variant="outline"
                  color="#FF4545"
                  className="text-red-500"
                />
              </div>
            </div>
          )}

          {isError && (
            <p className="text-sm text-red-500 mt-5">
              아이디 찾기 중 오류가 발생했습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindIdPage;
