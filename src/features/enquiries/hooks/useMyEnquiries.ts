import { useQuery } from "@tanstack/react-query";
import { fetchMyEnquiries } from "../api/enquiriesApi";
import { EnquiryResponseDto, PaginatedResponse } from "../types"; // 없으면 아래 타입을 로컬 선언

type Direction = "asc" | "desc";
type SortBy = "createdAt" | "updatedAt" | "title";

export function useMyEnquiries(
  page: number,
  size: number,
  sortBy: SortBy = "createdAt",
  direction: Direction = "desc"
) {
  return useQuery<PaginatedResponse<EnquiryResponseDto>>({
    queryKey: ["myEnquiries", page, size, sortBy, direction],
    queryFn: () => fetchMyEnquiries(),              // ← 인자 제거, 배열 반환
    select: (rows: EnquiryResponseDto[]) => {
      // 정렬
      const sorted = [...rows].sort((a, b) => {
        const av = a[sortBy];
        const bv = b[sortBy];
        const cmp =
          sortBy.includes("At")
            ? new Date(String(av)).getTime() - new Date(String(bv)).getTime()
            : String(av).localeCompare(String(bv));
        return direction === "asc" ? cmp : -cmp;
      });

      // 페이징
      const totalElements = sorted.length;
      const totalPages = Math.max(1, Math.ceil(totalElements / size));
      const start = (page - 1) * size;
      const content = sorted.slice(start, start + size);

      // 서버 대신 클라에서 PaginatedResponse 형태로 가공
      return {
        content,
        totalElements,
        totalPages,
        page,
        size,
      } as PaginatedResponse<EnquiryResponseDto>;
    },
  });
}
