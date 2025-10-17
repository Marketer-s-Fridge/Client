// types/visitorStats.ts

/** 🔹 방문자 추적 요청 쿼리 */
export interface VisitorTrackQuery {
    /** 방문 페이지 경로 (optional) */
    path?: string;
  }
  
  /** 🔹 세션 기준 방문 통계 조회 응답 */
  export interface SessionStats {
    totalVisits: number;     // 전체 방문 수
    uniqueVisitors: number;  // 고유 방문자 수
    sessions: number;        // 세션 수
    averageDuration: number; // 평균 체류 시간 (초 단위)
  }
  