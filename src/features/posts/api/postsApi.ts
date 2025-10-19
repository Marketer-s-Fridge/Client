import api from "@/lib/apiClient";
import { PostRequestDto, PostResponseDto, PostHitResponseDto } from "../types";

/** ✅ 전체 게시물 조회 */
export const fetchPosts = async (): Promise<PostResponseDto[]> => {
  console.log("📡 [게시물 전체 조회 요청] /posts");
  try {
    const res = await api.get<PostResponseDto[]>("/api/posts");
    console.log("✅ [게시물 전체 조회 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [게시물 전체 조회 실패]:", error);
    throw error;
  }
};

/** ✅ 게시된 게시물 수 조회 */
export const fetchPublishedCount = async (): Promise<number> => {
  console.log("📊 [게시된 게시물 수 요청] /api/posts/count/published");
  try {
    const res = await api.get<number>("/api/posts/count/published");
    console.log("✅ [게시된 게시물 수 조회 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [게시된 게시물 수 조회 실패]:", error);
    throw error;
  }
};

/** ✅ 게시된 게시물 n개 조회 (기본 6개) */
export const fetchPublishedPosts = async (limit?: number): Promise<PostResponseDto[]> => {
  console.log("📄 [게시된 게시물 조회 요청]", { limit });
  try {
    const res = await api.get<PostResponseDto[]>("/api/posts/published", { params: { limit } });
    console.log("✅ [게시된 게시물 조회 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [게시된 게시물 조회 실패]:", error);
    throw error;
  }
};

/** ✅ 게시물 상세 조회 (+뷰 카운트) */
export const fetchPost = async (id: number): Promise<PostResponseDto> => {
  console.log(`🔍 [게시물 상세 조회 요청] postId=${id}`);
  try {
    const res = await api.get<PostResponseDto>(`/api/posts/${id}`);
    console.log("✅ [게시물 상세 조회 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [게시물 상세 조회 실패]:", error);
    throw error;
  }
};

/** ✅ 상태별 게시물 조회 */
export const fetchPostsByStatus = async (status: string): Promise<PostResponseDto[]> => {
  console.log(`📂 [상태별 게시물 조회 요청] status=${status}`);
  try {
    const res = await api.get<PostResponseDto[]>("/api/posts/by-status", {
      params: { postStatus: status },
    });
    console.log("✅ [상태별 게시물 조회 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [상태별 게시물 조회 실패]:", error);
    throw error;
  }
};

/** ✅ 임시 저장 생성 */
export const createDraft = async (dto: PostRequestDto): Promise<PostResponseDto> => {
  console.log("📝 [임시 저장 생성 요청]", dto);
  try {
    const res = await api.post<PostResponseDto>("/api/posts/drafts", dto);
    console.log("✅ [임시 저장 생성 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [임시 저장 생성 실패]:", error);
    throw error;
  }
};

/** ✅ 임시/예약 글 업데이트 */
export const updateDraft = async (id: number, dto: PostRequestDto): Promise<PostResponseDto> => {
  console.log(`✏️ [임시/예약 글 업데이트 요청] postId=${id}`, dto);
  try {
    const res = await api.patch<PostResponseDto>(`/api/posts/drafts/${id}`, dto);
    console.log("✅ [임시/예약 글 업데이트 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [임시/예약 글 업데이트 실패]:", error);
    throw error;
  }
};

/** ✅ 게시 (신규/업서트) */
export const createPost = async (dto: PostRequestDto): Promise<PostResponseDto> => {
  console.log("🚀 [게시글 업로드 요청]", dto);
  try {
    const res = await api.post<PostResponseDto>("/api/posts/publish", dto);
    console.log("✅ [게시글 업로드 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [게시글 업로드 실패]:", error);
    throw error;
  }
};

/** ✅ 예약 업서트 */
export const schedulePost = async (dto: PostRequestDto): Promise<PostResponseDto> => {
  console.log("⏰ [예약 게시글 요청]", dto);
  try {
    const res = await api.post<PostResponseDto>("/api/posts/schedule", dto);
    console.log("✅ [예약 게시글 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [예약 게시글 실패]:", error);
    throw error;
  }
};

/** ✅ 게시물 삭제 */
export const deletePost = async (id: number): Promise<void> => {
  console.log(`🗑️ [게시물 삭제 요청] postId=${id}`);
  try {
    await api.delete(`/api/posts/${id}`);
    console.log("✅ [게시물 삭제 성공]");
  } catch (error: any) {
    console.error("❌ [게시물 삭제 실패]:", error);
    throw error;
  }
};

/** ✅ 게시물 클릭 카운트 증가 */
export const increaseHit = async (id: number): Promise<PostHitResponseDto> => {
  console.log(`👆 [게시물 클릭 카운트 요청] postId=${id}`);
  try {
    const res = await api.post<PostHitResponseDto>(`/api/posts/click/${id}`);
    console.log("✅ [게시물 클릭 카운트 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [게시물 클릭 카운트 실패]:", error);
    throw error;
  }
};
