export const getKakaoAuthUrl = () => {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
    const redirectUri = "http://marketersfridge.co.kr/login/kakao/callback"

    if (!clientId || !redirectUri) {
      console.error("Kakao env not set");
      return "#";
    }
    console.log("KAKAO KEY", clientId);

  
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "account_email"
    });
  
    return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
  };
  