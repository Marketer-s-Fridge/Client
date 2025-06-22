"use client";

import Header from "@/components/header";
import Banner from "@/components/banner";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import Pagination from "@/components/pagination";
import CustomDropdown from "@/components/customDropdown";

export default function MyContact() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  // 샘플 문의 리스트 생성
  const inquiries = Array.from({ length: 9 }).map((_, idx) => ({
    no: 9 - idx,
    title: "프로필 사진 업데이트가 안 돼요",
    date: `2025/05/${(10 - idx).toString().padStart(2, "0")}`,
    status: idx % 2 === 0 ? "답변완료" : "미답변", // 짝수: 완료, 홀수: 미답변
  }));

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <Banner title="내 문의 내역" />

      <main className="max-w-[1024px] mx-auto px-4 sm:px-6 py-12 text-sm">
        {/* 상단 요약 */}
        <div className="flex justify-between items-center mb-4">
          <p>
            총 문의:
            <span className="text-red-500 font-semibold">
              {inquiries.length}건
            </span>
          </p>
          <div className="relative w-27">
            <CustomDropdown
              options={["최신순", "오래된순"]}
              label="최신순"
              onSelect={(value) => {
                // TODO: 정렬 로직 연결
                console.log("선택된 정렬:", value);
              }}
              buttonClassName="rounded-lg"
            />
          </div>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto text-[10px] sm:text-[13px]">
          <table className="w-full text-center border-t">
            <thead className="border-b-2 border-t-2 border-black ">
              <tr className="h-10">
                <th className="w-[50px]">NO</th>
                <th>제목</th>
                <th className="w-[150px]">작성일</th>
                <th className="w-[100px]">처리상태</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((item) => (
                <tr
                  key={item.no}
                  onClick={() =>
                    router.push(
                      item.status === "답변완료"
                        ? `./myContact/detail/processed`
                        : `./myContact/detail/unprocessed`
                    )
                  }
                  className="h-10 hover:bg-gray-100 cursor-pointer"
                >
                  <td className="rounded-l-lg hover:bg-gray-100 h-10">
                    {item.no}
                  </td>
                  <td className="text-left px-4">{item.title}</td>
                  <td>{item.date}</td>
                  <td className="rounded-r-lg">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 하단 버튼 + 페이지네이션 */}
        <div className="flex justify-between items-center mt-6">
          <div></div>
          <button
            onClick={() => router.push("/contact")}
            className="cursor-pointer bg-red-500 text-white px-4 py-1 rounded-full text-xs hover:bg-red-600"
          >
            글쓰기
          </button>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </main>
      <Footer />
    </div>
  );
}
