"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import MobileMenu from "@/components/mobileMenu";
import { FiPaperclip } from "react-icons/fi";
import { useEnquiry } from "@/features/enquiries/hooks/useEnquiry";
import Image from "next/image";

export default function UnprocessedDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const enquiryId = Number(id);

  const [menuOpen, setMenuOpen] = React.useState(false);

  if (!Number.isFinite(enquiryId))
    return (
      <div className="p-6">
        처리 완료된 문의가 아닙니다.
        <button
          onClick={() => router.back()}
          className="ml-4 text-sm underline text-blue-500"
        >
          뒤로가기
        </button>
      </div>
    );

  const { data, isLoading, error } = useEnquiry(enquiryId);

  if (isLoading) return <div className="p-6">불러오는 중...</div>;
  if (error) return <div className="p-6">오류가 발생했습니다.</div>;
  if (!data)
    return (
      <div className="p-6">
        처리 완료된 문의가 아닙니다.
        <button
          onClick={() => router.back()}
          className="ml-4 text-sm underline text-blue-500"
        >
          뒤로가기
        </button>
      </div>
    );
  if (data.status === "PUBLISHED")
    return (
      <div className="p-6">
        처리 완료된 문의가 아닙니다.
        <button
          onClick={() => router.back()}
          className="ml-4 text-sm underline text-blue-500"
        >
          뒤로가기
        </button>
      </div>
    );

  const {
    category,
    writer,
    writerEmail,
    createdAt,
    title,
    content,
    imageUrl,
  } = data as any;

  // ✅ writer 방어
  const writerName: string = writer?.username ?? "익명";
  const writerProfileImage: string =
    writer?.profileImageUrl || "/images/default-profile.png";

  return (
    <div className="flex flex-col bg-white text-[#1D1D1D] pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="w-full flex justify-center px-4">
        <div className="w-full px-[5%] lg:px-[22.5%] mt-20">
          <p className="text-lg font-bold mb-2">[ {category ?? "문의"} ]</p>

          <div className="flex items-center gap-3 mb-1 border-y border-gray-300 py-2">
            {/* 작성자 사진 */}
            <Image
              src={writerProfileImage}
              alt="profile"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium">{writerName}</span>
            {writerEmail && (
              <span className="text-sm text-[#8E8E8E]">{writerEmail}</span>
            )}
            <span className="ml-auto text-sm">
              {new Date(createdAt).toLocaleDateString("ko-KR")}
            </span>
            <span className="text-sm text-yellow-600">[미답변]</span>
          </div>

          <div className="py-8">
            <p className="text-base font-bold mb-6">{title}</p>

            <p className="whitespace-pre-line text-sm leading-relaxed">
              {content}
            </p>

            {/* 첨부 파일 */}
            {imageUrl ? (
              <div className="flex items-center gap-1 text-sm text-[#000000] mt-10">
                <span>첨부파일 1개</span>
                <FiPaperclip className="text-gray-500" />
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#8E8E8E] underline underline-offset-2 cursor-pointer"
                >
                  {typeof imageUrl === "string"
                    ? imageUrl.split("/").pop()
                    : "첨부파일"}
                </a>
              </div>
            ) : null}
          </div>

          <div className="w-full h-[1px] bg-[#4a5565] mb-3" />
        </div>
      </main>

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
