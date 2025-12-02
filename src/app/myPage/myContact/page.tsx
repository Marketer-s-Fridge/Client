// src/app/myPage/myContact/page.tsx (경로는 네 프로젝트에 맞게)
"use client";

import Header from "@/components/header";
import Banner from "@/components/banner";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import Pagination from "@/components/pagination";
import CustomDropdown from "@/components/customDropdown";
import MobileMenu from "@/components/mobileMenu";
import { fetchMyEnquiries } from "@/features/enquiries/api/enquiriesApi";
import { EnquiryResponseDto } from "@/features/enquiries/types";
import BaseConfirmButton from "@/components/baseConfirmButton";

const PAGE_SIZE = 10;

export default function MyContact() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const [inquiries, setInquiries] = useState<EnquiryResponseDto[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMyEnquiries = async () => {
      try {
        setLoading(true);
        const res = await fetchMyEnquiries();

        const list: EnquiryResponseDto[] = Array.isArray(res) ? res : [];
        setInquiries(list);
        setTotalPages(Math.max(1, Math.ceil(list.length / PAGE_SIZE)));
      } catch (error) {
        console.error("내 문의 내역 조회 실패:", error);
        setInquiries([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    loadMyEnquiries();
  }, []);

  const hasInquiries = inquiries.length > 0;

  const sortedInquiries = useMemo(() => {
    const copy = [...inquiries];
    return copy.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
    });
  }, [inquiries, sortOrder]);

  const paginatedInquiries = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return sortedInquiries.slice(start, end);
  }, [sortedInquiries, currentPage]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(inquiries.length / PAGE_SIZE));
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
    setTotalPages(maxPage);
  }, [inquiries.length, currentPage]);

  return (
    <div className="bg-white min-h-screen pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Banner title="내 문의 내역" />

      <main className="max-w-[1024px] mx-auto px-4 sm:px-6 py-12 text-sm">
        {/* 상단 요약 */}
        <div className="flex justify-between items-center mb-4">
          <p>
            총 문의:{" "}
            <span className="text-red-500 font-semibold">
              {inquiries.length}건
            </span>
          </p>
          <div className="relative w-27">
            <CustomDropdown
              options={["최신순", "오래된순"]}
              label={sortOrder === "desc" ? "최신순" : "오래된순"}
              onSelect={(value) => {
                setSortOrder(value === "최신순" ? "desc" : "asc");
                setCurrentPage(1);
              }}
              buttonClassName="rounded-lg"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-10">불러오는 중...</p>
        ) : !hasInquiries ? (
          <>
            <p className="text-gray-500 text-center py-10">
              작성한 문의가 없습니다.
            </p>
            <div className="flex justify-center sm:justify-end mt-4 w-full">
              <BaseConfirmButton onClick={() => router.push("/contact")}>
                글쓰기
              </BaseConfirmButton>
            </div>
          </>
        ) : (
          <>
            {/* 테이블 (데스크탑) */}
            <div className="hidden sm:block overflow-x-auto text-[10px] sm:text-[13px]">
              <table className="w-full text-center border-t">
                <thead className="border-b-2 border-t-2 border-black">
                  <tr className="h-10">
                    <th className="w-[50px]">NO</th>
                    <th>제목</th>
                    <th className="w-[150px]">작성일</th>
                    <th className="w-[100px]">처리상태</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInquiries.map((item, idx) => {
                    const isDone = item.status === "PUBLISHED";
                    const no = idx + 1 + (currentPage - 1) * PAGE_SIZE;

                    return (
                      <tr
                        key={item.id}
                        onClick={() =>
                          router.push(
                            isDone
                              ? `/myPage/myContact/detail/processed/${item.id}`
                              : `/myPage/myContact/detail/unprocessed/${item.id}`
                          )
                        }
                        className="h-10 hover:bg-gray-100 cursor-pointer"
                      >
                        <td>{no}</td>
                        <td className="text-left px-4">{item.title}</td>
                        <td>
                          {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                        </td>
                        <td>
                          {isDone ? (
                            <span className="text-green-600 font-semibold">
                              답변완료
                            </span>
                          ) : (
                            <span className="text-yellow-600 font-semibold">
                              미답변
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 리스트 (모바일) */}
            <div className="sm:hidden space-y-3">
              {paginatedInquiries.map((item, idx) => {
                const isDone = item.status === "PUBLISHED";
                const no = idx + 1 + (currentPage - 1) * PAGE_SIZE;

                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      router.push(
                        isDone
                          ? `/myPage/myContact/detail/processed/${item.id}`
                          : `/myPage/myContact/detail/unprocessed/${item.id}`
                      )
                    }
                    className="w-full text-left rounded-lg border border-gray-200 px-3 py-3 active:bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-medium text-[13px] leading-5">
                        {item.title}
                      </div>
                      <div className="shrink-0 text-[11px] text-gray-400">
                        NO {no}
                      </div>
                    </div>

                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] ${
                          isDone
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {isDone ? "답변완료" : "미답변"}
                      </span>
                    </div>

                    <div className="mt-1 text-[11px] text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                    </div>
                  </button>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}

            {/* 🔽 하단 글쓰기 버튼: 모바일 중앙, 데스크탑 오른쪽 */}
            <div className="mt-4 flex w-full justify-center sm:justify-end">
              <BaseConfirmButton onClick={() => router.push("/contact")}>
                글쓰기
              </BaseConfirmButton>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
