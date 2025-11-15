// types.ts

/** 🔹 검색어 저장 요청 DTO */
export interface SearchHistoryRequestDto {
    /** 검색 키워드 */
    keyword: string;
  }
  
  /** 🔹 인기 검색어 조회 응답 */
  export type PopularSearchResponse = string[];

  /** 🔹 검색 기록 응답 DTO */
export interface SearchHistoryResponseDto {
  /** 검색 히스토리 ID */
  id: number;

  /** 유저 ID (백엔드가 user 엔티티 대신 userId만 주는 경우를 기본으로 사용) */
  userId: number | null;

  /** 검색 키워드 */
  keyword: string;

  /** 해당 키워드 누적 검색 횟수 */
  searchCount: number;
}
