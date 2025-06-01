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
          playfair: ["var(--font-playfair)"],
        },
      },
    },
    plugins: [],
  };
  