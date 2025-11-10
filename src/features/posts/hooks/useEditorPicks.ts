// src/features/posts/hooks/useEditorPicks.ts
import { useQuery } from "@tanstack/react-query";
import { fetchEditorPicks } from "../api/postsApi";
import type { PostResponseDto } from "../types";

const USE_MOCK ="true";

const editorMock = (limit: number): PostResponseDto[] =>
  Array.from({ length: limit }).map((_, idx) => {
    const i = String(idx + 1).padStart(3, "0");
    return {
      id: 3000 + idx,
      title: idx === 0 ? "CEO 스캔들, 마케팅으로 뒤집다?" : `Editor Pick #${idx + 1}`,
      subTitle: "PR 인사이트",
      category: "브랜딩",
      type: "CARD_NEWS",
      content: "💔 위기를 기회로 만든 브랜드 사례의 요약입니다.",
      images: [`/images/cardNews/3/${i}.png`],   // ✅ 배열 채움
      postStatus: "PUBLISHED",
      workflowStatus: "COMPLETE",
      createdAt: "2025-10-05T00:00:00Z",
      updatedAt: "2025-10-06T00:00:00Z",
    };
  });

export function useEditorPicks(limit = 6) {
  return useQuery<PostResponseDto[], Error>({
    queryKey: ["posts", "editorPicks", limit, USE_MOCK],
    queryFn: () => (USE_MOCK ? Promise.resolve(editorMock(limit)) : fetchEditorPicks(limit)),
    staleTime: 60_000,
    gcTime: 300_000,
    retry: 1,
    placeholderData: (prev) => prev,
  });
}
