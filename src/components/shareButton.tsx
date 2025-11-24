// src/components/shareButton.tsx
import React from "react";
import Image from "next/image";

interface ShareButtonProps {
  onShared?: () => void; // 공유 성공 시 실행할 콜백 (ex. 모달 열기)
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ onShared, className }) => {
  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const url = window.location.href;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        onShared?.();
      } else {
        // 클립보드 API가 없는 경우
        alert("이 브라우저에서는 자동 복사가 지원되지 않습니다. 주소창의 URL을 직접 복사해주세요.");
      }
    } catch (e) {
      console.error("링크 복사 실패:", e);
      alert("링크 복사에 실패했습니다. 주소창의 URL을 직접 복사해주세요.");
    }
  };

  return (
    <button
      type="button"
      className={
        className ??
        "border border-gray-300 rounded-full px-1.5 py-1 text-sm cursor-pointer"
      }
      onClick={handleShare}
    >
      <Image src="/icons/share.png" alt="공유" width={16} height={16} />
    </button>
  );
};

export default ShareButton;
