// src/components/shareButton.tsx
"use client";

import React from "react";
import Image from "next/image";

declare global {
  interface Window {
    Kakao: any;
  }
}


interface ShareButtonProps {
  // ✅ 공유 내용들 (페이지마다 다르게 넣을 수 있음)
  title: string;
  description: string;
  url?: string;       // 안 주면 현재 페이지 URL
  imageUrl?: string;  // 썸네일 (없으면 기본 이미지 써도 됨)

  onShared?: () => void; // 공유 성공 시 실행할 콜백 (ex. 토스트, 모달)
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  description,
  url,
  imageUrl,
  onShared,
  className,
}) => {
  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const shareUrl = url ?? window.location.href;
    const shareImage =
      imageUrl ?? "https://marketersfridge.co.kr/images/og-default.png";

    // 1️⃣ Kakao 공유 시도
    try {
      if (window.Kakao && window.Kakao.Link) {
        // 혹시 초기화 안 된 경우 한 번 더 방어적으로 init
        if (!window.Kakao.isInitialized?.()) {
          window.Kakao.init(
            process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY as string
          );
        }

        window.Kakao.Link.sendDefault({
          objectType: "feed",
          content: {
            title,
            description,
            imageUrl: shareImage,
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
          buttons: [
            {
              title: "보러가기",
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
          ],
        });

        onShared?.();
        return;
      }
    } catch (e) {
      console.error("카카오 공유 실패:", e);
      // Kakao 실패하면 아래 클립보드 fallback으로 넘어감
    }

    // 2️⃣ Kakao 안 되면 → 링크 복사 fallback
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        onShared?.();
      } else {
        alert(
          "이 브라우저에서는 자동 복사가 지원되지 않습니다. 주소창의 URL을 직접 복사해주세요."
        );
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
