// types.ts

/** 🔹 검색어 저장 요청 DTO */
export interface SearchHistoryRequestDto {
    /** 검색 키워드 */
    keyword: string;
  }
  
  /** 🔹 인기 검색어 조회 응답 */
  export type PopularSearchResponse = string[];