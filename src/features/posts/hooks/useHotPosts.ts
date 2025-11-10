// src/features/posts/hooks/useHotPosts.ts
import { useQuery } from "@tanstack/react-query";
import { fetchHotPosts } from "../api/postsApi";
import type { PostResponseDto } from "../types";

const USE_MOCK ="true";

const hotMock = (limit: number): PostResponseDto[] =>
  Array.from({ length: limit }).map((_, idx) => {
    const i = String(idx + 1).padStart(3, "0");
    return {
      id: 2000 + idx,
      title: idx === 0 ? "콜라보의 새로운 기준 제니 X 스탠리" : `Hot Content #${idx + 1}`,
      subTitle: "마케팅 인사이트",
      category: "트렌드",
      type: "CARD_NEWS",
      content: "🔥 인기 급상승 콘텐츠의 예시 내용입니다.",
      images: [`/images/cardNews/2/${i}.png`],   // ✅ 배열 채움
      postStatus: "PUBLISHED",
      workflowStatus: "COMPLETE",
      createdAt: "2025-10-05T00:00:00Z",
      updatedAt: "2025-10-06T00:00:00Z",
    };
  });

export function useHotPosts(limit = 6) {
  return useQuery<PostResponseDto[], Error>({
    queryKey: ["posts", "hot", limit, USE_MOCK],
    queryFn: () => (USE_MOCK ? Promise.resolve(hotMock(limit)) : fetchHotPosts(limit)),
    staleTime: 60_000,
    gcTime: 300_000,
    retry: 1,
    placeholderData: (prev) => prev,
  });
}
