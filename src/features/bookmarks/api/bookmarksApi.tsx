// src/features/bookmarks/api/bookmarksApi.ts
import api from "@/lib/apiClient";
import { BookmarkToggleResponse, BookmarkListResponse } from "../types";

// ✅ 북마크 토글 (추가/해제)
export const toggleBookmark = async (postId: number): Promise<BookmarkToggleResponse> => {
  console.log(`🔁 [북마크 토글 요청] postId=${postId}`);
  try {
    const res = await api.post<BookmarkToggleResponse>(`/bookmarks/${postId}/toggle`);
    console.log("✅ [북마크 토글 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [북마크 토글 실패]:", error);
    throw error;
  }
};

// ✅ 북마크 강제 추가
export const addBookmark = async (postId: number): Promise<void> => {
  console.log(`➕ [북마크 추가 요청] postId=${postId}`);
  try {
    await api.post(`/bookmarks/${postId}`);
    console.log("✅ [북마크 추가 성공]");
  } catch (error: any) {
    console.error("❌ [북마크 추가 실패]:", error);
    throw error;
  }
};

// ✅ 북마크 삭제
export const removeBookmark = async (postId: number): Promise<void> => {
  console.log(`🗑️ [북마크 삭제 요청] postId=${postId}`);
  try {
    await api.delete(`/bookmarks/${postId}`);
    console.log("✅ [북마크 삭제 성공]");
  } catch (error: any) {
    console.error("❌ [북마크 삭제 실패]:", error);
    throw error;
  }
};

// ✅ 내 북마크 전체 조회 (포스트 ID 목록)
export const fetchBookmarks = async (): Promise<BookmarkListResponse> => {
  console.log("📥 [내 북마크 목록 요청]");
  try {
    const res = await api.get<BookmarkListResponse>("/bookmarks");
    console.log("✅ [내 북마크 목록 조회 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [내 북마크 목록 조회 실패]:", error);
    throw error;
  }
};
