// src/features/posts/hooks/useImageUpload.ts
import { useMutation } from "@tanstack/react-query";
import { uploadSingleImage } from "@/lib/upload";

export function useImageUpload() {
  const mutation = useMutation({
    mutationFn: uploadSingleImage,
  });

  return {
    ...mutation, // mutate, mutateAsync, isPending 등 그대로 유지
    uploadSingle: mutation.mutateAsync,              // ✅ 예전처럼 쓸 수 있게 alias
    loading: mutation.isPending, // ✅ react-query 버전에 따라 둘 중 있는거 사용
  };
}
