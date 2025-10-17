// api/mostViewedCategory.ts
import api from "@/lib/apiClient";

import {
  MostViewedCategoryRequestDto,
  MostViewedCategoryResponseDto,
} from "../types";

/** ✅ 내 카테고리별 조회수 통계 */
export const fetchCategoryStats = async (): Promise<Record<string, number>> => {
  const res = await api.get<Record<string, number>>(
    "/most-viewed-category/stats"
  );
  return res.data;
};

/** ✅ 내가 가장 많이 본 카테고리 */
export const fetchMostViewedCategory = async (): Promise<string | null> => {
  try {
    const res = await api.get<string>("/most-viewed-category");
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 204) return null; // 데이터 없음
    throw err;
  }
};

/** ✅ 조회 기록 반영 */
export const postViewRecord = async (
  dto: MostViewedCategoryRequestDto
): Promise<MostViewedCategoryResponseDto> => {
  const res = await api.post<MostViewedCategoryResponseDto>(
    "/most-viewed-category",
    dto
  );
  return res.data;
};

/** ✅ 최근 조회한 게시물 목록 */
export const fetchRecentViews = async (): Promise<
  MostViewedCategoryResponseDto[]
> => {
  const res = await api.get<MostViewedCategoryResponseDto[]>(
    "/most-viewed-category/recentViews"
  );
  return res.data;
};
