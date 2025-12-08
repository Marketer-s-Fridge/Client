"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // ⭐ 추가

interface PopupBannerProps {
  isOpen: boolean;
  onClose: () => void;
  desktopImage: string;
  mobileImage: string;
  alt?: string;
  oncePerDayKey?: string;
}

export default function PopupBanner({
  isOpen,
  onClose,
  desktopImage,
  mobileImage,
  alt = "팝업 배너",
  oncePerDayKey,
}: PopupBannerProps) {
  const router = useRouter(); // ⭐ 추가

  // 오늘 하루 안 보기
  useEffect(() => {
    if (!oncePerDayKey || !isOpen) return;

    const today = new Date().toDateString();
    const saved = localStorage.getItem(oncePerDayKey);

    if (saved === today) {
      onClose();
    }
  }, [isOpen, oncePerDayKey, onClose]);

  if (!isOpen) return null;

  // ⭐ 이미지 클릭 시 로그인 페이지 이동
  const handleImageClick = () => {
    router.push("/signUp");
    onClose(); // 팝업 닫기까지 할 경우
  };

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

        {/* 모바일 이미지 */}
        <div className="block md:hidden">
          <Image
            src={mobileImage}
            alt={alt}
            width={360}
            height={480}
            className="w-[90vw] max-w-[360px] h-auto rounded-lg shadow-xl cursor-pointer"
            onClick={handleImageClick} // ⭐ 추가
            priority
          />
        </div>

        {/* 데스크톱 이미지 */}
        <div className="hidden md:block">
          <Image
            src={desktopImage}
            alt={alt}
            width={520}
            height={520}
            className="w-[480px] max-w-[520px] h-auto rounded-lg shadow-xl cursor-pointer"
            onClick={handleImageClick} // ⭐ 추가
            priority
          />
        </div>

        {/* 오늘 하루 안 보기 */}
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
