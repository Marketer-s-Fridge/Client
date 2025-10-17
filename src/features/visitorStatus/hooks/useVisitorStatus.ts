// hooks/useVisitorStats.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { trackVisitor, fetchVisitorStats } from "../api/visitorStatus";
import { VisitorTrackQuery, SessionStats } from "../types";

/** ✅ 방문자 추적 (첫 진입 시 한 번만 호출) */
export const useTrackVisitor = () => {
  return useMutation({
    mutationFn: (query?: VisitorTrackQuery) => trackVisitor(query),
  });
};

/** ✅ 세션 기준 방문 통계 조회 */
export const useVisitorStats = () => {
  return useQuery<SessionStats>({
    queryKey: ["visitorStats"],
    queryFn: fetchVisitorStats,
    staleTime: 1000 * 60 * 10, // 10분 캐시
  });
};
