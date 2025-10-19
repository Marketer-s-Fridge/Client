/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },

  async rewrites() {
    return [
      // ✅ auth 요청
      {
        source: "/auth/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "http://15.165.137.5:8081/auth/:path*" // ✅ 실제 EC2 백엔드 주소
            : "http://localhost:8081/auth/:path*",
      },
      // ✅ 나머지 api 요청
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "http://15.165.137.5:8081/api/:path*" // ✅ 실제 EC2 백엔드 주소
            : "http://localhost:8081/api/:path*",
      },
    ];
  },
};

export default nextConfig;
