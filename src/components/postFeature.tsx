// src/components/postFeature.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { PostResponseDto } from "@/features/posts/types";
import SaveToFridgeButton from "@/components/saveToFridgeButton";

interface PostFeatureProps {
  title: string;
  item?: PostResponseDto;
  fallback: string;
}

const PostFeature: React.FC<PostFeatureProps> = ({ title, item, fallback }) => {
  const router = useRouter();

  if (!item) return null;

  const thumb = item.images?.[0] ?? fallback;

  return (
    <section className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">{title}</h2>

      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        {/* 이미지 카드 영역 */}
        <div
          className="
            relative 
            w-full 
            md:w-[45%] 
            max-w-[420px] 
            aspect-[3/4]
            flex-shrink-0 
            cursor-pointer
          "
          onClick={() => router.push(`/contents/${item.id}`)}
        >
          <Image
            src={thumb}
            alt={item.title}
            fill
            className="rounded-xl object-cover shadow-md hover:scale-[1.02] transition-transform duration-300"
            sizes="(min-width: 1024px) 420px, (min-width: 768px) 45vw, 100vw"
          />
        </div>

        {/* 텍스트 + 액션 영역 */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* 제목: 2줄까지 표시 후 ... */}
            <h3
              className="
                text-xl sm:text-2xl font-bold mb-2
                overflow-hidden text-ellipsis
                [display:-webkit-box]
                [-webkit-line-clamp:2]
                [-webkit-box-orient:vertical]
              "
            >
              {item.title}
            </h3>

            <div className="text-xs text-gray-500 mb-2">
              {item.category}
              {item.publishedAt &&
                ` · ${new Date(item.publishedAt).toLocaleDateString("ko-KR")}`}
              {item.viewCount !== undefined && ` · ${item.viewCount} views`}
            </div>

            {/* 서브타이틀: 2줄까지만 */}
            {item.subTitle && (
              <p
                className="
                  text-sm sm:text-base text-gray-700 mb-2
                  overflow-hidden text-ellipsis
                  [display:-webkit-box]
                  [-webkit-line-clamp:2]
                  [-webkit-box-orient:vertical]
                "
              >
                {item.subTitle}
              </p>
            )}

            {/* 본문 내용: 4줄까지만 */}
            {item.content && (
              <p
                className="
                  text-sm sm:text-base text-gray-600
                  overflow-hidden text-ellipsis
                  [display:-webkit-box]
                  [-webkit-line-clamp:4]
                  [-webkit-box-orient:vertical]
                "
              >
                {item.content}
              </p>
            )}
          </div>

          {/* 하단 버튼 영역: MY 냉장고 + 자세히 보기 */}
          <div className="mt-4 flex justify-end items-center gap-3">
            <SaveToFridgeButton postId={item.id} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostFeature;
