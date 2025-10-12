// src/features/bookmarks/hooks/useBookmarks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  toggleBookmark,
  addBookmark,
  removeBookmark,
  fetchBookmarks,
} from "../api/bookmarksApi";

export const useBookmarks = () => {
  const queryClient = useQueryClient();

  // ✅ 내 북마크 전체 조회
  const { data: bookmarkIds = [], isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
  });

  // ✅ 북마크 토글
  const { mutate: toggleBookmarkMutate } = useMutation({
    mutationFn: toggleBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (err) => {
      console.error("북마크 토글 실패:", err);
    },
  });

  // ✅ 강제 추가
  const { mutate: addBookmarkMutate } = useMutation({
    mutationFn: addBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (err) => {
      console.error("북마크 추가 실패:", err);
    },
  });

  // ✅ 삭제
  const { mutate: removeBookmarkMutate } = useMutation({
    mutationFn: removeBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (err) => {
      console.error("북마크 삭제 실패:", err);
    },
  });

  return {
    bookmarkIds, // postId 배열
    isLoading,
    toggleBookmarkMutate,
    addBookmarkMutate,
    removeBookmarkMutate,
  };
};
