// src/features/bookmarks/hooks/useBookmarks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  toggleBookmark,
  addBookmark,
  removeBookmark,
  fetchBookmarks,
} from "../api/bookmarksApi";
import { isLoggedIn } from "@/utils/isLoggedIn";

export const useBookmarks = () => {
  const queryClient = useQueryClient();
  const loggedIn = isLoggedIn();

  const {
    data: bookmarkIds = [],
    isLoading,
  } = useQuery<number[]>({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: loggedIn, // 🔥 로그인 안 되어 있으면 요청 자체 안 감
  });

  const { mutate: toggleBookmarkMutate } = useMutation({
    mutationFn: async (postId: number) => {
      if (!isLoggedIn()) {
        console.warn("⛔ 로그인되지 않아 북마크 토글 요청을 건너뜁니다.");
        return;
      }
      return toggleBookmark(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const { mutate: addBookmarkMutate } = useMutation({
    mutationFn: async (postId: number) => {
      if (!isLoggedIn()) {
        console.warn("⛔ 로그인되지 않아 북마크 추가 요청을 건너뜁니다.");
        return;
      }
      return addBookmark(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const { mutate: removeBookmarkMutate } = useMutation({
    mutationFn: async (postId: number) => {
      if (!isLoggedIn()) {
        console.warn("⛔ 로그인되지 않아 북마크 제거 요청을 건너뜁니다.");
        return;
      }
      return removeBookmark(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  return {
    bookmarkIds: loggedIn ? bookmarkIds : [], // 로그아웃이면 빈 배열
    isLoading: loggedIn ? isLoading : false,
    toggleBookmarkMutate,
    addBookmarkMutate,
    removeBookmarkMutate,
  };
};
