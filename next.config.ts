// next.config.js
const nextConfig = {
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },

  // ✅ 여기에 이미지 도메인 추가
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mfridge-images.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
