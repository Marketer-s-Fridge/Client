"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

type Props = {
  onClose: () => void;
};

export default function ChangeNicknameModal({ onClose }: Props) {
  const [nickname, setNickname] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    "/images/profile-character.png"
  ); // ✅ 초기 이미지
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentNickname = "마케터";
  const email = "a123456789@gmail.com";

  const handleDuplicateCheck = () => {
    setIsDuplicate(nickname === "애플테크"); // 예시
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl); // ✅ 미리보기 반영
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click(); // ✅ 숨겨진 input 실행
  };

  return (
    <div className="text-black fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-[460px] rounded-2xl relative py-8 px-6 sm:px-8">
        {/* 닫기 버튼 */}
        <button
          className="absolute cursor-pointer top-4 right-4 text-black"
          onClick={onClose}
        >
          <Image
            src="/icons/close.png"
            alt="닫기"
            width={20}
            height={20}
            className="w-5 h-5"
          />
        </button>

        {/* 프로필 이미지 & 수정 */}
        <div className="flex flex-col items-center">
          <Image
            src={previewImage}
            alt="프로필"
            className="w-28 h-28 rounded-full border border-red-400 object-cover"
            width={300}
            height={300}
          />
          <button
            type="button"
            onClick={handleFileSelect}
            className="cursor-pointer mt-3 text-xs text-white bg-red-500 rounded-full px-3 py-1 hover:bg-red-600"
          >
            사진 수정
          </button>
          {/* 숨겨진 input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* 좌우 여백 없는 구분선 */}
        <div className="relative my-7 -mx-6 sm:-mx-8">
          <div className="h-[2px] bg-red-400 w-full" />
        </div>

        <div className="flex-col flex flex-1 space-y-3.5 text-sm px-5">
          {/* 계정 */}
          <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-0">
            <label className="w-28 font-bold text-sm shrink-0">계정</label>
            <input
              type="text"
              value={email}
              disabled
              className="flex flex-1 w-full bg-white text-gray-400 border border-gray-300 rounded-lg px-3 py-1.5 text-md"
            />
          </div>

          {/* 현재 닉네임 */}
          <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-0">
            <label className="w-28 font-bold text-sm shrink-0">
              현재 닉네임
            </label>
            <input
              type="text"
              value={currentNickname}
              disabled
              className="flex flex-1 w-full bg-white text-gray-400 border border-gray-300 rounded-lg px-3 py-1.5 text-md"
            />
          </div>

          {/* 닉네임 변경 */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center mb-2 gap-2 sm:gap-0">
              <label className="w-28 font-bold text-md shrink-0">
                닉네임 변경
              </label>
              <div className="flex-1 flex gap-2">
                <div className="relative w-full flex flex-row items-center">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="flex-1 w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    maxLength={8}
                  />
                  <div className="absolute right-2 text-center flex justify-end text-[11px] text-gray-400">
                    {nickname.length}/8
                  </div>
                </div>
                <button
                  onClick={handleDuplicateCheck}
                  className="cursor-pointer bg-gray-300 px-2 py-1 rounded-lg text-xs shrink-0"
                >
                  중복확인
                </button>
              </div>
            </div>

            <div className="pl-0 sm:pl-28 text-[10px] text-gray-500">
              닉네임은 최소 2~8자로 작성해주세요.
            </div>
            {isDuplicate && (
              <div className="pl-0 sm:pl-28 text-xs text-red-500 font-semibold mt-1">
                중복되는 닉네임입니다.
              </div>
            )}
          </div>
        </div>

        {/* 확인 버튼 */}
        <div className="mt-10 text-center">
          <button className="cursor-pointer bg-red-500 text-xs text-white font-medium rounded-full px-6 py-1 hover:bg-red-600">
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
