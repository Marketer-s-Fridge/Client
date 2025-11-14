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

  const {
    data: bookmarkIds = [],
    isLoading,
  } = useQuery<number[]>({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
    staleTime: 5 * 60 * 1000,        // 5분 동안 재요청 X
    gcTime: 10 * 60 * 1000,          // 캐시 10분 유지
    refetchOnWindowFocus: false,
  });

  const { mutate: toggleBookmarkMutate } = useMutation({
    mutationFn: toggleBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const { mutate: addBookmarkMutate } = useMutation({
    mutationFn: addBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const { mutate: removeBookmarkMutate } = useMutation({
    mutationFn: removeBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  return {
    bookmarkIds,
    isLoading,
    toggleBookmarkMutate,
    addBookmarkMutate,
    removeBookmarkMutate,
  };
};
