// hooks/useMostViewedCategory.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MostViewedCategoryRequestDto,
  MostViewedCategoryResponseDto,
} from "../types";
import {
  fetchCategoryStats,
  fetchMostViewedCategory,
  fetchRecentViews,
  postViewRecord,
} from "../api/mostViewedCategory";

/** ✅ 내 카테고리별 조회수 통계 (GET /api/most-viewed-category/stats) */
export const useCategoryStats = () => {
  return useQuery<Record<string, number>>({
    queryKey: ["categoryStats"],
    queryFn: fetchCategoryStats,
    staleTime: 1000 * 60 * 10, // 10분 캐시
  });
};

/** ✅ 내가 가장 많이 본 카테고리 (GET /api/most-viewed-category)
 *  200 → 문자열, 204 → null 로 매핑
 */
export const useMostViewedCategory = () => {
  return useQuery<string | null>({
    queryKey: ["mostViewedCategory"],
    queryFn: fetchMostViewedCategory, // string | null 반환
    staleTime: 1000 * 60 * 5,
  });
};

/** ✅ 조회 기록 반영 (POST /api/most-viewed-category)
 *  성공 시 관련 쿼리들 무효화 → 통계 / 최다 조회 / 최근 조회 목록 자동 갱신
 */
export const usePostViewRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: MostViewedCategoryRequestDto) => postViewRecord(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryStats"] });
      queryClient.invalidateQueries({ queryKey: ["mostViewedCategory"] });
      queryClient.invalidateQueries({ queryKey: ["recentViews"] });
    },
  });
};

/** ✅ 최근 조회한 게시물 목록 (GET /api/most-viewed-category/recentViews)
 *  200 → 배열, 204 → [] 로 매핑 (api 함수에서 처리)
 */
export const useRecentViews = () => {
  return useQuery<MostViewedCategoryResponseDto[]>({
    queryKey: ["recentViews"],
    queryFn: fetchRecentViews, // 204일 때도 [] 반환
    staleTime: 1000 * 60 * 3, // 3분 캐시
    initialData: [], // 컴포넌트에서 항상 배열이라고 가정하고 map 가능
  });
};
