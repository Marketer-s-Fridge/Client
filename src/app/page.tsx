// src/app/page.tsx
"use client";

import Header from "@/components/header";
import { useEffect, useMemo, useState } from "react";
import SearchInput from "@/components/searchInput";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/footer";
import MobileMenu from "@/components/mobileMenu";
import "swiper/css";
import { useAuthStatus } from "@/features/auth/hooks/useAuthStatus";
import { useHotPosts } from "@/features/posts/hooks/useHotPosts";
import { useEditorPicks } from "@/features/posts/hooks/useEditorPicks";
import PostFeature from "@/components/postFeature";
import MobilePostCarousel from "@/components/mobilePostCarousel";

// ✅ 방문자 추적 훅
import { useTrackVisitor } from "@/features/visitorStatus/hooks/useVisitorStatus";

export default function HomePage() {
  // 사용 안 하면 제거 가능
  useAuthStatus();

  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ 첫 진입 시 1회 방문자 추적
  const { mutate: trackVisitor } = useTrackVisitor();
  useEffect(() => {
    // 서버에서 세션/쿠키 기준으로 중복 처리한다고 가정하고 단순 호출
    trackVisitor(undefined);
  }, [trackVisitor]);

  // 훅 데이터
  const { data: hot = [] } = useHotPosts(8);
  const { data: picks = [] } = useEditorPicks(8);

  const hotHero = useMemo(() => hot[0], [hot]);
  const pickHero = useMemo(() => picks[0], [picks]);

  return (
    <main className="min-h-screen bg-white pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 검색 입력창 */}
      <section className="hidden md:block bg-white flex-col items-center pb-6 pt-14 sm:pb-12 relative">
        <SearchInput showInstagramButton />
      </section>

      {/* 오늘의 카드뉴스: 정적 섹션 유지 */}
      <section className="w-full">
        <div className="hidden md:block main-red py-8 px-5 sm:px-10 lg:px-[17%]">
          <h2 className="text-white text-xl sm:text-3xl font-bold mb-6">
            New Contents
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Image
                key={i}
                alt=""
                src={`/images/cardNews/${i}/001.png`}
                className="aspect-[3/4] bg-white rounded-lg shadow cursor-pointer transition duration-300 ease-in-out hover:scale-105 w-full"
                onClick={() => router.push("/cardNews")}
                width={250}
                height={300}
              />
            ))}
          </div>
        </div>

        {/* 모바일: 정적 카드뉴스 유지 */}
        <div className="block md:hidden relative mt-4 px-5 w-full py-8">
          <h3 className="text-xl md:text-2xl font-bold mb-4">New Contents</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="!w-[40%] max-w-xs shrink-0">
                <Image
                  alt={`카드뉴스 ${i}`}
                  src={`/images/cardNews/${i}/001.png`}
                  className="aspect-[3/4] object-cover shadow cursor-pointer rounded-lg"
                  onClick={() => router.push("/cardNews")}
                  width={300}
                  height={400}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 데스크톱: 섹션당 1장 + 설명 */}
      <section className="hidden md:block bg-white py-12 px-5 sm:px-10 lg:px-[25%]">
        <div className="max-w-[1024px] mx-auto space-y-16">
          <PostFeature
            title="Hot Contents"
            item={hotHero}
            fallback="/images/cardNews/hot/001.png"
          />
          <PostFeature
            title="Editor Pick"
            item={pickHero}
            fallback="/images/cardNews/editor/001.png"
          />
        </div>
      </section>

      {/* 모바일: 훅 데이터로 슬라이드 적용 */}
      <MobilePostCarousel
        title="Hot Contents"
        items={hot}
        fallback="/images/cardNews/hot/001.png"
      />
      <div className="h-10 md:hidden" />
      <MobilePostCarousel
        title="Editor Pick"
        items={picks}
        fallback="/images/cardNews/editor/001.png"
      />

      <Footer />
    </main>
  );
}
