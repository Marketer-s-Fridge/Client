import api from "@/lib/apiClient";
import { SearchHistoryRequestDto, PopularSearchResponse } from "../types";

/** ✅ 검색어 저장 */
export const saveSearchKeyword = async (
  dto: SearchHistoryRequestDto
): Promise<void> => {
  console.log("💾 [검색어 저장 요청]", dto);
  try {
    await api.post("/searchHistory", dto);
    console.log("✅ [검색어 저장 성공]");
  } catch (error: any) {
    console.error("❌ [검색어 저장 실패]:", error);
    throw error;
  }
};

/** ✅ 인기 검색어 조회 */
export const fetchPopularSearchKeywords = async (): Promise<PopularSearchResponse> => {
  console.log("📊 [인기 검색어 조회 요청]");
  try {
    const res = await api.get<PopularSearchResponse>("/searchHistory");
    console.log("✅ [인기 검색어 조회 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [인기 검색어 조회 실패]:", error);
    throw error;
  }
};
