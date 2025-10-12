// src/features/bookmarks/types/bookmarksTypes.ts

// ✅ 개별 북마크 토글 응답 DTO
export interface BookmarkToggleResponse {
    bookmarked: boolean; // true면 북마크 추가됨, false면 해제됨
  }
  
  // ✅ 내 전체 북마크 조회 응답 DTO
  export type BookmarkListResponse = number[]; // 포스트 ID 배열
  
  // ✅ 에러 공통 포맷 (선택)
  export interface ApiError {
    status: number;
    message: string;
  }
  