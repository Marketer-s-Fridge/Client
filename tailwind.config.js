// tailwind.config.js
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: "var(--background)",
          foreground: "var(--foreground)",
          mainRed: "#FF4545",
        },
        fontFamily: {
          playfair: ["var(--font-playfair)"], // 이건 따로 변수 정의해줘야 함(아래 참고)
          pretendard: ["Pretendard", "system-ui", "sans-serif"], // ✅ 여기 수정
        },
      },
    },
    plugins: [],
  };
  