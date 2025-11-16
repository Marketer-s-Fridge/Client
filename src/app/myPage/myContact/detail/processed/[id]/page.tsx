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

export default function ProcessedDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const enquiryId = Number(id);

  const [menuOpen, setMenuOpen] = React.useState(false);

  // ✅ 만족도 선택 상태
  const [isHelpful, setIsHelpful] = React.useState<"yes" | "no" | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  if (!Number.isFinite(enquiryId)) return (
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

  // 문의 상세
  const { data, isLoading, error } = useEnquiry(enquiryId);

  // 댓글 목록 (해당 문의)
  const {
    data: comments,
    isLoading: cLoading,
    error: cError,
  } = useComments(enquiryId);

  // ✅ 피드백 조회
  const {
    data: feedback,
    isLoading: fLoading,
    error: fError,
  } = useFeedbackByEnquiryId(enquiryId);

  // ✅ 피드백 등록 mutation
  const { mutate: createFeedback, isPending: isSubmitting } =
    useCreateFeedback();

  // ✅ 이미 피드백이 있다면 UI 상태에 반영
  React.useEffect(() => {
    if (!feedback) return;
    const isHelpful = (feedback as any).helpful as boolean | undefined;
    if (typeof isHelpful === "boolean") {
      setIsHelpful(isHelpful ? "yes" : "no");
      setSubmitted(true);
    }
  }, [feedback]);

  // 최신 "답변" 하나만 보여주기 (PUBLISHED 우선)
  const latestAnswer = useMemo(() => {
    if (!comments || comments.length === 0) return undefined;

    const published = comments.filter((c) => c.enquiryStatus === "PUBLISHED");
    const targetList = published.length > 0 ? published : comments;

    return [...targetList].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];
  }, [comments]);

  if (isLoading) return <div className="p-6">불러오는 중...</div>;
  if (error) return <div className="p-6">오류가 발생했습니다.</div>;
  if (!data)  return (
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
  if (data.status !== "PUBLISHED")  return (
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

  const { category, writer, writerEmail, createdAt, title, content, imageUrl } =
    data as any;

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHelpful || submitted || isSubmitting) return;

    createFeedback(
      {
        enquiryId,
        isHelpful: isHelpful === "yes",
      } as any,
      {
        onSuccess: () => {
          setSubmitted(true);
        },
      }
    );
  };

  return (
    <div className="flex flex-col bg-white text-[#1D1D1D] pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 본문 영역 */}
      <main className="w-full flex justify-center px-4">
        <div className="w-full px-[5%] lg:px-[22.5%] mt-20">
          {/* 카테고리 */}
          <p className="text-lg font-bold mb-2">[ {category ?? "문의"} ]</p>

          {/* 유저 정보 */}
          <div className="flex items-center gap-3 mb-1 border-y border-gray-300 py-2">
            {/* 작성자 사진 */}
            {/* <Image
              src={user}
              alt="profile"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            /> */}
            <span className="text-sm font-medium">
              {writer.username ?? "익명"}
            </span>
            {writerEmail && (
              <span className="text-sm text-[#8E8E8E]">{writerEmail}</span>
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
                  {imageUrl.split("/").pop()}
                </a>
              </div>
            ) : null}
          </div>

          <div className="w-full h-[1px] bg-[#4a5565] mb-3" />

          {/* 답변 영역 */}
          <div className="flex flex-1 flex-row mt-7 mb-10 gap-2">
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

      {/* ✅ 전체 가로 폭을 덮는 회색 피드백 영역 */}
      <section className="w-full bg-[#F7F7F7]  mt-0 mb-12">
        {/* 안쪽 컨텐츠는 위 본문과 같은 가로 폭으로 정렬 */}
        <div className="w-full px-[5%] lg:px-[22.5%] py-8">
          <form
            onSubmit={handleSurveySubmit}
            className="max-w-xl mx-auto text-center space-y-4"
          >
            <h3 className="text-base md:text-lg font-semibold mb-2">
              답변이 도움이 되셨나요?
            </h3>

            <div className="flex flex-wrap justify-center items-center gap-6">
              <label className="flex items-center gap-2 text-sm md:text-base cursor-pointer">
                <input
                  type="radio"
                  name="helpful"
                  value="yes"
                  checked={isHelpful === "yes"}
                  onChange={() => setIsHelpful("yes")}
                  className="cursor-pointer"
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
                <span>도움이 되지 않았어요.</span>
              </label>
            </div>

            {fLoading && (
              <p className="text-xs text-gray-500 mt-1">
                이전 피드백을 불러오는 중입니다...
              </p>
            )}
            {fError && (
              <p className="text-xs text-red-500 mt-1">
                이전 피드백 정보를 불러오지 못했습니다.
              </p>
            )}

            <button
              type="submit"
              disabled={!isHelpful || submitted || isSubmitting}
              className={`mt-2 px-7 py-1.5 rounded border text-sm md:text-base ${
                !isHelpful || submitted || isSubmitting
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {submitted ? "감사합니다" : "확인"}
            </button>
          </form>
        </div>
      </section>

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
