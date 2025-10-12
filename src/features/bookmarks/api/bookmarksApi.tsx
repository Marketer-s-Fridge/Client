// src/features/bookmarks/api/bookmarksApi.ts
import api from "@/lib/apiClient";
import { BookmarkToggleResponse, BookmarkListResponse } from "../types";

// ✅ 북마크 토글 (추가/해제)
export const toggleBookmark = async (postId: number): Promise<BookmarkToggleResponse> => {
  const res = await api.post<BookmarkToggleResponse>(`/bookmarks/${postId}/toggle`);
  return res.data;
};

// ✅ 북마크 강제 추가
export const addBookmark = async (postId: number): Promise<void> => {
  await api.post(`/bookmarks/${postId}`);
};

// ✅ 북마크 삭제
export const removeBookmark = async (postId: number): Promise<void> => {
  await api.delete(`/bookmarks/${postId}`);
};

// ✅ 내 북마크 전체 조회 (포스트 ID 목록)
export const fetchBookmarks = async (): Promise<BookmarkListResponse> => {
  const res = await api.get<BookmarkListResponse>("/bookmarks");
  return res.data;
};
