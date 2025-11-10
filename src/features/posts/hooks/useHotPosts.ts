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
      content: "제니(@jennierubyjane)의 취향은 곧 모두의 취향이 된다는 ’제니 효과‘의 비밀은 단순한 유명세가 아니었어요. 제니는 단순한 모델 역할을 넘어, 직접 디자인에 참여하는 크리에이터로서 한국 전통 나전칠기의 우아한 감성을 담아냈죠. 패키지부터 텀블러에 달린 귀여운 참까지, 그녀의 섬세한 터치는 팬들의 소장 욕구를 완벽하게 자극했어요. \n\n 여기에 스탠리(@stanley_korea)는 팝업 스토어에 팬들을 위한 백스테이지 무드를 구현하고, 한정판 출시로 색다른 경험을 선물했습니다. 이처럼 팬심을 이해하고 소통하는 마케팅은 역대급 반응을 일으키며, 스탠리가 110년 전통을 넘어 라이프스타일의 완성으로 자리 잡게 했어요...",
      images: [`/images/cardNews/hot/${i}.png`],   // ✅ 배열 채움
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
