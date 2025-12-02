// src/app/enquiries/[id]/unprocessed/page.tsx
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import MobileMenu from "@/components/mobileMenu";
import { FiPaperclip } from "react-icons/fi";
import { useEnquiry } from "@/features/enquiries/hooks/useEnquiry";
import Image from "next/image";
import BaseConfirmButton from "@/components/baseConfirmButton";

export default function UnprocessedDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const enquiryId = Number(id);

  const [menuOpen, setMenuOpen] = React.useState(false);

  const isValidId = Number.isFinite(enquiryId);
  const { data, isLoading, error } = useEnquiry(enquiryId);

  // 잘못된 id
  if (!isValidId) {
    return (
      <div className="p-6">
        미답변 상태의 문의가 아닙니다.
        <BaseConfirmButton
          onClick={() => router.back()}
          className="mt-4 w-auto px-5 py-1.5 text-sm"
        >
          뒤로가기
        </BaseConfirmButton>
      </div>
    );
  }

  if (isLoading) return <div className="p-6">불러오는 중...</div>;
  if (error) return <div className="p-6">오류가 발생했습니다.</div>;

  // 이미 처리된 문의거나 데이터 없음
  if (!data || data.status === "PUBLISHED") {
    return (
      <div className="p-6">
        미답변 상태의 문의가 아닙니다.
        <BaseConfirmButton
          onClick={() => router.back()}
          className="mt-4 w-auto px-5 py-1.5 text-sm"
        >
          뒤로가기
        </BaseConfirmButton>
      </div>
    );
  }

  const { category, writer, writerEmail, createdAt, title, content, imageUrl } =
    data;

  const writerName: string = writer?.username ?? "익명";
  const writerProfileImage: string =
    writer?.profileImageUrl || "/images/default-profile.png";

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1D1D1D] pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 본문 */}
      <main className="w-full flex justify-center px-4 pb-16">
        {/* 가운데 정렬 + 최대 폭 제한 */}
        <div className="w-full max-w-3xl mt-10 md:mt-16">
          {/* 카테고리 */}
          <p className="text-base md:text-lg font-bold mb-3">
            [ {category ?? "문의"} ]
          </p>

          {/* 작성자 정보 */}
          <div className="flex items-center gap-3 border-y border-gray-200 py-3 text-sm">
            <Image
              src={writerProfileImage}
              alt="profile"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-medium">{writerName}</span>
            {writerEmail && (
              <span className="text-xs md:text-sm text-[#8E8E8E] truncate max-w-[40%] md:max-w-none">
                {writerEmail}
              </span>
            )}
            <span className="ml-auto text-xs md:text-sm text-gray-600">
              {new Date(createdAt).toLocaleDateString("ko-KR")}
            </span>
            <span className="text-xs md:text-sm text-yellow-600 whitespace-nowrap">
              [미답변]
            </span>
          </div>

          {/* 문의 본문 */}
          <section className="py-6 md:py-8">
            <h1 className="text-base md:text-lg font-bold mb-4 md:mb-6">
              {title}
            </h1>

            <p className="whitespace-pre-line text-sm md:text-base leading-relaxed text-[#333333]">
              {content}
            </p>

            {/* 첨부 파일 */}
            {imageUrl ? (
              <div className="mt-8 flex flex-wrap items-center gap-2 text-xs md:text-sm text-[#000000]">
                <span className="font-medium">첨부파일 1개</span>
                <FiPaperclip className="text-gray-500" />
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-[#8E8E8E] underline underline-offset-2"
                >
                  {typeof imageUrl === "string"
                    ? imageUrl.split("/").pop()
                    : "첨부파일"}
                </a>
              </div>
            ) : null}
          </section>

          <div className="h-px w-full bg-gray-200" />
        </div>
      </main>

      {/* 하단 버튼 – 모바일 꽉 / 데스크탑 오른쪽 */}
      <div className="w-full bg-white">
        <div className="mx-auto flex w-full max-w-3xl justify-end px-4 pb-10">
          <BaseConfirmButton
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-2 text-sm"
          >
            돌아가기
          </BaseConfirmButton>
        </div>
      </div>
    </div>
  );
}
