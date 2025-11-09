// src/features/posts/hooks/admin/useUpdateDraft.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDraft } from "../../api/postsApi";
import { PostRequestDto, PostResponseDto } from "../../types";

export function useUpdateDraft() {
  const queryClient = useQueryClient();

  return useMutation<PostResponseDto, Error, { id: number; dto: PostRequestDto }>(
    {
      // ← API 응답 {data, etag} 중 data만 리턴
      mutationFn: async ({ id, dto }) => {
        const res = await updateDraft(id, dto);
        return res.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["post", data.id] });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    }
  );
}
