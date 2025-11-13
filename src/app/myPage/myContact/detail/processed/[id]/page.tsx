"use client";

import React, { useMemo } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Header from "@/components/header";
import MobileMenu from "@/components/mobileMenu";
import { FiPaperclip } from "react-icons/fi";
import { useEnquiry } from "@/features/enquiries/hooks/useEnquiry";
import { useComments } from "@/features/comments/hooks/useComments";

export default function ProcessedDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const enquiryId = Number(id);

  const [menuOpen, setMenuOpen] = React.useState(false);

  if (!Number.isFinite(enquiryId)) return notFound();

  // 문의 상세
  const { data, isLoading, error } = useEnquiry(enquiryId);

  // 댓글 목록 (해당 문의)
  const {
    data: comments,
    isLoading: cLoading,
    error: cError,
  } = useComments(enquiryId);

  // 최신 "답변" 하나만 보여주기 (PUBLISHED 우선)
  const latestAnswer = useMemo(() => {
    if (!comments || comments.length === 0) return undefined;

    // 상태 필드명이 status가 아니라면 여기서 맞춰줘야 함 (예: c.enquiryStatus === "PUBLISHED")
    const published = comments.filter((c) => c.status === "PUBLISHED");

    const targetList = published.length > 0 ? published : comments;

    return [...targetList].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];
  }, [comments]);

  if (isLoading) return <div className="p-6">불러오는 중...</div>;
  if (error) return <div className="p-6">오류가 발생했습니다.</div>;
  if (!data) return notFound();
  if (data.status !== "PUBLISHED") return notFound();

  const {
    category,
    authorName,
    authorEmail,
    createdAt,
    title,
    content,
    attachments,
  } = data as any;

  return (
    <div className="flex flex-col bg-white text-[#1D1D1D] pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="w-full flex justify-center px-4">
        <div className="w-full px-[5%] lg:px-[22.5%] mt-20">
          {/* 카테고리 */}
          <p className="text-lg font-bold mb-2">[ {category ?? "문의"} ]</p>

          {/* 유저 정보 */}
          <div className="flex items-center gap-3 mb-1 border-y border-gray-300 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-300" />
            <span className="text-sm font-medium">{authorName ?? "익명"}</span>
            {authorEmail && (
              <span className="text-sm text-[#8E8E8E]">{authorEmail}</span>
            )}
            <span className="ml-auto text-sm">
              {new Date(createdAt).toLocaleDateString("ko-KR")}
            </span>
            <span className="text-sm text-green-600">[답변완료]</span>
          </div>

          {/* 문의 본문 */}
          <div className="py-8">
            <p className="text-base font-bold mb-6">{title}</p>

            <p className="whitespace-pre-line text-sm leading-relaxed">
              {content}
            </p>

            {/* 첨부 파일 */}
            {Array.isArray(attachments) && attachments.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-[#000000] mt-10 flex-wrap">
                <span>첨부파일 {attachments.length}개</span>
                <FiPaperclip className="text-gray-500" />
                {attachments.map((f: any, i: number) => (
                  <a
                    key={i}
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#8E8E8E] underline underline-offset-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {f.fileName ?? `attachment-${i + 1}`}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="w-full h-[1px] bg-[#4a5565] mb-3" />

          {/* ✅ 답변 표시 (최신 댓글 기반, 읽기 전용) */}
          <div className="flex flex-1 flex-row mt-7 mb-15 gap-2">
            <p className="w-1/10 py-3 text-base font-bold flex-nowrap text-left">
              답변
            </p>
            <div className="w-full leading-relaxed">
              <div className="w-full p-3 border border-gray-300 rounded-lg text-sm whitespace-pre-line">
                {cLoading
                  ? "답변을 불러오는 중…"
                  : cError
                  ? "답변을 불러오지 못했습니다."
                  : latestAnswer?.content || "등록된 답변이 없습니다."}
              </div>
              <p className="text-right mt-3 text-xs text-gray-600">
                {latestAnswer
                  ? (latestAnswer.updatedAt || latestAnswer.createdAt).slice(
                      0,
                      10
                    )
                  : new Date(createdAt).toISOString().slice(0, 10)}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="flex justify-end w-full px-[5%] lg:px-[22.5%] pt-[3%] pb-[8%]">
        <button
          onClick={() => router.back()}
          className="bg-[#FF4545] text-white px-6 py-1.5 rounded-full text-sm font-medium"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}
