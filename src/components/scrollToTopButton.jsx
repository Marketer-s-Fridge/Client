"use client";
import React from "react";

export default function ScrollToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="cursor-pointer fixed bottom-15 right-15 z-50 w-12 h-12 rounded-full bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <img
        src="/icons/up-scroll.png"
        alt="맨 위로"
        className="mx-auto my-auto"
      />
    </button>
  );
}
