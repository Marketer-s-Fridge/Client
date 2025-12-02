// components/baseConfirmButton.tsx
"use client";

import React from "react";
import clsx from "clsx";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const BaseConfirmButton: React.FC<PrimaryButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        // disabled 스타일 - 배경 회색, hover 막기
        "disabled:bg-gray-300 disabled:text-white disabled:hover:bg-gray-300",
        "disabled:opacity-100 disabled:cursor-not-allowed",

        // 기본 스타일
        "cursor-pointer w-full sm:w-auto bg-red-500 text-white",
        "rounded-lg sm:rounded-full px-5 py-3 sm:py-1.5",
        "text-[15px] sm:text-[11px] font-medium",
        "hover:bg-red-600 transition-colors",

        className
      )}
    >
      {children}
    </button>
  );
};

export default BaseConfirmButton;
