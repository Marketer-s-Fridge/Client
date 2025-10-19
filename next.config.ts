import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return [
      // ✅ auth 요청은 /api 없이 바로 백엔드로
      {
        source: "/auth/:path*",
        destination: "http://mf-api:8081/auth/:path*",
      },
      // ✅ 나머지는 /api 그대로 백엔드로 전달
      {
        source: "/api/:path*",
        destination: "http://mf-api:8081/api/:path*",
      },
    ];
  },
};

export default nextConfig;
