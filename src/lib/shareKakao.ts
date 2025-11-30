// src/lib/shareKakao.ts

type ShareKakaoOptions = {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
};

export const shareKakaoLink = ({ title, description, url, imageUrl }: ShareKakaoOptions) => {
  if (typeof window === "undefined" || !window.Kakao) {
    alert("카카오 공유를 사용할 수 없어요.");
    return;
  }

  window.Kakao.Link.sendDefault({
    objectType: "feed",
    content: {
      title,
      description,
      imageUrl: imageUrl ?? "https://marketersfridge.co.kr/images/og-default.png",
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    },
    buttons: [
      {
        title: "보러가기",
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
    ],
  });
};
