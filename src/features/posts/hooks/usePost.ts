// src/features/posts/hooks/usePost.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPost } from "../api/postsApi";
import { PostResponseDto } from "../types";

export function usePost(id: number | undefined) {
  return useQuery<PostResponseDto, Error>({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id!),   // enabled 때문에 ! 안전
    enabled: !!id,
    staleTime: 2 * 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
