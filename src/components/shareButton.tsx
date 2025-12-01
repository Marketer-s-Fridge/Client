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
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;

  onShared?: () => void;
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

    const currentUrl = window.location.href;

    // ⭐ 게시글 id 자동 추출 (예: /contents/123 → 123)
    const postId = (() => {
      const match = currentUrl.match(/contents\/(\d+)/);
      return match ? match[1] : "";
    })();

    // ⭐ fallback URL 강제 생성
    const fallbackUrl = `http://marketersfridge.co.kr/contents/${postId}`;

    const shareUrl = url ?? fallbackUrl;
    const shareImage =
      imageUrl ?? "https://marketersfridge.co.kr/images/og-default.png";

    // 1️⃣ Kakao 공유 시도 (에러면 자동 fallback)
    try {
      if (window.Kakao && window.Kakao.Link) {
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
    }

    // 2️⃣ Kakao 안 되면 → http://.../contents/[id] 링크 복사
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(fallbackUrl);
        onShared?.();
      } else {
        alert(
          "자동 복사가 지원되지 않습니다. 주소창의 URL을 직접 복사해주세요."
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
