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

  return (
    <div className="md:hidden flex flex-col px-5 mt-8">
      <div className="flex items-start gap-2 mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        className="w-full"
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {imageList.map((src, i) => {
          const isVideo = isVideoSrc(src);

          return (
            <SwiperSlide key={`${title}-${i}`} className="!w-full">
              <div
                className="w-full"
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
                    className="w-full aspect-[3/4] object-cover rounded-lg shadow cursor-pointer"
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <Image
                    alt={item?.title || title}
                    src={src || fallback}
                    className="w-full aspect-[3/4] object-cover rounded-lg shadow cursor-pointer"
                    width={600}
                    height={800}
                  />
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
