// hooks/useSearchHistory.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { saveSearchKeyword,fetchPopularSearchKeywords } from "../api/searchHistory";
import { SearchHistoryRequestDto,PopularSearchResponse } from "../types";

/** ✅ 최근 검색어 조회 */
export const usePopularSearchKeywords = () => {
  return useQuery<PopularSearchResponse>({
    queryKey: ["popularSearchKeywords"],
    queryFn: fetchPopularSearchKeywords,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });
};

/** ✅ 검색어 저장 (검색 시 호출) */
export const useSaveSearchKeyword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: SearchHistoryRequestDto) => saveSearchKeyword(dto),
    onSuccess: () => {
      // ✅ 성공 시 인기 검색어 갱신
      queryClient.invalidateQueries({ queryKey: ["popularSearchKeywords"] });
    },
  });
};
