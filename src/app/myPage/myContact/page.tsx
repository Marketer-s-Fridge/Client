"use client";

import Header from "@/components/header";
import Banner from "@/components/banner";
import React from "react";
import { useRouter } from "next/navigation";

export default function MyContact() {
  const router = useRouter();
  const inquiries = Array.from({ length: 9 }).map((_, idx) => ({
    no: 9 - idx,
    title: "프로필 사진 업데이트가 안 돼요",
    date: `2025/05/${(10 - idx).toString().padStart(2, "0")}`,
    status: "답변완료",
  }));

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <Banner title="내 문의 내역" />

      <main className="max-w-[1024px] mx-auto px-4 sm:px-6 py-12 text-sm">
        {/* 상단 요약 */}
        <div className="flex justify-between items-center mb-4">
          <p>
            총 문의: <span className="text-red-500 font-semibold">9건</span>
          </p>
          <div className="relative">
            <select className="border border-gray-400 rounded px-1 py-1">
              <option>최신순</option>
              <option>오래된순</option>
            </select>
          </div>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-t ">
            <thead className="border-b-2 border-t-2 border-black">
              <tr className="h-10">
                <th className="w-[50px]">NO</th>
                <th>제목</th>
                <th className="w-[150px]">작성일</th>
                <th className="w-[100px]">처리상태</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((item) => (
                <tr key={item.no} className="h-10 ">
                  <td>{item.no}</td>
                  <td className="text-left px-15">{item.title}</td>
                  <td>{item.date}</td>
                  <td>{item.status}</td>
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

        <div className="flex justify-center mt-8 gap-2 text-sm">
          <button>{"<"}</button>
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              className={`w-8 h-8 rounded-full ${
                num === 1 ? "bg-red-500 text-white" : "text-gray-700"
              }`}
            >
              {num}
            </button>
          ))}
          <button>{">"}</button>
        </div>
      </main>
    </div>
  );
}
