"use client";

import { useState } from "react";
import Header from "@/components/header";
import MobileMenu from "@/components/mobileMenu";

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {children}
    </>
  );
}
