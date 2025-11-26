// hooks/useSearchHistory.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { saveSearchKeyword,fetchPopularSearchKeywords } from "../api/searchHistory";
import { SearchHistoryRequestDto,PopularSearchResponse } from "../types";
import { isLoggedIn } from "@/utils/isLoggedIn";

/** ✅ 최근 검색어 조회 (로그인 필요) */
export const usePopularSearchKeywords = () => {
  return useQuery<PopularSearchResponse>({
    queryKey: ["popularSearchKeywords"],
    queryFn: fetchPopularSearchKeywords,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
    enabled: isLoggedIn(),   // 🔥 로그인 안 되어 있으면 요청 자체가 안 감
  });
};

/** ✅ 검색어 저장 (로그인 필요) */
export const useSaveSearchKeyword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: SearchHistoryRequestDto) => {
      if (!isLoggedIn()) {
        console.warn("⛔ 로그인되지 않아 검색어 저장 건너뜀");
        return; // 🔥 서버 요청 안 보냄
      }
      return saveSearchKeyword(dto);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popularSearchKeywords"] });
    },
  });
};

