// next.config.js
const nextConfig = {
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "http://15.165.137.5:8081/auth/:path*" // ✅ EC2 공용 IP:백엔드포트
            : "http://localhost:8081/auth/:path*",
      },
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "http://15.165.137.5:8081/api/:path*" // ✅ 동일하게 수정
            : "http://localhost:8081/api/:path*",
      },
    ];
  },
};

export default nextConfig;
