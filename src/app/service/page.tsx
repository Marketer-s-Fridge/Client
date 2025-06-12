"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="bg-white flex flex-col items-center relative px-[10%] sm:px-[16%]">
        <Image
          alt=""
          src="/images/main4.png"
          width={1478}
          height={674}
          className="h-auto object-contain"
        />
      </section>
      <Image
        src="/images/categoryBar.jpg"
        alt=""
        width={1300}
        height={50}
        className="w-full"
      ></Image>

      {/* 캐러셀 스타일 섹션 */}
      <Image
        src="/images/serviceCategory.png"
        alt=""
        width="1400"
        height="700"
        className="w-screen object-fill my-[15%]"
      ></Image>

      <Footer />
    </main>
  );
}
