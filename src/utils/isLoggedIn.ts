// src/utils/isLoggedIn.ts
export const isLoggedIn = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("accessToken");
  };