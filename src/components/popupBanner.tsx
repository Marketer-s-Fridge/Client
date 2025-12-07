"use client";

import { useEffect } from "react";
import Image from "next/image";

interface PopupBannerProps {
  isOpen: boolean; // 팝업 노출 여부
  onClose: () => void; // 닫기 콜백
  desktopImage: string; // 데스크톱용 이미지 경로 (/images/...)
  mobileImage: string; // 모바일용 이미지 경로
  alt?: string;
  oncePerDayKey?: string; // 오늘 하루 안 보기용 localStorage key (선택)
}

export default function PopupBanner({
  isOpen,
  onClose,
  desktopImage,
  mobileImage,
  alt = "팝업 배너",
  oncePerDayKey,
}: PopupBannerProps) {
  // ✅ 오늘 하루 안 보기 처리
  useEffect(() => {
    if (!oncePerDayKey || !isOpen) return;

    const today = new Date().toDateString();
    const saved = localStorage.getItem(oncePerDayKey);

    if (saved === today) {
      onClose();
    }
  }, [isOpen, oncePerDayKey, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
      <div className="relative bg-transparent">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-2 right-2 z-10 rounded-full bg-black/70 text-white w-7 h-7 flex items-center justify-center text-sm"
          aria-label="팝업 닫기"
        >
          ✕
        </button>

        {/* ✅ 모바일 이미지 */}
        <div className="block md:hidden">
          <Image
            src={mobileImage}
            alt={alt}
            width={360}
            height={480}
            className="w-[90vw] max-w-[360px] h-auto rounded-lg shadow-xl"
            priority
          />
        </div>

        {/* ✅ 데스크톱 이미지 */}
        <div className="hidden md:block">
          <Image
            src={desktopImage}
            alt={alt}
            width={520}
            height={520}
            className="w-[480px] max-w-[520px] h-auto rounded-lg shadow-xl"
            priority
          />
        </div>

        {/* ✅ 오늘 하루 안 보기 */}
        {oncePerDayKey && (
          <button
            onClick={() => {
              const today = new Date().toDateString();
              localStorage.setItem(oncePerDayKey, today);
              onClose();
            }}
            className="cursor-pointer mt-2 w-full text-center text-xs text-gray-200 underline underline-offset-2"
          >
            오늘 하루 이 창 보지 않기
          </button>
        )}
      </div>
    </div>
  );
}
