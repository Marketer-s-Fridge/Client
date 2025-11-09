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
import { useFindPwd } from "@/features/auth/hooks/useFindPwd";

const FindPwdPage: React.FC = () => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const router = useRouter();

  const {
    data: pwResult,
    isFetching,
    isError,
    refetch,
  } = useFindPwd(name, userId, email);

  const handleFindAccount = async () => {
    if (!name.trim() || !userId.trim() || !email.trim()) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    setShowResult(false);
    const { data } = await refetch();
    setShowResult(true);

    // ✅ 서버가 200으로 "Successful" 또는 "Failed" 문자열을 반환한다는 전제
    if (data?.trim() === "Successful") {
      router.push("/login/findPwd/resetPwd");
    }
  };

  const notFound =
    showResult && pwResult?.trim() === "Failed" && !isFetching && !isError;

  return (
    <div className="bg-white pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="flex justify-center bg-white py-[16vh] px-4">
        <div className="w-full max-w-[480px] flex flex-col items-center">
          <AuthHeader
            title="비밀번호 찾기"
            description={`비밀번호가 기억나지 않으세요?
걱정 마세요, 금방 찾아드릴게요.`}
          />

          <div className="w-8/9 md:w-7/9 flex flex-col items-center gap-y-4 mb-10">
            <TextInput
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextInput
              label="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
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
            text={isFetching ? "조회 중..." : "다음 단계"}
            onClick={handleFindAccount}
          />

          {notFound && (
            <div className="w-full mt-10 text-center">
              <p className="text-base text-black font-medium">
                일치하는 회원 정보가 없습니다.
              </p>
              <div className="mt-10 flex gap-4 w-full">
                <SubmitButton
                  text="아이디 찾기"
                  onClick={() => router.push("/login/findId")}
                  fullWidth={false}
                  className="flex-1"
                />
                <SubmitButton
                  text="회원가입"
                  onClick={() => router.push("/signUp")}
                  variant="outline"
                  color="#FF4545"
                  fullWidth={false}
                  className="flex-1 text-red-500"
                />
              </div>
            </div>
          )}

          {isError && (
            <p className="text-sm text-red-500 mt-5">
              비밀번호 찾기 중 오류가 발생했습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindPwdPage;
