// types/visitorStats.ts

/** 🔹 방문자 추적 요청 쿼리 (첫 진입 시 호출) */
export interface VisitorTrackQuery {
  /** 방문 페이지 경로 (optional) */
  path?: string;
}

/** 🔹 세션 기준 방문 통계 조회 응답 DTO */
export interface SessionStats {
  /** 오늘 발생한 세션 수 */
  today: number;
  /** 이번 달 발생한 세션 수 */
  thisMonth: number;
  /** 전체 누적 세션 수 */
  all: number;
}
