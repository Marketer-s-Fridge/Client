// src/features/bookmarks/types/bookmarksTypes.ts

/** 🔹 북마크 토글 응답 DTO
 *   POST /api/bookmarks/{postId}/toggle
 *   → 북마크가 추가되었는지 / 제거되었는지 여부
 */
export interface BookmarkToggleResponse {
  /** true = 북마크 추가됨, false = 북마크 해제됨 */
  bookmarked: boolean;
}

/** 🔹 북마크 강제 추가 (먹등)
 *   POST /api/bookmarks/{postId}
 *   → 성공 시 별도의 body 없이 200 OK만 내려올 가능성 큼
 *   → 백엔드에서 body를 안 주는 경우도 many, optional로 둠
 */
export interface BookmarkForceAddResponse {
  success?: boolean; // 서버에서 응답 body가 없으면 사용 안함
}

/** 🔹 북마크 삭제 (먹등)
 *   DELETE /api/bookmarks/{postId}
 *   → body 없이 200/204만 내려오는 경우가 대부분
 */
export interface BookmarkDeleteResponse {
  success?: boolean;
}

/** 🔹 내 북마크 전체 조회 (포스트 ID 목록)
 *   GET /api/bookmarks
 */
export type BookmarkListResponse = number[];

/** 🔹 공통 에러 포맷 (선택적으로 사용) */
export interface ApiError {
  status: number;
  message: string;
}
