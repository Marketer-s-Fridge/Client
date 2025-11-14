// src/features/enquiries/hooks/useMyEnquiries.ts
import { useQuery } from "@tanstack/react-query";
import { fetchMyEnquiries } from "../api/enquiriesApi";
import { EnquiryResponseDto, PaginatedResponse } from "../types";

type Direction = "asc" | "desc";
type SortBy = "createdAt" | "updatedAt" | "title";

export function useMyEnquiries(
  page = 1,
  size = 10,
  sortBy: SortBy = "createdAt",
  direction: Direction = "desc"
) {
  return useQuery<
    EnquiryResponseDto[],                // queryFn 반환값
    Error,                               // 에러 타입
    PaginatedResponse<EnquiryResponseDto> // select 후 최종 데이터 타입
  >({
    queryKey: ["myEnquiries", page, size, sortBy, direction],

    /** 원본 데이터 가져오기 */
    queryFn: () => fetchMyEnquiries(),   // 실제 API는 전체 배열 반환

    /** React Query v5 옵션 */
    staleTime: 2 * 60 * 1000,            // 2분 동안 재요청 X
    gcTime: 10 * 60 * 1000,              // 캐시 10분 유지
    refetchOnWindowFocus: false,         // 탭 이동 시 재요청 X
    retry: false,

    /** 페이지네이션 + 정렬 + slicing 처리 */
    select: (rows) => {
      const sorted = [...rows].sort((a, b) => {
        const av = a[sortBy] as unknown as string;
        const bv = b[sortBy] as unknown as string;

        const cmp = sortBy.includes("At")
          ? new Date(av).getTime() - new Date(bv).getTime()
          : av.localeCompare(bv);

        return direction === "asc" ? cmp : -cmp;
      });

      const totalElements = sorted.length;
      const totalPages = Math.max(1, Math.ceil(totalElements / size));
      const start = (page - 1) * size;

      return {
        content: sorted.slice(start, start + size),
        totalElements,
        totalPages,
        page,
        size,
      };
    },
  });
}
