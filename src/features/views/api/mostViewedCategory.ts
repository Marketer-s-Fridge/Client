// src/features/views/api/mostViewedCategory.ts
import api from "@/lib/apiClient";
import {
  MostViewedCategoryRequestDto,
  MostViewedCategoryResponseDto,
} from "../types";

/** ✅ 내 카테고리별 조회수 통계 */
export const fetchCategoryStats = async (): Promise<Record<string, number>> => {
  const res = await api.get<Record<string, number> | null>(
    "/api/most-viewed-category/stats",
    {
      // 200, 204 모두 "성공"으로 취급
      validateStatus: (status) => status === 200 || status === 204,
    }
  );

  // 204거나, data가 없거나, 형식이 이상하면 빈 객체 리턴
  if (res.status === 204 || !res.data) {
    return {};
  }
  if (typeof res.data !== "object" || Array.isArray(res.data)) {
    return {};
  }

  return res.data;
};

/** ✅ 내가 가장 많이 본 카테고리 */
export const fetchMostViewedCategory = async (): Promise<string | null> => {
  const res = await api.get<string | null>("/api/most-viewed-category", {
    validateStatus: (status) =>
      status === 200 || status === 204 || status === 404,
  });

  if (res.status === 204 || res.status === 404) {
    return null;
  }
  if (!res.data) {
    return null;
  }
  return res.data;
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

/** ✅ 최근 조회한 게시물 목록 */
export const fetchRecentViews = async (): Promise<
  MostViewedCategoryResponseDto[]
> => {
  const res = await api.get<MostViewedCategoryResponseDto[] | "" | null>(
    "/api/most-viewed-category/recentViews",
    {
      // 200, 204 모두 허용
      validateStatus: (status) => status === 200 || status === 204,
    }
  );

  // 204거나 data가 없으면 빈 배열
  if (res.status === 204 || !res.data) {
    return [];
  }

  // 혹시 문자열 같은 이상한 값 들어오면 방어
  if (!Array.isArray(res.data)) {
    return [];
  }

  return res.data;
};
