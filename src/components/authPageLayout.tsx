// components/authPageLayout.tsx
"use client";

import React, { useState } from "react";
import clsx from "clsx";
import Header from "@/components/header";
import MobileMenu from "@/components/mobileMenu";
import { AuthHeader } from "@/components/authFormComponents";

interface AuthPageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  /** 안쪽 카드 max-width (Tailwind class) */
  maxWidthClass?: string; // 예: "max-w-[480px]", "max-w-[550px]"
  /** 바깥 wrapper 추가 커스텀 */
  wrapperClassName?: string;
}

const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({
  title,
  description,
  children,
  maxWidthClass = "max-w-[550px]",
  wrapperClassName,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full bg-white pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div
        className={clsx(
          "w-full bg-white px-4 sm:px-6 md:px-8",
          "min-h-[100svh] py-16 flex items-center justify-center",
          wrapperClassName
        )}
      >
        <div className={clsx("w-full self-center", maxWidthClass)}>
          <AuthHeader title={title} description={description ?? ""} />
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthPageLayout;
