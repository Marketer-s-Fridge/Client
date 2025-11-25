// src/components/MobilePostCarousel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { PostResponseDto } from "@/features/posts/types";

export default function MobilePostCarousel({
  title,
  item,
  fallback,
}: {
  title: string;
  item?: PostResponseDto; // 단일 게시글 기준
  fallback: string;
}) {
  const router = useRouter();

  // 보여줄 이미지/영상 리스트 (없으면 fallback 한 장)
  const imageList: string[] =
    item && item.images && item.images.length > 0 ? item.images : [fallback];

  // 비디오 판별
  const isVideoSrc = (src: string) => {
    const clean = src.split("?")[0].toLowerCase();
    return /\.(mp4|mov|webm|ogg|m4v)$/i.test(clean);
  };

  // 현재 슬라이드 index
  const [activeIndex, setActiveIndex] = useState(0);

  // 각 슬라이드의 video ref
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // 활성 슬라이드만 재생, 나머지는 정지
  useEffect(() => {
    imageList.forEach((src, idx) => {
      const el = videoRefs.current[idx];
      if (!el || !isVideoSrc(src)) return;

      if (idx === activeIndex) {
        el.play().catch(() => {});
      } else {
        el.pause();
        el.currentTime = 0;
      }
    });
  }, [activeIndex, imageList]);

  const isHot = title === "Hot Contents";

  return (
    <div className="md:hidden">
      {/* 헤더 텍스트 */}
      <div className="flex flex-col items-start gap-[2px] mb-3 px-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-main-red/80">
          {isHot ? "Hot Contents" : "Editor Pick"}
        </p>
        <h3 className="text-[15px] font-semibold text-white">
          {isHot
            ? "지금 반응 가장 좋은 콘텐츠"
            : "에디터가 고른 추천 콘텐츠"}
        </h3>
        <p className="mt-1 text-[11px] text-gray-300">
          {isHot
            ? "조회·저장 지표가 높은 콘텐츠예요."
            : "실제 마케터 시선으로 '꼭 보면 좋은' 콘텐츠예요."}
        </p>
      </div>

      {/* 카드 영역 */}
      <div className="rounded-lg px-2 py-2">
        <Swiper
          slidesPerView={1}
          spaceBetween={18}
          className="w-full"
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {imageList.map((src, i) => {
            const isVideo = isVideoSrc(src);
            const isActive = i === activeIndex;

            return (
              <SwiperSlide key={`${title}-${i}`} className="!w-full">
                <div
                  className={`relative w-full cursor-pointer transform transition-all duration-500 ease-out ${
                    isActive
                      ? "scale-[1.0] opacity-100"
                      : "scale-[0.94] opacity-70"
                  }`}
                  onClick={() => {
                    if (item?.id) router.push(`/contents/${item.id}`);
                  }}
                >
                  {isVideo ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      src={src}
                      className="w-full aspect-[3/4] object-cover rounded-xl"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <Image
                      alt={item?.title || title}
                      src={src || fallback}
                      className="w-full aspect-[3/4] object-cover rounded-xl"
                      width={600}
                      height={800}
                    />
                  )}

                  {/* 오버레이: 상단 태그 + 인덱스 */}
                  <div className="pointer-events-none">
                    {/* 상단 왼쪽 태그 */}
                    <div className="absolute top-3 left-3 flex items-center gap-1">
                      <span className="rounded-full bg-black/70 px-2 py-[2px] text-[10px] font-medium text-white ">
                        {isHot ? "HOT" : "PICK"}
                      </span>
                    </div>

                    {/* 상단 오른쪽 인덱스 */}
                    {imageList.length > 1 && (
                      <div className="absolute top-3 right-3 rounded-full bg-black/70 px-2.5 py-[3px] text-[10px] font-medium text-white ">
                        {i + 1}/{imageList.length}
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
