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

      {/* md 이상에서 카드 전체 높이를 썸네일과 맞춤 */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:h-[420px]">
        {/* 이미지 */}
        <div
          className="
            relative w-full max-w-[420px]
            md:h-full md:w-auto
            aspect-[3/4] flex-shrink-0 cursor-pointer
          "
          onClick={() => router.push(`/contents/${item.id}`)}
        >
          <Image
            src={thumb}
            alt={item.title}
            fill
            className="rounded-xl object-cover shadow-md hover:scale-[1.02] transition-transform duration-300"
          />
        </div>

        {/* 오른쪽 섹션: 썸네일과 같은 높이, 내부 스크롤 */}
        <div className="flex-1 flex flex-col md:h-full">
          {/* 텍스트 영역: 남은 높이 채우고, 넘치면 스크롤 */}
          <div className="flex-1 overflow-y-auto pr-2">
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

            {/* 본문 (스크롤 영역) */}
            {item.content && (
              <p className="text-sm sm:text-base text-gray-600 whitespace-pre-line">
                {item.content}
              </p>
            )}
          </div>

          {/* 버튼: 항상 텍스트 아래 + 오른쪽 정렬, 썸네일 높이 안에서 맨 아래에 위치 */}
          <div className="mt-4 flex justify-end">
            <SaveToFridgeButton postId={item.id} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostFeature;
