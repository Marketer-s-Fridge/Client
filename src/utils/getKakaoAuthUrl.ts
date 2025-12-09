export const getKakaoAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    console.error("Kakao env not set");
    return "#";
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "account_email",
    prompt: "login" // 선택: 사파리/아이폰에서 재인증 꼬임 방지
  });

  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
};
