// src/app/enquiries/[id]/processed/page.tsx
"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import MobileMenu from "@/components/mobileMenu";
import { FiPaperclip } from "react-icons/fi";
import { useEnquiry } from "@/features/enquiries/hooks/useEnquiry";
import { useComments } from "@/features/comments/hooks/useComments";
import {
  useFeedbackByEnquiryId,
  useCreateFeedback,
} from "@/features/feedback/hooks/useFeedback";
import Image from "next/image";
import BaseConfirmButton from "@/components/baseConfirmButton";

export default function ProcessedDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const enquiryId = Number(id);

  const [menuOpen, setMenuOpen] = React.useState(false);

  const [isHelpful, setIsHelpful] = React.useState<"yes" | "no" | null>(null);
  const [submittedLocally, setSubmittedLocally] = React.useState(false);

  const { data, isLoading, error } = useEnquiry(enquiryId);
  const {
    data: comments,
    isLoading: cLoading,
    error: cError,
  } = useComments(enquiryId);
  const {
    data: feedback,
    isLoading: fLoading,
    error: fError,
  } = useFeedbackByEnquiryId(enquiryId);
  const { mutate: createFeedback, isPending: isSubmitting } =
    useCreateFeedback();

  const serverHelpful: boolean | undefined = feedback?.isHelpful;
  const hasServerFeedback = typeof serverHelpful === "boolean";

  React.useEffect(() => {
    if (!hasServerFeedback) return;
    setIsHelpful(serverHelpful ? "yes" : "no");
  }, [hasServerFeedback, serverHelpful]);

  const latestAnswer = useMemo(() => {
    if (!comments || comments.length === 0) return undefined;

    const published = comments.filter(
      (c) => c.enquiryStatus === "PUBLISHED"
    );
    const targetList = published.length > 0 ? published : comments;

    return [...targetList].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];
  }, [comments]);

  if (!Number.isFinite(enquiryId)) {
    return (
      <div className="p-6">
        처리 완료된 문의가 아닙니다.
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
  if (!data || data.status !== "PUBLISHED") {
    return (
      <div className="p-6">
        처리 완료된 문의가 아닙니다.
        <BaseConfirmButton
          onClick={() => router.back()}
          className="mt-4 w-auto px-5 py-1.5 text-sm"
        >
          뒤로가기
        </BaseConfirmButton>
      </div>
    );
  }

  const {
    category,
    writer,
    writerEmail,
    createdAt,
    title,
    content,
    imageUrl,
  } = data;

  const writerName: string = writer?.username ?? "익명";
  const writerProfileImage: string =
    writer?.profileImageUrl || "/images/default-profile.png";

  const answerDateSource: string | undefined =
    latestAnswer?.updatedAt ||
    latestAnswer?.createdAt ||
    (createdAt as string | undefined);

  const answerDateText =
    answerDateSource && !Number.isNaN(new Date(answerDateSource).getTime())
      ? new Date(answerDateSource).toISOString().slice(0, 10)
      : "";

  const isLocked = hasServerFeedback || submittedLocally;

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHelpful || isLocked || isSubmitting) return;

    createFeedback(
      {
        enquiryId,
        isHelpful: isHelpful === "yes",
      },
      {
        onSuccess: () => {
          setSubmittedLocally(true);
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1D1D1D] pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 본문 */}
      <main className="w-full flex justify-center px-4 pb-16">
        <div className="w-full max-w-3xl mt-10 md:mt-16">
          {/* 카테고리 */}
          <p className="text-base md:text-lg font-bold mb-3">
            [ {category ?? "문의"} ]
          </p>

          {/* 작성자 정보 */}
          <div className="flex items-center gap-3 mb-4 border-y border-gray-200 py-3 text-sm">
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
            <span className="text-xs md:text-sm text-green-600 whitespace-nowrap">
              [답변완료]
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

          {/* 답변 영역 */}
          <section className="mt-7 mb-10 flex gap-3 items-start">
            {/* 라벨: 고정 폭 */}
            <p className="shrink-0 w-14 md:w-16 py-1.5 text-sm md:text-base font-bold text-left">
              답변
            </p>

            {/* 답변 내용 */}
            <div className="grow">
              <div className="w-full rounded-lg border border-gray-300 bg-[#FAFAFA] p-3 text-sm md:text-base whitespace-pre-line leading-relaxed">
                {cLoading
                  ? "답변을 불러오는 중…"
                  : cError
                  ? "답변을 불러오지 못했습니다."
                  : latestAnswer?.content || "등록된 답변이 없습니다."}
              </div>
              <p className="mt-3 text-right text-xs text-gray-500">
                {answerDateText}
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* 피드백 영역 – 모바일 기준 풀폭, 가운데 정렬 */}
      <section className="w-full bg-[#F7F7F7] mb-5">
        <div className="mx-auto w-full max-w-3xl px-4 py-8 md:py-10">
          <form
            onSubmit={handleSurveySubmit}
            className="mx-auto max-w-xl text-center space-y-4"
          >
            <h3 className="text-base md:text-lg font-semibold">
              답변이 도움이 되셨나요?
            </h3>

            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
              <label className="flex items-center gap-2 text-sm md:text-base cursor-pointer">
                <input
                  type="radio"
                  name="helpful"
                  value="yes"
                  checked={isHelpful === "yes"}
                  onChange={() => setIsHelpful("yes")}
                  className="cursor-pointer"
                  disabled={isLocked || isSubmitting}
                />
                <span>도움이 되었어요.</span>
              </label>

              <label className="flex items-center gap-2 text-sm md:text-base cursor-pointer">
                <input
                  type="radio"
                  name="helpful"
                  value="no"
                  checked={isHelpful === "no"}
                  onChange={() => setIsHelpful("no")}
                  className="cursor-pointer"
                  disabled={isLocked || isSubmitting}
                />
                <span>도움이 되지 않았어요.</span>
              </label>
            </div>

            {fLoading && (
              <p className="text-xs text-gray-500">
                이전 피드백을 불러오는 중입니다...
              </p>
            )}
            {fError && (
              <p className="text-xs text-red-500">
                이전 피드백 정보를 불러오지 못했습니다.
              </p>
            )}

            <button
              type="submit"
              disabled={!isHelpful || isLocked || isSubmitting}
              className={`mt-1 inline-flex items-center justify-center rounded-full px-7 py-1.5 text-sm md:text-base ${
                !isHelpful || isLocked || isSubmitting
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {hasServerFeedback || submittedLocally ? "감사합니다" : "확인"}
            </button>
          </form>
        </div>
      </section>

      {/* 하단 버튼 */}
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
