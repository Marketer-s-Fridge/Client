"use client";
import React from "react";

export default function ScrollToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="cursor-pointer fixed bottom-[3.75rem] right-4 sm:right-6 md:right-10 lg:right-[3.75rem] z-50 w-10 sm:w-11 md:w-12 h-10 sm:h-11 md:h-12 rounded-full bg-white shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center justify-center"
    >
      <img
        src="/icons/up-scroll.png"
        alt="맨 위로"
        className="w-auto, h-auto"
      />
    </button>
  );
}
