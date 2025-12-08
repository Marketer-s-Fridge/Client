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
import { useTrackVisitor } from "@/features/visitorStatus/hooks/useVisitorStatus";
import PopupBanner from "@/components/popupBanner";
import { motion } from "framer-motion";

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

  // 모바일 섹션 진입 애니메이션용
  const [mobileEnter, setMobileEnter] = useState(false);

  // 팝업 노출 상태
  const [showPopup, setShowPopup] = useState(true);

  // 첫 진입 시 방문자 추적
  const { mutate: trackVisitor } = useTrackVisitor();
  useEffect(() => {
    trackVisitor(undefined);
    setMobileEnter(true);
    setShowPopup(true);
  }, [trackVisitor]);

  // HOT / PICK
  const { data: hot = [] } = useHotPosts(8);
  const { data: picks = [] } = useEditorPicks(8);

  // 더미 데이터
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

  // 전체 게시물
  const { data: _allPosts = [] } = usePosts();
  const allPosts = _allPosts as SimplePost[];

  // 최신 4개
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

      {/* 팝업 배너 */}
      <PopupBanner
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        desktopImage="/images/popup/popup2.png"
        mobileImage="/images/popup/popup2.png"
        alt="마케터의 냉장고 오픈 기념 이벤트"
        oncePerDayKey="mf_home_popup"
      />

      {/* 검색 (데스크톱) */}
      <section className="hidden md:block bg-white flex-col items-center pb-6 pt-14 sm:pb-12 relative">
        <SearchInput showInstagramButton />
      </section>

      {/* 최신 콘텐츠 New Contents */}
      <section className="w-full">
        {/* 데스크톱 최신 콘텐츠 */}
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
                  onClick={() => router.push(`/contents/${post.id}`)}
                  width={250}
                  height={300}
                />
              );
            })}
          </div>
        </div>

        {/* 모바일 최신 콘텐츠 */}
        <div
          className={`block md:hidden bg-white pt-10 pb-12 transform transition-all duration-500 ease-out ${
            mobileEnter
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
          }`}
        >
          {/* 헤더 */}
          <div className="px-6 flex items-center justify-between mb-3">
            <div className="flex-1 ">
              <p className="text-[10px] uppercase tracking-[0.18em] text-main-red/80 font-semibold mb-1">
                Archive
              </p>
              <h3 className="text-[20px] font-extrabold leading-snug text-gray-900">
                New Contents
              </h3>
              <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                지금 놓치면 아까운
                <span className="font-semibold text-main-red/90"> 최신 </span>
                콘텐츠만 담았어요
              </p>
            </div>
          </div>

          {/* 카드 슬라이드 */}
          <div className="px-2 flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
            {latestPosts.map((post, index) => {
              const thumb =
                post.images?.[0] ?? "/images/cardNews/default/001.png";

              return (
                <button
                  key={post.id}
                  type="button"
                  className="snap-center w-[84%] max-w-xs shrink-0 first:ml-2 last:mr-6 active:scale-[0.97] transition-transform duration-300"
                  onClick={() => router.push(`/contents/${post.id}`)}
                >
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-900 shadow-xl">
                    <Image
                      alt={post.title}
                      src={thumb}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80vw, 320px"
                    />

                    {/* 인덱스 뱃지 */}
                    <div className="absolute top-3 right-3 rounded-full bg-black/70 px-2.5 py-[3px] text-[10px] font-medium text-white backdrop-blur-sm">
                      {index + 1}/{latestPosts.length}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 데스크톱 Hot & Pick */}
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

      {/* 모바일 Hot & Editor Pick */}
      <section
        className={`md:hidden main-red text-white pt-10 pb-16 transform transition-all duration-600 ease-out ${
          mobileEnter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="px-5 flex justify-center items-center mb-8">
          <div className="relative flex flex-col justify-center items-center text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-main-red/80 mb-1">
              Curated For You
            </p>
            <h2 className="text-[19px] font-bold leading-snug">
              놓치기 아까운 큐레이션
            </h2>
            <p className="mt-1 text-[11px] text-white">
              실무에서 바로 참고하기 좋은 콘텐츠만 골라 담았어요
            </p>
          </div>
        </div>

        {/* 🔧 여기: 가운데 정렬 수정 (mx-auto) */}
        <div className="relative w-[50px] h-[20px] mb-7 mx-auto">
          <motion.div
            className="w-full h-full relative"
            animate={{ y: [0, 4, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/icons/Vector11.svg"
              alt="벡터 아이콘"
              fill
              sizes="28px"
              quality={100}
              className="object-contain"
            />
          </motion.div>
        </div>

        <div className="px-4 space-y-8">
          <MobilePostCarousel
            title="Hot Contents"
            item={hotHero}
            fallback="/images/cardNews/hot/001.png"
          />
          <MobilePostCarousel
            title="Editor Pick"
            item={pickHero}
            fallback="/images/cardNews/editor/001.png"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
