// src/features/posts/hooks/usePostsByCategory.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchByCategory } from "../api/postsApi";
import type { PostResponseDto } from "../types";

export interface Content {
  id: number;
  title: string;
  images: string[];
}

type UsePostsByCategoryResult = {
  data: Content[];
  isLoading: boolean;
  error: Error | null;
};

/**
 * ✅ 카테고리별 게시물 조회 훅
 * - category가 null이면 쿼리 비활성화
 * - /api/posts/by-category 호출
 */
export function usePostsByCategory(
  category: string | null,
  limit?: number
): UsePostsByCategoryResult {
  const enabled = !!category;

  const { data, isLoading, error } = useQuery<PostResponseDto[], Error>({
    queryKey: ["posts", "by-category", category, limit],
    queryFn: () => {
      if (!category) return Promise.resolve([] as PostResponseDto[]);
      return fetchByCategory(category, limit);
    },
    enabled, // 카테고리 선택됐을 때만 호출
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // ✅ 서버 DTO → Content[] 매핑
  const mapped: Content[] =
    data?.map((post) => {
      const p = post as any;
      const images: string[] =
        p.images ??
        p.imageUrls ??
        (p.thumbnailUrl ? [p.thumbnailUrl] : []);

      return {
        id: p.id,
        title: p.title,
        images: images ?? [],
      };
    }) ?? [];

  return {
    data: mapped,
    isLoading,
    error: error ?? null,
  };
}
