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
  item?: PostResponseDto;
  fallback: string;
}) {
  const router = useRouter();

  const imageList: string[] =
    item && item.images && item.images.length > 0 ? item.images : [fallback];

  const isVideoSrc = (src: string) => {
    const clean = src.split("?")[0].toLowerCase();
    return /\.(mp4|mov|webm|ogg|m4v)$/i.test(clean);
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // 🔥 fade-in
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 화면에 60% 정도 들어왔을 때 한 번만 show = true
          if (entry.isIntersecting) {
            setShow(true);
            observer.unobserve(el); // 한 번만 실행
          }
        });
      },
      {
        threshold: 0.6, // 요소의 60%가 뷰포트 안에 들어왔을 때
        rootMargin: "0px 0px 0px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 활성 슬라이드만 재생
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
    <div
      ref={sectionRef}
      className={`mobile-fade-base ${show ? "mobile-fade-visible" : ""}`}
    >
      {/* 헤더 */}
      <div className="flex flex-col items-start gap-[2px] mb-3 px-1">
        <p className="text-[10px] uppercase tracking-[0.2em] text-main-red/80">
          {isHot ? "Hot Contents" : "Editor Pick"}
        </p>
        <h3 className="text-[15px] font-semibold text-white">
          {isHot ? "지금 반응 가장 좋은 콘텐츠" : "에디터가 고른 추천 콘텐츠"}
        </h3>
        <p className="text-[11px] text-white">
          {isHot
            ? "조회·저장 지표가 높은 콘텐츠예요."
            : "실제 마케터 시선으로 '꼭 보면 좋은' 카드뉴스예요."}
        </p>
      </div>

      {/* 카드 */}
      <div className="rounded-2xl shadow-[0_15px_20px_rgba(0,0,0,0.2)] m-2">
        <Swiper
          slidesPerView={1}
          spaceBetween={18}
          className="w-full"
          onSlideChange={(s) => setActiveIndex(s.activeIndex)}
        >
          {imageList.map((src, i) => {
            const isVideo = isVideoSrc(src);

            return (
              <SwiperSlide key={`${title}-${i}`} className="!w-full">
                <div
                  className="relative w-full cursor-pointer"
                  onClick={() =>
                    item?.id && router.push(`/contents/${item.id}`)
                  }
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
                      src={src}
                      alt={item?.title || title}
                      className="w-full aspect-[3/4] object-cover rounded-xl"
                      width={600}
                      height={800}
                    />
                  )}

                  {/* 태그 & 인덱스 */}
                  <div className="pointer-events-none">
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-black/70 px-2 py-[2px] text-[10px] font-medium text-white border border-white/10">
                        {isHot ? "HOT" : "PICK"}
                      </span>
                    </div>

                    {imageList.length > 1 && (
                      <div className="absolute top-3 right-3 rounded-full bg-black/70 px-2.5 py-[3px] text-[10px] font-medium text-white border border-white/10">
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
