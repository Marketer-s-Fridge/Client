// src/features/views/api/mostViewedCategory.ts
import api from "@/lib/apiClient";
import {
  MostViewedCategoryRequestDto,
  MostViewedCategoryResponseDto,
  RecentViewedResponseDto,
} from "../types";


/** ✅ 최근 본 콘텐츠 목록 */
export const fetchRecentViews = async (): Promise<RecentViewedResponseDto[]> => {
  const res = await api.get<RecentViewedResponseDto[]>("/api/views/recent");
  return res.data;
};

/** ✅ 카테고리 별 통계 (예: { "브랜딩": 10, "퍼포먼스": 5 }) */
export const fetchCategoryStats = async (): Promise<Record<string, number>> => {
  const res = await api.get<Record<string, number>>(
    "/api/views/category-stats"
  );
  return res.data;
};
/** ✅ 내가 가장 많이 본 카테고리 (백엔드 응답이 리스트면 여기서 1개 뽑기) */
export const fetchMostViewedCategory = async (): Promise<string | null> => {
  const res = await api.get<MostViewedCategoryResponseDto[]>(
    "/api/views/most-viewed-category"
  );

  const list = res.data;
  if (!list || list.length === 0) return null;

  // 가장 첫 번째 기록의 category 사용 (백엔드 정책에 맞게 조정 가능)
  return list[0].category;
};

/** ✅ 조회 기록 반영 */
export const postViewRecord = async (
  dto: MostViewedCategoryRequestDto
): Promise<MostViewedCategoryResponseDto> => {
  const res = await api.post<MostViewedCategoryResponseDto>(
    "/api/most-viewed-category",
    dto
  );
  return res.data;
};

