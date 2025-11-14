// src/features/posts/hooks/usePosts.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPostsByStatus } from "../api/postsApi";
import { PostResponseDto } from "../types";

export interface Content {
  id: number;
  title: string;
  images: string[];
}

type UsePostsResult =
  | { data: Content[]; isLoading: false; error: null } // mock 사용
  | {
      data: PostResponseDto[] | undefined;
      isLoading: boolean;
      error: Error | null;
    }; // 서버 사용

// ✅ Mock 데이터
const mockContents: Content[] = [
  { id: 1, title: "셀럽들의 공항 패션 스타일", images: ["/images/content1.png"] },
  { id: 2, title: "재테크를 위한 중요한 원칙과 전략", images: ["/images/content2.png"] },
  { id: 3, title: "고효율 작업을 위한 생산성 도구 추천", images: ["/images/content3.png"] },
  { id: 4, title: "건강한 라이프스타일을 위한 스트레스 관리 방법", images: ["/images/content4.png"] },
  { id: 5, title: "자연 친화적인 라이프스타일을 위한 환경 보호 방법", images: ["/images/content5.png"] },
  { id: 6, title: "신규 브랜드 탐방: 떠오르는 디자이너들", images: ["/images/content6.png"] },
  { id: 7, title: "포인트 컬러로 완성하는 겨울 룩", images: ["/images/content7.png"] },
  { id: 8, title: "여름을 위한 에센셜 드레스 스타일링", images: ["/images/content8.png"] },
  { id: 9, title: "지금 사야 할 하이엔드 브랜드 아이템", images: ["/images/content9.png"] },
  { id: 10, title: "세계 최초의 우주 관광선 예약 오픈, 대기 리스트 급증", images: ["/images/content10.png"] },
  { id: 11, title: "지구 온난화 심각성 경보, 글로벌 대응책 모색에 국제회의 개최", images: ["/images/content11.png"] },
  { id: 12, title: "자율주행 트럭 시범 운영, 운송 업계의 변화 시작", images: ["/images/content12.png"] },
  { id: 13, title: "시간을 초월한 클래식 아이템", images: ["/images/content13.png"] },
  { id: 14, title: "미니멀한 공간을 위한 인테리어 팁", images: ["/images/content14.png"] },
  { id: 15, title: "AI 시대, 마케터가 가져야 할 핵심 역량", images: ["/images/content15.png"] },
  { id: 16, title: "2025 패션 트렌드: 소재와 지속가능성", images: ["/images/content16.png"] },
];

// ✅ 훅 (isMock 플래그로 전환 가능)
// isMock === true  → mock 사용
// isMock === false → 서버 데이터 사용
export function usePosts(
  selectedCategory: string | null,
  isMock = true
): UsePostsResult {
  // 🔹 1) Mock 모드
  if (isMock) {
    const filtered = selectedCategory
      ? mockContents.filter((item) =>
          item.title.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      : mockContents;

    return {
      data: filtered,
      isLoading: false,
      error: null,
    };
  }

  // 🔹 2) 서버 모드
  const {
    data,
    isLoading,
    error,
  } = useQuery<PostResponseDto[], Error>({
    queryKey: ["posts", "list", selectedCategory],
    queryFn: () => fetchPostsByStatus("PUBLISHED"),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const filtered = selectedCategory
    ? data?.filter((item) =>
        item.title.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    : data;

  return {
    data: filtered,
    isLoading,
    error: error ?? null,
  };
}
