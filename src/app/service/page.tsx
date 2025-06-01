"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";

export default function HomePage() {

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* 검색 입력창 */}
      <section className="bg-white flex flex-col items-center relative">
        <Image
          alt=""
          src="/images/main4.png"
          width={1478}
          height={674}
          className="w-250 h-auto object-contain"
        ></Image>
      </section>

      <Footer />
    </main>
  );
}
