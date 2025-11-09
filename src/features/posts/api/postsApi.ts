// src/features/posts/api/postsApi.ts
import api from "@/lib/apiClient";
import {
  PostRequestDto,
  PostResponseDto,
  PostHitResponseDto,
} from "../types";

/** 게시 상태 enum */
export type PostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED";

/** 쿼리 파라미터 유틸: undefined면 제외 */
const qp = <T extends Record<string, any>>(obj?: T) => {
  if (!obj) return undefined;
  const clean: Record<string, any> = {};
  Object.keys(obj).forEach((k) => {
    const v = (obj as any)[k];
    if (v !== undefined && v !== null && v !== "") clean[k] = v;
  });
  return clean;
};

/** 응답에서 ETag 추출 */
const getEtag = (headers?: any) => headers?.etag || headers?.ETag || undefined;

/** =========================
 *  조회
 * ========================*/

/** ✅ 전체 게시물 조회 */
export const fetchPosts = async (): Promise<PostResponseDto[]> => {
  console.log("📡 [게시물 전체 조회 요청] /api/posts");
  const res = await api.get<PostResponseDto[]>("/api/posts");
  console.log("✅ [게시물 전체 조회 성공]", res.data);
  return res.data;
};

/** ✅ 게시된 게시물 수 조회 */
export const fetchPublishedCount = async (): Promise<number> => {
  console.log("📊 [게시된 게시물 수 요청] /api/posts/count/published");
  const res = await api.get<number>("/api/posts/count/published");
  console.log("✅ [게시된 게시물 수 조회 성공]", res.data);
  return res.data;
};

/** ✅ 게시된 게시물 n개 조회 (기본 6개) */
export const fetchPublishedPosts = async (
  limit?: number
): Promise<PostResponseDto[]> => {
  console.log("📄 [게시된 게시물 조회 요청]", { limit });
  const res = await api.get<PostResponseDto[]>("/api/posts/published", {
    params: qp({ limit }),
  });
  console.log("✅ [게시된 게시물 조회 성공]", res.data);
  return res.data;
};

/** ✅ 게시물 상세 조회 (+뷰 카운트) */
export const fetchPost = async (id: number): Promise<PostResponseDto> => {
  console.log(`🔍 [게시물 상세 조회 요청] postId=${id}`);
  const res = await api.get<PostResponseDto>(`/api/posts/${id}`);
  console.log("✅ [게시물 상세 조회 성공]", res.data);
  return res.data;
};

/** ✅ 게시물 상세 + ETag 동시 획득 */
export const fetchPostWithEtag = async (
  id: number
): Promise<{ data: PostResponseDto; etag?: string }> => {
  console.log(`🔍 [게시물 상세+ETag 요청] postId=${id}`);
  const res = await api.get<PostResponseDto>(`/api/posts/${id}`);
  const etag = getEtag(res.headers);
  console.log("✅ [게시물 상세+ETag 성공]", { etag });
  return { data: res.data, etag };
};

/** ✅ 상태별 게시물 조회 */
export const fetchPostsByStatus = async (
  status: PostStatus
): Promise<PostResponseDto[]> => {
  console.log(`📂 [상태별 게시물 조회 요청] status=${status}`);
  const res = await api.get<PostResponseDto[]>("/api/posts/by-status", {
    params: { postStatus: status },
  });
  console.log("✅ [상태별 게시물 조회 성공]", res.data);
  return res.data;
};

/** ✅ 카테고리별 게시물 조회 */
export const fetchByCategory = async (
  category: string,
  limit?: number
): Promise<PostResponseDto[]> => {
  console.log("🏷️ [카테고리별 게시물 조회 요청]", { category, limit });
  const res = await api.get<PostResponseDto[]>("/api/posts/by-category", {
    params: qp({ category, limit }),
  });
  console.log("✅ [카테고리별 게시물 조회 성공]", res.data);
  return res.data;
};

/** ✅ 에디터 픽 목록 */
export const fetchEditorPicks = async (
  limit?: number
): Promise<PostResponseDto[]> => {
  console.log("⭐ [에디터 픽 조회 요청]", { limit });
  const res = await api.get<PostResponseDto[]>("/api/posts/editor-picks", {
    params: qp({ limit }),
  });
  console.log("✅ [에디터 픽 조회 성공]", res.data);
  return res.data;
};

/** ✅ 핫 콘텐츠(조회수 기준) */
export const fetchHotPosts = async (
  limit?: number
): Promise<PostResponseDto[]> => {
  console.log("🔥 [핫 콘텐츠 조회 요청]", { limit });
  const res = await api.get<PostResponseDto[]>("/api/posts/hot", {
    params: qp({ limit }),
  });
  console.log("✅ [핫 콘텐츠 조회 성공]", res.data);
  return res.data;
};

/** =========================
 *  생성/수정/게시/예약
 * ========================*/

/** ✅ 임시 저장 생성 */
export const createDraft = async (
  dto: PostRequestDto
): Promise<{ data: PostResponseDto; etag?: string }> => {
  console.log("📝 [임시 저장 생성 요청]", dto);
  const res = await api.post<PostResponseDto>("/api/posts/drafts", dto);
  const etag = getEtag(res.headers);
  console.log("✅ [임시 저장 생성 성공]", { etag });
  return { data: res.data, etag };
};

/** ✅ 임시/예약 글 업데이트 (If-Match 옵션) */
export const updateDraft = async (
  id: number,
  dto: PostRequestDto,
  etag?: string
): Promise<{ data: PostResponseDto; etag?: string }> => {
  console.log(`✏️ [임시/예약 글 업데이트 요청] postId=${id}`, dto);
  const res = await api.patch<PostResponseDto>(`/api/posts/drafts/${id}`, dto, {
    headers: qp({ "If-Match": etag }),
  });
  const newTag = getEtag(res.headers);
  console.log("✅ [임시/예약 글 업데이트 성공]", { etag: newTag });
  return { data: res.data, etag: newTag };
};

/** ✅ 게시 (신규/업서트) (If-Match 옵션) */
export const createPost = async (
  dto: PostRequestDto,
  etag?: string
): Promise<PostResponseDto> => {
  console.log("🚀 [게시글 업로드 요청]", dto);
  const res = await api.post<PostResponseDto>("/api/posts/publish", dto, {
    headers: qp({ "If-Match": etag }),
  });
  console.log("✅ [게시글 업로드 성공]", res.data);
  return res.data;
};

/** ✅ 예약 업서트 (If-Match 옵션) */
export const schedulePost = async (
  dto: PostRequestDto,
  etag?: string
): Promise<PostResponseDto> => {
  console.log("⏰ [예약 게시글 요청]", dto);
  const res = await api.post<PostResponseDto>("/api/posts/schedule", dto, {
    headers: qp({ "If-Match": etag }),
  });
  console.log("✅ [예약 게시글 성공]", res.data);
  return res.data;
};

/** ✅ 에디터 픽 설정/해제 */
export const setEditorPick = async (
  postId: number,
  editorPick: boolean
): Promise<PostResponseDto> => {
  console.log("⭐ [에디터 픽 설정 요청]", { postId, editorPick });
  const res = await api.patch<PostResponseDto>(
    `/api/posts/${postId}/editor-pick`,
    { editorPick }
  );
  console.log("✅ [에디터 픽 설정 성공]", res.data);
  return res.data;
};

/** =========================
 *  삭제/카운트
 * ========================*/

/** ✅ 게시물 삭제 (204 기대) */
export const deletePost = async (id: number): Promise<void> => {
  console.log(`🗑️ [게시물 삭제 요청] postId=${id}`);
  const res = await api.delete(`/api/posts/${id}`);
  if (res.status !== 204) {
    console.warn("⚠️ 예상과 다른 삭제 응답 코드", res.status);
  }
  console.log("✅ [게시물 삭제 성공]");
};

/** ✅ 게시물 클릭 카운트 증가 */
export const increaseHit = async (
  id: number
): Promise<PostHitResponseDto> => {
  console.log(`👆 [게시물 클릭 카운트 요청] postId=${id}`);
  const res = await api.post<PostHitResponseDto>(`/api/posts/click/${id}`);
  console.log("✅ [게시물 클릭 카운트 성공]", res.data);
  return res.data;
};
