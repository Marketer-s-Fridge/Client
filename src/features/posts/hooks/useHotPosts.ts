// src/features/posts/hooks/useHotPosts.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchHotPosts } from "../api/postsApi";
import type { PostResponseDto } from "../types";

const USE_MOCK = true;
const hotMock = (limit: number): PostResponseDto[] =>
    Array.from({ length: limit }).map((_, idx) => {
      const i = String(idx + 1).padStart(3, "0");
  
      return {
        id: 2000 + idx,
        title:
          idx === 0
            ? "콜라보의 새로운 기준 제니 X 스탠리"
            : `Hot Content #${idx + 1}`,
        subTitle: "마케팅 인사이트",
        category: "트렌드",
        type: "CARD_NEWS",
        content:
          "제니(@jennierubyjane)의 취향은 곧 모두의 취향이 된다는 ’제니 효과‘...",
        images: [`/images/cardNews/hot/${i}.png`],
        postStatus: "PUBLISHED",
        workflowStatus: "COMPLETE",
        createdAt: "2025-10-05T00:00:00Z",
        updatedAt: "2025-10-06T00:00:00Z",
  
        // 🟩 PostResponseDto 필수 필드들
        scheduledTime: null,               // 예약 글 아니면 null
        publishedAt: "2025-10-05T01:00:00Z",
        version: 1,
        viewCount: 0,
        clickCount: 0,
      };
    });
  

export function useHotPosts(limit = 6) {
  return useQuery<PostResponseDto[], Error>({
    queryKey: ["posts", "hot", limit, USE_MOCK],
    queryFn: () =>
      USE_MOCK ? Promise.resolve(hotMock(limit)) : fetchHotPosts(limit),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
    placeholderData: (prev) => prev,
  });
}
