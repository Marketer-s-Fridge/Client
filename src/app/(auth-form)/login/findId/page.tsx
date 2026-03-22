// src/app/login/findId/page.tsx (경로는 프로젝트에 맞게)
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, SubmitButton } from "@/components/authFormComponents";
import { useFindId } from "@/features/auth/hooks/useFindId";
import AuthPageLayout from "@/components/authPageLayout";

const FindIdPage: React.FC = () => {
  const [name, setName] = useState("");
  const [emailRaw, setEmailRaw] = useState("");
  const [showResult, setShowResult] = useState(false);

  const email = emailRaw.trim().toLowerCase();
  const router = useRouter();

  const {
    data: foundData,
    isFetching,
    isError,
    refetch,
  } = useFindId(name, email);

  const handleFindId = async () => {
    if (!name.trim() || !email) {
      alert("이름과 이메일을 모두 입력해주세요.");
      return;
    }
    setShowResult(false);
    await refetch();
    setShowResult(true);
  };

  const foundId = foundData?.id ?? null;
  const notFound = showResult && !foundId && !isFetching && !isError;

  return (
    <AuthPageLayout
      title="아이디 찾기"
      description={`아이디가 기억나지 않으세요?\n걱정 마세요, 금방 찾아드릴게요.`}
    >
      <div className="relative w-full flex-col items-center  flex justify-self-center justify-center justify-items-center max-w-[450px]">
        <div className="w-full  md:w-7/9 mb-10 flex flex-col items-center gap-y-4 justify-self-center">
          <TextInput
            label="이름"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setShowResult(false);
            }}
            required
          />
          <TextInput
            label="이메일주소"
            type="email"
            value={emailRaw}
            onChange={(e) => {
              setEmailRaw(e.target.value);
              setShowResult(false);
            }}
            required
          />
        </div>

        <div className="flex w-full justify-center">
          <SubmitButton
            text={isFetching ? "조회 중..." : "내 아이디 찾기"}
            onClick={handleFindId}
            disabled={isFetching}
          />
        </div>

        {showResult && foundId && (
          <div className="w-full  mt-10 text-center">
            <p className="text-base text-black font-medium">
              내 아이디:{" "}
              <span className="text-black font-bold text-xl">{foundId}</span>
            </p>
            <div className="w-full flex flex-row gap-4">
              <SubmitButton
                text="로그인 하기"
                onClick={() => router.push("/login")}
                className="flex-1"
              />
              <SubmitButton
                text="비밀번호 찾기"
                onClick={() => router.push("/login/findPwd")}
                variant="outline"
                color="#FF4545"
                className="flex-1"
              />
            </div>
          </div>
        )}

        {notFound && (
          <div className="w-full  mt-10 text-center">
            <p className="text-base text-black font-medium">
              일치하는 회원 정보가 없습니다.
            </p>
            <div className="mt-10">
              <SubmitButton
                text="회원가입"
                onClick={() => router.push("/signUp")}
                variant="outline"
                color="#FF4545"
                className="text-red-500"
              />
            </div>
          </div>
        )}

        {isError && (
          <p className="text-sm  text-red-500 mt-5 text-center ">
            아이디 찾기 중 오류가 발생했습니다.
          </p>
        )}
      </div>
    </AuthPageLayout>
  );
};

export default FindIdPage;
