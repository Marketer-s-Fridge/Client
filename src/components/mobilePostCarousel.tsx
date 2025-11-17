// src/components/MobilePostCarousel.tsx
"use client";

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
  item?: PostResponseDto;      // ✅ 단일 게시글 기준
  fallback: string;
}) {
  const router = useRouter();

  // ✅ 보여줄 이미지 리스트 (없으면 fallback 한 장)
  const imageList: string[] =
    item && item.images && item.images.length > 0
      ? item.images
      : [fallback];

  return (
    <div className="md:hidden flex flex-col px-5 mt-8">
      <div className="flex items-start gap-2 mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
      </div>

      <Swiper slidesPerView={1} spaceBetween={20} className="w-full">
        {imageList.map((src, i) => (
          <SwiperSlide key={`${title}-${i}`} className="!w-full">
            <Image
              alt={item?.title || title}
              src={src || fallback}
              className="w-full aspect-[3/4] object-cover rounded-lg shadow cursor-pointer"
              width={600}
              height={800}
              onClick={() => {
                if (item?.id) router.push(`/contents/${item.id}`);
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
