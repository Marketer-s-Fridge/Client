"use client";

import Header from "@/components/header";
import { useState } from "react";
import SearchInput from "@/components/searchInput";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/footer";
import MobileMenu from "@/components/mobileMenu";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import SaveToFridgeButton from "@/components/saveToFridgeButton";
import { useAuthStatus } from "@/features/auth/hooks/useAuthStatus";
import { useHotPosts } from "@/features/posts/hooks/useHotPosts";
import { useEditorPicks } from "@/features/posts/hooks/useEditorPicks";
import type { PostResponseDto } from "@/features/posts/types";

export default function HomePage() {
  const { isAuthenticated, user, isLoading } = useAuthStatus();

  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ API or 목데이터
  const { data: hot = [], isLoading: hotLoading } = useHotPosts(6);
  const { data: picks = [], isLoading: picksLoading } = useEditorPicks(6);

  const hotHero = hot[0];
  const pickHero = picks[0];

  const fmt = (d?: string) =>
    d ? new Date(d).toISOString().slice(0, 10).replaceAll("-", ".") : "";

  const goPost = (p: PostResponseDto) => router.push(`/posts/${p.id}`);

  return (
    <main className="min-h-screen bg-white pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 검색 입력창 */}
      <section className="hidden md:block bg-white flex-col items-center  pb-6 pt-14 sm:pb-12 relative">
        <SearchInput showInstagramButton />
      </section>

      {/* 오늘의 카드뉴스 */}
      <section className="w-full">
        {/* PC/Tablet 이상: 기존 그리드 유지 */}
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
                className="aspect-[3/4] bg-white rounded-lg shadow cursor-pointer 
                     transition duration-300 ease-in-out hover:scale-105 w-full"
                onClick={() => router.push("/cardNews")}
                width={250}
                height={300}
              />
            ))}
          </div>
        </div>

        {/* 모바일: 슬라이드 드래그형 카드뉴스 */}
        <div className="block md:hidden relative mt-4 px-5 w-full py-8">
          <h3 className="text-xl md:text-2xl font-bold mb-4">New Contents</h3>
          <Swiper
            slidesPerView={"auto"}
            spaceBetween={10}
            modules={[Autoplay]}
            className="w-full"
          >
            {[1, 2, 3, 4].map((i) => (
              <SwiperSlide
                key={i}
                className="!w-[40%] max-w-xs shrink-0"
              >
                <Image
                  alt={`카드뉴스 ${i}`}
                  src={`/images/cardNews/${i}/001.png`}
                  className="aspect-[3/4] object-cover shadow cursor-pointer rounded-lg"
                  onClick={() => router.push("/cardNews")}
                  width={300}
                  height={400}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 인기 콘텐츠 + 에디터 픽 */}
      <section className="hidden md:block bg-white py-12 px-5 sm:px-10 lg:px-[25%]">
        <div className="max-w-[1024px] mx-auto grid grid-cols-1 gap-16">
          {/* 인기 콘텐츠 */}
          <div className="flex flex-col">
            <div className="flex items-start gap-2 mb-4">
              <h3 className="text-xl md:text-2xl font-bold">Hot Contents</h3>
            </div>
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Hero */}
              <div
                className="transition duration-300 ease-in-out hover:scale-103 cursor-pointer w-full lg:w-[40%] aspect-[3/4] relative rounded-lg overflow-hidden shadow"
                onClick={() => hotHero && goPost(hotHero)}
              >
                {hotHero ? (
                  <Image
                    src={hotHero.images?.[0] || "/images/cardNews/hot/001.png"}
                    alt={hotHero.title || ""}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 animate-pulse" />
                )}
              </div>

              <div className="lg:w-[60%] flex flex-col justify-between lg:h-full py-2">
                <div>
                  <p className="text-lg sm:text-xl font-bold mt-1">
                    {hotHero?.title ?? "로딩 중"}
                  </p>
                  <div className="flex flex-wrap text-gray-400 gap-x-4 text-xs mt-2">
                    <p>{fmt(hotHero?.createdAt)}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-5 leading-relaxed">
                    {hotHero?.content ?? "인기 콘텐츠 요약을 불러오는 중입니다."}
                  </p>
                </div>
                <div className="mt-6">
                  <SaveToFridgeButton />
                </div>
              </div>
            </div>

            {/* 나머지 아이템 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8">
              {hot.slice(1, 5).map((p) => (
                <div
                  key={p.id}
                  className="cursor-pointer"
                  onClick={() => goPost(p)}
                >
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow">
                    <Image
                      src={p.images?.[0] || "/images/cardNews/hot/001.png"}
                      alt={p.title || ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium line-clamp-2">
                    {p.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 에디터 픽 */}
          <div className="flex flex-col">
            <div className="flex items-start gap-2 mb-4">
              <h3 className="text-2xl font-bold">Editor Pick</h3>
            </div>
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Hero */}
              <div
                className="transition duration-300 ease-in-out hover:scale-103 cursor-pointer w-full lg:w-[40%] aspect-[3/4] relative rounded-lg overflow-hidden shadow"
                onClick={() => pickHero && goPost(pickHero)}
              >
                {pickHero ? (
                  <Image
                    src={pickHero.images?.[0] || "/images/cardNews/editor/001.png"}
                    alt={pickHero.title || ""}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 animate-pulse" />
                )}
              </div>

              <div className="lg:w-[60%] flex flex-col justify-between lg:h-full py-2">
                <div>
                  <p className="text-lg sm:text-xl font-semibold mt-1">
                    {pickHero?.title ?? "로딩 중"}
                  </p>
                  <div className="flex flex-wrap text-gray-400 gap-x-4 text-xs mt-2">
                    <p>{fmt(pickHero?.createdAt)}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-5 leading-relaxed">
                    {pickHero?.content ?? "에디터 추천 요약을 불러오는 중입니다."}
                  </p>
                </div>
                <div className="mt-6">
                  <SaveToFridgeButton />
                </div>
              </div>
            </div>

            {/* 나머지 아이템 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8">
              {picks.slice(1, 5).map((p) => (
                <div
                  key={p.id}
                  className="cursor-pointer"
                  onClick={() => goPost(p)}
                >
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow">
                    <Image
                      src={p.images?.[0] || "/images/cardNews/editor/001.png"}
                      alt={p.title || ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium line-clamp-2">
                    {p.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hot Contents (모바일) */}
      <div className="md:hidden flex flex-col px-5">
        <div className="flex items-start gap-2 mb-4">
          <h3 className="text-xl md:text-2xl font-bold">Hot Contents</h3>
        </div>
        <Swiper slidesPerView={1} spaceBetween={20} className=" w-full">
          {hot.length === 0
            ? [1, 2, 3].map((i) => (
                <SwiperSlide key={i} className="!w-full">
                  <div className="w-full aspect-[3/4] rounded-lg bg-gray-100 animate-pulse" />
                </SwiperSlide>
              ))
            : hot.map((p) => (
                <SwiperSlide key={p.id} className="!w-full">
                  <Image
                    alt={p.title || "Hot"}
                    src={p.images?.[0] || "/images/cardNews/2/001.png"}
                    className="w-full aspect-[3/4] object-cover rounded-lg shadow cursor-pointer"
                    width={600}
                    height={800}
                    onClick={() => goPost(p)}
                  />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>

      {/* Editor Pick (모바일) */}
      <div className="md:hidden flex flex-col mt-14 px-5">
        <div className="flex items-start gap-2 mb-4">
          <h3 className="text-xl md:text-2xl font-bold">Editor Pick</h3>
        </div>
        <Swiper slidesPerView={1} spaceBetween={20} className="w-full">
          {picks.length === 0
            ? [1, 2, 3].map((i) => (
                <SwiperSlide key={i} className="!w-full">
                  <div className="w-full aspect-[3/4] rounded-lg bg-gray-100 animate-pulse" />
                </SwiperSlide>
              ))
            : picks.map((p) => (
                <SwiperSlide key={p.id} className="!w-full">
                  <Image
                    alt={p.title || "Editor Pick"}
                    src={p.images?.[0] || "/images/cardNews/3/001.png"}
                    className="w-full aspect-[3/4] object-cover rounded-lg shadow cursor-pointer"
                    width={600}
                    height={800}
                    onClick={() => goPost(p)}
                  />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>

      <Footer />
    </main>
  );
}
