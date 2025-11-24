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
  const [submittedLocally, setSubmittedLocally] = React.useState(false);

  // ❌ 여기서 early return 하던 거 제거 (Hook 호출 전 return 금지)
  // if (!Number.isFinite(enquiryId)) ...

  // ✅ 문의 상세
  const {
    data,
    isLoading,
    error,
  } = useEnquiry(enquiryId);

  // ✅ 댓글 목록
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

  // ✅ 서버에 이미 피드백이 있는지 여부 (any 제거)
  const serverHelpful: boolean | undefined = feedback?.isHelpful;
  const hasServerFeedback = typeof serverHelpful === "boolean";

  // ✅ 서버 피드백이 있으면, 라디오 체크 상태만 맞춰주기
  React.useEffect(() => {
    if (!hasServerFeedback) return;
    setIsHelpful(serverHelpful ? "yes" : "no");
  }, [hasServerFeedback, serverHelpful]);

  // ✅ 최신 답변 (PUBLISHED 우선) – comments 타입에 맞춰 그대로 사용
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

  // ==================== 분기 로직 (Hook 호출 이후) ====================

  // enquiryId가 NaN이거나 이상하면 그냥 공통 에러 처리
  if (!Number.isFinite(enquiryId)) {
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
  }

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
  if (data.status !== "PUBLISHED")
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

  // ✅ 여기부터는 data가 무조건 존재 & PUBLISHED 상태라고 가정 가능
  //    any 제거하고 그냥 그대로 구조 분해
  const {
    category,
    writer,
    writerEmail,
    createdAt,
    title,
    content,
    imageUrl,
  } = data;

  // ✅ writer / 프로필 이미지 방어
  const writerName: string = writer?.username ?? "익명";
  const writerProfileImage: string =
    writer?.profileImageUrl || "/images/default-profile.png";

  // ✅ 답변 날짜 문자열 방어
  const answerDateSource: string | undefined =
    latestAnswer?.updatedAt ||
    latestAnswer?.createdAt ||
    (createdAt as string | undefined);

  const answerDateText =
    answerDateSource && !Number.isNaN(new Date(answerDateSource).getTime())
      ? new Date(answerDateSource).toISOString().slice(0, 10)
      : "";

  // ✅ “잠금 여부”: 서버에 이미 피드백 있거나, 내가 방금 제출했으면 잠금
  const isLocked = hasServerFeedback || submittedLocally;

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHelpful || isLocked || isSubmitting) return;

    // ❌ as any 제거
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
                  {typeof imageUrl === "string"
                    ? imageUrl.split("/").pop()
                    : "첨부파일"}
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
                {answerDateText}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 피드백 영역 */}
      <section className="w-full bg-[#F7F7F7] mt-0 mb-12">
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
              disabled={!isHelpful || isLocked || isSubmitting}
              className={`mt-2 px-7 py-1.5 rounded border text-sm md:text-base ${
                !isHelpful || isLocked || isSubmitting
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {hasServerFeedback || submittedLocally ? "감사합니다" : "확인"}
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
