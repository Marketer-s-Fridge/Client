// src/app/contents/[id]/page.tsx
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import Header from "@/components/header";
import Image from "next/image";
import Footer from "@/components/footer";
import Breadcrumb from "@/components/breadCrumb";
import MobileMenu from "@/components/mobileMenu";
import SaveToFridgeButton from "@/components/saveToFridgeButton";
import { usePost } from "@/features/posts/hooks/usePost";
import { usePostViewRecord } from "@/features/views/hooks/useMostViewedCategory";
import ConfirmModal from "@/components/confirmModal";
import ShareButton from "@/components/shareButton";

export default function CardNewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  // 데이터
  const { data: post, isLoading, error } = usePost(postId);

  // UI 상태
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // 슬라이드 영상 제어
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // 공유 모달
  const [showShareModal, setShowShareModal] = useState(false);

  // 조회수 기록
  const hasRecordedRef = useRef(false);
  const { mutate: recordView } = usePostViewRecord();

  const slideImages = useMemo(() => {
    if (post?.images?.length) return post.images;
    return ["/images/cardNews/hot/001.png"];
  }, [post]);

  const slideCount = slideImages.length;
  const category = post?.category ?? "카테고리";

  const isVideoSrc = (src: string) => {
    const clean = src.split("?")[0].toLowerCase();
    return /\.(mp4|mov|webm|ogg|m4v)$/i.test(clean);
  };

  // 조회수 기록
  useEffect(() => {
    if (!post || hasRecordedRef.current) return;
    recordView({ postId: post.id, category: post.category });
    hasRecordedRef.current = true;
  }, [post, recordView]);

  // 슬라이드 영상 재생 제어
  useEffect(() => {
    slideImages.forEach((src, idx) => {
      const el = videoRefs.current[idx];
      if (!el || !isVideoSrc(src)) return;

      if (idx === activeSlide) {
        el.play().catch(() => {});
      } else {
        el.pause();
        el.currentTime = 0;
      }
    });
  }, [activeSlide, slideImages]);

  if (!Number.isFinite(postId)) return notFound();
  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        로딩 중...
      </div>
    );
  if (error || !post)
    return (
      <div className="min-h-screen flex justify-center items-center">
        게시글을 불러올 수 없습니다.
      </div>
    );

  return (
    <div className="bg-white pt-17 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 카테고리 탭 */}
      <nav className="flex border-b border-gray-200 text-sm font-medium mt-1 overflow-x-auto no-scrollbar gap-5 px-[5%] lg:px-[17%] ">
        <span className="whitespace-nowrap px-2 py-2 text-red-500 font-bold border-b-2 border-red-500">
          {category}
        </span>
      </nav>

      <Breadcrumb category={category} />

      {/* 본문 */}
      <main className="flex justify-center px-4 sm:px-[8%] lg:px-[17%] mt-10 mb-10 min-h-[70vh]">
        <div
          className="
            w-full max-w-screen-lg 
            flex flex-col md:flex-row gap-10 
            items-start md:items-stretch
            md:h-[450px]   /* ← 카드 전체 높이 고정 (썸네일 기준) */
          "
        >
          {/* 왼쪽 슬라이드: postFeature처럼 비율 + 고정 높이 */}
          <div className="relative w-full md:w-[45%] flex flex-col items-center">
            <div
              className="
                relative w-full max-w-[420px]
                md:h-full md:w-auto
                aspect-[4/5] flex-shrink-0 overflow-hidden rounded-xl
              "
            >
              {/* 인디케이터 / 화살표까지 포함하는 슬라이드 래퍼 */}
              <div className="absolute inset-0">
                {/* 슬라이드 컨테이너 */}
                <div
                  className="relative flex h-full transition-transform duration-500 ease-in-out"
                  style={{
                    width: `${slideCount * 100}%`,
                    transform: `translateX(-${
                      (100 / slideCount) * activeSlide
                    }%)`,
                  }}
                >
                  {slideImages.map((src, idx) => {
                    const isV = isVideoSrc(src);
                    return (
                      <div
                        key={idx}
                        className="relative w-full h-full flex-shrink-0"
                      >
                        {isV ? (
                          <video
                            ref={(el) => {
                              videoRefs.current[idx] = el;
                            }}
                            src={src}
                            className="w-full h-full object-cover rounded-xl"
                            controls
                            playsInline
                          />
                        ) : (
                          <Image
                            src={src}
                            alt=""
                            fill
                            className="object-cover rounded-xl"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 슬라이드 인디케이터 */}
                <div className="z-10 absolute bottom-[3%] left-1/2 -translate-x-1/2 flex gap-1">
                  {slideImages.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full ${
                        idx === activeSlide
                          ? "bg-white"
                          : "bg-gray-500 opacity-85"
                      }`}
                    />
                  ))}
                </div>

                {/* ← 화살표 */}
                {activeSlide > 0 && (
                  <button
                    className="absolute top-1/2 left-[1%] -translate-y-1/2 z-20"
                    onClick={() => setActiveSlide((p) => Math.max(p - 1, 0))}
                  >
                    <Image
                      width={150}
                      height={150}
                      className="w-6 h-6"
                      src="/icons/cardnews-bt-left.png"
                      alt="←"
                    />
                  </button>
                )}

                {/* → 화살표 */}
                {activeSlide < slideCount - 1 && (
                  <button
                    className="absolute top-1/2 right-[1%] -translate-y-1/2 z-20"
                    onClick={() =>
                      setActiveSlide((p) =>
                        Math.min(p + 1, slideCount - 1)
                      )
                    }
                  >
                    <Image
                      width={150}
                      height={150}
                      className="w-6 h-6"
                      src="/icons/cardnews-bt-right.png"
                      alt="→"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽 텍스트 + 버튼: postFeature 패턴 그대로 */}
          <div className="w-full md:w-[55%] flex flex-col mb-15 md:mb-0 md:h-full">
            {/* 제목/메타/부제목 */}
            <div className="pb-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                {post.title}
              </h1>

              <div className="text-xs text-gray-500 mb-4">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("ko-KR")
                  : ""}
                {post.viewCount !== undefined && ` · ${post.viewCount} views`}
                {post.bookmarkCount !== undefined &&
                  ` · 냉장고에 담은 사람 ${post.bookmarkCount}`}
              </div>

              {post.subTitle && (
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">
                  {post.subTitle}
                </h3>
              )}
            </div>

            {/* 내용: 카드 높이 안에서만 스크롤 */}
            <div className="mt-2 pr-2 flex-1 overflow-y-auto no-scrollbar">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            {/* 버튼: 항상 텍스트 아래 + 카드 하단 고정 */}
            <div className="mt-4 flex justify-end gap-4">
              <SaveToFridgeButton postId={post.id} />
              <ShareButton onShared={() => setShowShareModal(true)} />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* 공유 완료 모달 */}
      <ConfirmModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      >
        <p className="text-center text-sm">
          현재 페이지 링크가 복사되었습니다.
          <br />
          원하는 곳에 붙여넣기 해서 공유해 주세요!
        </p>
      </ConfirmModal>
    </div>
  );
}
