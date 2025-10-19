import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*", // 클라이언트에서 호출할 경로
        destination: "http://mf-api:8081/api/:path*", // ✅ Docker 내부의 Spring Boot 컨테이너로 전달
      },
    ];
  },
};

export default nextConfig;
