// src/features/posts/hooks/admin/useCreatePost.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../api/postsApi";
import { PostRequestDto, PostResponseDto } from "../../types";

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation<PostResponseDto, Error, PostRequestDto>({
    mutationFn: (dto) => createPost(dto),   // ← 래핑해서 1인자만 전달
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
