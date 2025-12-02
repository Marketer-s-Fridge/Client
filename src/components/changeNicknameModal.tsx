"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useAuthStatus } from "@/features/auth/hooks/useAuthStatus";
import { useCheckNickname } from "@/features/auth/hooks/useCheckNickname";
import { useUpdateNickname } from "@/features/auth/hooks/useUpdateNickname";
import { useUpdateProfileImage } from "@/features/auth/hooks/useUpdateProfileImage";
import { useQueryClient } from "@tanstack/react-query";
import { useImageUpload } from "@/features/posts/hooks/useImageUpload";
// import { useImageUpload } from "@/hooks/useImageUpload"; // ✅ S3 업로드 훅

type Props = { onClose: () => void; onUpdated?: () => void };

export default function ChangeNicknameModal({ onClose, onUpdated }: Props) {
  const { user, isAuthenticated } = useAuthStatus();

  const initialNickname = user?.nickname ?? user?.name ?? "";
  const initialEmail = user?.email ?? "";
  const initialAvatar =
    (user as any)?.profileImageUrl || "/images/profile-character.png";

  const [nickname, setNickname] = useState(initialNickname);
  const [previewImage, setPreviewImage] = useState<string>(initialAvatar);
  const [fileObj, setFileObj] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 닉네임 유효성
  const nickLen = nickname.trim().length;
  const nickValid = nickLen >= 2 && nickLen <= 8;

  const nicknameChanged = useMemo(
    () => nickname.trim() !== initialNickname,
    [nickname, initialNickname]
  );
  const avatarChanged = useMemo(
    () => previewImage !== initialAvatar,
    [previewImage, initialAvatar]
  );

  const queryClient = useQueryClient();

  // 닉네임 중복 체크 훅
  const {
    data: dupRaw,
    refetch: refetchDup,
    isFetching: dupLoading,
  } = useCheckNickname(nickname);

  // 서버 응답 문자열 → 중복 여부 해석
  const dupOk = useMemo(() => {
    if (dupRaw == null) return null as null | boolean;
    const lower = String(dupRaw).toLowerCase();
    const isDuplicate =
      lower.includes("fail") ||
      lower.includes("exist") ||
      lower.includes("duplicate") ||
      lower.includes("중복");
    return !isDuplicate; // true면 사용 가능
  }, [dupRaw]);

  // 닉 입력 바뀌면 이전 dup 결과 리셋
  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["nicknameDup", nickname] });
  }, [nickname, queryClient]);

  // 닉네임 변경 훅
  const { mutateAsync: mutateNickname, isPending: nickSaving } =
    useUpdateNickname();

  // 프로필 이미지 변경 훅(이미지 URL 필요)
  const { mutateAsync: mutateAvatar, isPending: avatarSaving } =
    useUpdateProfileImage();

  // S3 업로드 훅
  // const { uploadSingle, loading: uploadingAvatar } = useImageUpload();
  const { mutateAsync: uploadAvatar, isPending: uploadingAvatar } =
    useImageUpload();

  const handleDuplicateCheck = async () => {
    if (!nickValid) {
      alert("닉네임은 2~8자여야 합니다.");
      return;
    }
    await refetchDup();
  };

  const handleFileSelect = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileObj(file);
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!nicknameChanged && !avatarChanged) {
      onClose();
      return;
    }

    // 닉네임 변경이 포함되면 중복 확인 강제
    if (nicknameChanged) {
      if (!nickValid) {
        alert("닉네임은 2~8자여야 합니다.");
        return;
      }
      if (dupOk !== true) {
        const now = await refetchDup();
        const lower = String(now.data ?? "").toLowerCase();
        const duplicate =
          lower.includes("fail") ||
          lower.includes("exist") ||
          lower.includes("duplicate") ||
          lower.includes("중복");
        if (duplicate) {
          alert("중복되는 닉네임입니다.");
          return;
        }
      }
    }

    try {
      // 1) 아바타 변경: S3 업로드 후 URL을 mutateAvatar에 전달
      // if (avatarChanged && fileObj) {
      //   const imageUrl = await uploadSingle(fileObj);
      //   await mutateAvatar(imageUrl);
      // }
      if (avatarChanged && fileObj) {
        const imageUrl = await uploadAvatar(fileObj); // File -> string(URL)
        await mutateAvatar(imageUrl);
      }

      // 2) 닉네임 변경
      if (nicknameChanged) {
        await mutateNickname(nickname.trim());
      }

      onUpdated?.();
      onClose();
    } catch (e: any) {
      alert(e?.message || "프로필 갱신 실패");
    }
  };

  const submitting = nickSaving || avatarSaving || uploadingAvatar;

  return (
    <div className="text-black fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-[460px] rounded-2xl relative py-8 px-6 sm:px-8">
        {/* 닫기 */}
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

        {/* 프로필 이미지 */}
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
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* 구분선 */}
        <div className="relative my-7 -mx-6 sm:-mx-8">
          <div className="h-[2px] bg-red-400 w-full" />
        </div>

        {/* 폼 */}
        <div className="flex-col flex flex-1 space-y-3.5 text-sm px-5">
          {/* 계정 */}
          <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-0">
            <label className="w-28 font-bold text-sm shrink-0">계정</label>
            <input
              type="text"
              value={initialEmail}
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
              value={initialNickname}
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
                  disabled={!nickValid || !nicknameChanged || dupLoading}
                  className="cursor-pointer bg-gray-300 px-2 py-1 rounded-lg text-xs shrink-0 disabled:opacity-50"
                >
                  {dupLoading ? "확인중..." : "중복확인"}
                </button>
              </div>
            </div>

            <div className="pl-0 sm:pl-28 text-[10px] text-gray-500">
              닉네임은 최소 2~8자로 작성해주세요.
            </div>
            {dupOk === false && (
              <div className="pl-0 sm:pl-28 text-xs text-red-500 font-semibold mt-1">
                중복되는 닉네임입니다.
              </div>
            )}
            {dupOk === true && nicknameChanged && (
              <div className="pl-0 sm:pl-28 text-xs text-green-600 font-semibold mt-1">
                사용 가능한 닉네임입니다.
              </div>
            )}
          </div>
        </div>

        {/* 확인 버튼 */}
        <div className="mt-2 flex justify-center w-full">
          <button
            onClick={handleSubmit}
            disabled={submitting || (!nicknameChanged && !avatarChanged)}
            className="
            cursor-pointer
            w-full              /* 모바일: 가득 */
            py-2
            bg-red-500 text-white
            text-[13px] sm:text-[12.5px] font-medium
            rounded-lg
            hover:bg-red-600
            transition
            sm:w-auto
            sm:px-9        /* ≥640px: 짧은 버튼 */
            sm:py-0.5             /* 데스크탑에서는 살짝 얇게 */
          "
          >
            {submitting ? "저장 중..." : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}
