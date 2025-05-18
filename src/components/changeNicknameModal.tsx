"use client";

import React, { useState } from "react";

type Props = {
  onClose: () => void;
};

export default function ChangeNicknameModal({ onClose }: Props) {
  const [nickname, setNickname] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const currentNickname = "마케터";
  const email = "a123456789@gmail.com";

  const handleDuplicateCheck = () => {
    // 닉네임 중복 검사 로직을 넣어주세요
    setIsDuplicate(nickname === "애플테크"); // 예시
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-[460px] rounded-2xl relative py-8 px-6 sm:px-8">
        {/* 닫기 버튼 */}
        <button
          className="absolute  top-4 right-4 text-black text-3xl"
          onClick={onClose}
        >
          ×
        </button>

        {/* 캐릭터 이미지 */}
        <div className="flex flex-col items-center">
          <img
            src="/images/profile-character.png"
            alt="프로필"
            className="w-28 h-28 rounded-full border border-red-400"
          />
          <button className="mt-2 text-xs text-white bg-red-400 rounded-full px-4 py-1">
            사진 수정
          </button>
        </div>

        {/* 좌우 여백 없이 구분선 */}
        <div className="relative my-6 -mx-6 sm:-mx-8">
          <div className="h-[1px] bg-red-300 w-full" />
        </div>

        <div className="space-y-5 text-sm">
          {/* 계정 */}
          <div className="flex items-center">
            <label className="w-28 font-bold text-sm shrink-0">계정</label>
            <input
              type="text"
              value={email}
              disabled
              className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 text-sm"
            />
          </div>

          {/* 현재 닉네임 */}
          <div className="flex items-center">
            <label className="w-28 font-bold text-sm shrink-0">
              현재 닉네임
            </label>
            <input
              type="text"
              value={currentNickname}
              disabled
              className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 text-sm"
            />
          </div>

          {/* 닉네임 변경 */}
          <div>
            <div className="flex items-center mb-2">
              <label className="w-28 font-bold text-sm shrink-0">
                닉네임 변경
              </label>
              <div className="flex-1 flex gap-2">
                <div className="relative flex flex-row items-center">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className=" flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm"
                    maxLength={8}
                  ></input>
                  {/* 글자 수 표시 */}
                  <div className="absolute right-2 text-center flex justify-end  text-[11px] text-gray-400 ">
                    {nickname.length}/8
                  </div>
                </div>
                <button
                  onClick={handleDuplicateCheck}
                  className="bg-gray-300 px-2 py-1 rounded-lg text-sm shrink-0"
                >
                  중복확인
                </button>
              </div>
            </div>

            <div className="pl-28 text-xs text-gray-500">
              닉네임은 최소 2~8자로 작성해주세요.
            </div>
            {isDuplicate && (
              <div className="pl-28 text-xs text-red-500 font-semibold mt-1">
                중복되는 닉네임입니다.
              </div>
            )}
          </div>
        </div>

        {/* 확인 버튼 */}
        <div className="mt-10 text-center">
          <button className="bg-red-500 text-xs text-white font-semibold rounded-full px-6 py-1 hover:bg-red-600">
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
