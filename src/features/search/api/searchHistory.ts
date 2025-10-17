import api from "@/lib/apiClient";
import { SearchHistoryRequestDto, PopularSearchResponse } from "../types";

/** ✅ 검색어 저장 */
export const saveSearchKeyword = async (
  dto: SearchHistoryRequestDto
): Promise<void> => {
  await api.post("/searchHistory", dto);
};

/** ✅ 인기 검색어 조회 */
export const fetchPopularSearchKeywords = async (): Promise<PopularSearchResponse> => {
  const res = await api.get<PopularSearchResponse>("/searchHistory");
  return res.data;
};
