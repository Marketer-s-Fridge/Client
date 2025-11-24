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

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* 이미지 */}
        <div
          className="relative w-full md:w-[45%] max-w-[420px] aspect-[3/4] flex-shrink-0 cursor-pointer"
          onClick={() => router.push(`/contents/${item.id}`)}
        >
          <Image
            src={thumb}
            alt={item.title}
            fill
            className="rounded-xl object-cover shadow-md hover:scale-[1.02] transition-transform duration-300"
          />
        </div>

        {/* 텍스트 */}
        <div className="flex-1 flex flex-col">
          {/* 제목 (2줄까지) */}
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

          {/* 메타 정보 */}
          <div className="text-xs text-gray-500 mb-2">
            {item.category}
            {item.publishedAt &&
              ` · ${new Date(item.publishedAt).toLocaleDateString("ko-KR")}`}
            {item.viewCount !== undefined && ` · ${item.viewCount} views`}
          </div>

          {/* 서브타이틀 (2줄) */}
          {item.subTitle && (
            <p
              className="
                text-sm sm:text-base text-gray-700 mb-2
                overflow-hidden text-ellipsis
                [display:-webkit-box]
                [-webkit-line-clamp:2]
                [-webkit-box-orient:vertical]
                font-bold
              "
            >
              {item.subTitle}
            </p>
          )}

          {/* 본문 (4줄까지) */}
          {item.content && (
            <p
              className="
                text-sm sm:text-base text-gray-600
                overflow-hidden text-ellipsis
                [display:-webkit-box]
                [-webkit-line-clamp:10]
                [-webkit-box-orient:vertical]
              "
            >
              {item.content}
            </p>
          )}

          {/* 버튼 */}
          <div className="mt-4 flex justify-end gap-3">
            <SaveToFridgeButton postId={item.id} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostFeature;
