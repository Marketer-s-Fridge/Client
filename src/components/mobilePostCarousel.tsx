// src/components/MobilePostCarousel.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { PostResponseDto } from "@/features/posts/types";

export default function MobilePostCarousel({
  title,
  items,
  fallback,
}: {
  title: string;
  items: PostResponseDto[];
  fallback: string;
}) {
  const router = useRouter();

  return (
    <div className="md:hidden flex flex-col px-5">
      <div className="flex items-start gap-2 mb-4">
        <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
      </div>
      <Swiper slidesPerView={1} spaceBetween={20} className="w-full">
        {(items.length ? items : Array.from({ length: 3 })).map((p: any, i: number) => (
          <SwiperSlide key={p?.id ?? `${title}-skel-${i}`} className="!w-full">
            {p ? (
              <Image
                alt={p.title || title}
                src={p.images?.[0] || fallback}
                className="w-full aspect-[3/4] object-cover rounded-lg shadow cursor-pointer"
                width={600}
                height={800}
                onClick={() => router.push(`/contents/${p.id}`)
              }
              />
            ) : (
              <div className="w-full aspect-[3/4] rounded-lg bg-gray-100 animate-pulse" />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
