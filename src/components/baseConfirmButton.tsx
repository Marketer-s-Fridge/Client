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
        // 모바일: 화면을 어느 정도 채우도록 (90% 폭)
        "cursor-pointer w-[90%] sm:w-auto bg-red-500 text-white",
        "rounded-lg sm:rounded-full px-4 py-3 sm:py-1.5",
        "text-[15px] sm:text-[11px] font-semibold hover:bg-red-600",
        "transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
};

export default BaseConfirmButton;
