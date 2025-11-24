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
import { usePosts } from "@/features/posts/hooks/usePosts";

// 방문자 추적 훅
import { useTrackVisitor } from "@/features/visitorStatus/hooks/useVisitorStatus";

// 홈에서 쓰는 최소 필드 타입
type SimplePost = {
  id: number;
  title: string;
  images?: string[];
};

export default function HomePage() {
  useAuthStatus();

  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // 첫 진입 시 1회 방문자 추적
  const { mutate: trackVisitor } = useTrackVisitor();
  useEffect(() => {
    trackVisitor(undefined);
  }, [trackVisitor]);

  // 훅 데이터
  const { data: hot = [] } = useHotPosts(8);
  const { data: picks = [] } = useEditorPicks(8);

  // 더미 데이터: 서버에서 아직 안 와도 로컬에서 느낌 볼 수 있게
  const mockLatestPosts: SimplePost[] = [
    {
      id: 10001,
      title: "요즘 말 잘 통하는 브랜드, 말투 분석 모음.zip",
      images: ["/images/cardNews/1/001.png"],
    },
    {
      id: 10002,
      title: "연말 캠페인 아이디어 12개, 예산별로 쪼개서 정리해봤어요",
      images: ["/images/cardNews/2/001.png"],
    },
    {
      id: 10003,
      title: "인스타 릴스로 전환률 올린 실제 카드뉴스 사례",
      images: ["/images/cardNews/3/001.png"],
    },
    {
      id: 10004,
      title: "‘저장하고 싶은 콘텐츠’는 무엇이 다를까? 마케터 시점 정리",
      images: ["/images/cardNews/4/001.png"],
    },
  ];

  // 실제 데이터 + 타입 맞추기
  const { data: _allPosts = [] } = usePosts();
  const allPosts = _allPosts as SimplePost[];

  // 전체 게시물 중 "마지막 4개" → 최신이 앞쪽에 오도록 역순 정렬
  const latestPosts = useMemo(() => {
    const source = allPosts.length > 0 ? allPosts : mockLatestPosts;
    if (!source.length) return [];
    const lastFour = source.slice(-4);
    return [...lastFour].reverse();
  }, [allPosts]);

  const hotHero = useMemo(() => hot[0], [hot]);
  const pickHero = useMemo(() => picks[0], [picks]);

  return (
    <main className="min-h-screen bg-white pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 검색 입력창 (데스크톱) */}
      <section className="hidden md:block bg-white flex-col items-center pb-6 pt-14 sm:pb-12 relative">
        <SearchInput showInstagramButton />
      </section>

      {/* New Contents: 최신 게시글 4개 */}
      <section className="w-full">
        {/* 데스크톱 */}
        <div className="hidden md:block main-red py-8 px-5 sm:px-10 lg:px-[17%]">
          <h2 className="text-white text-xl sm:text-3xl font-bold mb-6">
            New Contents
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {latestPosts.map((post) => {
              const thumb =
                post.images?.[0] ?? "/images/cardNews/default/001.png";

              return (
                <Image
                  key={post.id}
                  alt={post.title}
                  src={thumb}
                  className="aspect-[3/4] bg-white rounded-lg shadow cursor-pointer transition duration-300 ease-in-out hover:scale-105 w-full object-cover"
                  onClick={() => {
                    router.push(`/contents/${post.id}`);
                  }}
                  width={250}
                  height={300}
                />
              );
            })}
          </div>
        </div>

        {/* 모바일 */}
        <div className="block md:hidden bg-white pt-10 pb-10 px-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-full">
              <p className="text-[11px] text-gray-400 mb-1">최근 업로드된</p>
              <div className="relative flex w-full justify-between flex-row items-center">
                <h3 className="text-xl font-bold">New Contents</h3>
                {latestPosts.length > 0 && (
                  <span className="text-[11px] text-gray-400">
                    총 {latestPosts.length}개
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="-mx-5 px-5 flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
            {latestPosts.map((post, index) => {
              const thumb =
                post.images?.[0] ?? "/images/cardNews/default/001.png";

              return (
                <button
                  key={post.id}
                  type="button"
                  className="snap-center w-[82%] max-w-xs shrink-0"
                  onClick={() => router.push(`/contents/${post.id}`)}
                >
                  <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-md bg-gray-100">
                    <Image
                      alt={post.title}
                      src={thumb}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80vw, 320px"
                    />

                    {/* 아래쪽 그라데이션 + 텍스트 영역 */}
                    <div className="absolute inset-x-0 bottom-0 pt-10 pb-3 px-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end">
                      <p className="text-[11px] text-main-red font-semibold mb-1">
                        오늘의 카드뉴스
                      </p>
                    </div>

                    {/* 우상단 인덱스 뱃지 (1/4) */}
                    <div className="absolute top-3 right-3 rounded-full bg-black/70 px-2 py-[2px] text-[10px] font-medium text-white">
                      {index + 1}/{latestPosts.length}
                    </div>
                  </div>
                </button>
              );
            })}
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
        item={hotHero}
        fallback="/images/cardNews/hot/001.png"
      />
      <div className="h-10 md:hidden" />
      <MobilePostCarousel
        title="Editor Pick"
        item={pickHero}
        fallback="/images/cardNews/editor/001.png"
      />

      <Footer />
    </main>
  );
}
