// hooks/useMostViewedCategory.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MostViewedCategoryRequestDto, MostViewedCategoryResponseDto } from "../types";
import { fetchCategoryStats, fetchMostViewedCategory, fetchRecentViews, postViewRecord } from "../api/mostViewedCategory";

/** ✅ 내 카테고리별 조회수 통계 */
export const useCategoryStats = () => {
    return useQuery<Record<string, number>>({
        queryKey: ["categoryStats"],
        queryFn: fetchCategoryStats,
        staleTime: 1000 * 60 * 10, // 10분 캐시
    });
};

/** ✅ 내가 가장 많이 본 카테고리 */
export const useMostViewedCategory = () => {
    return useQuery<string | null>({
        queryKey: ["mostViewedCategory"],
        queryFn: fetchMostViewedCategory,
        staleTime: 1000 * 60 * 5,
    });
};

/** ✅ 조회 기록 반영 (POST) */
export const usePostViewRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: MostViewedCategoryRequestDto) => postViewRecord(dto),
        onSuccess: () => {
            // 조회 후 관련 데이터 갱신
            queryClient.invalidateQueries({ queryKey: ["categoryStats"] });
            queryClient.invalidateQueries({ queryKey: ["mostViewedCategory"] });
            queryClient.invalidateQueries({ queryKey: ["recentViews"] });
        },
    });
};

/** ✅ 최근 조회한 게시물 목록 */
export const useRecentViews = () => {
    return useQuery<MostViewedCategoryResponseDto[]>({
        queryKey: ["recentViews"],
        queryFn: fetchRecentViews,
        staleTime: 1000 * 60 * 3, // 3분 캐시
    });
};
