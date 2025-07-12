"use client"
import Header from "@/components/header";
import { Suspense } from "react";
import SearchClient from "./searchClient";
import Footer from "@/components/footer";
import MobileMenu from "@/components/mobileMenu";
import { useState } from "react";

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="bg-white min-h-screen">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />{" "}
      <Suspense fallback={<div className="text-center py-10">로딩 중...</div>}>
        <SearchClient />
      </Suspense>
      <Footer />
    </div>
  );
}
