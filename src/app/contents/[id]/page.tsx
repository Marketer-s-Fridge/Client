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

  // 레이아웃 refs
  const slideBoxRef = useRef<HTMLDivElement | null>(null); // 왼쪽 이미지 전체 박스
  const [rightHeight, setRightHeight] = useState<number | null>(null); // 데스크탑에서만 사용

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

  // 왼쪽 이미지 박스 높이 → 오른쪽 섹션 전체 높이로 사용 (md 이상에서만)
  useEffect(() => {
    const node = slideBoxRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const updateHeight = () => {
      if (typeof window === "undefined") return;
      // 모바일에서는 높이 고정/스크롤 안 씀
      if (window.innerWidth < 768) {
        setRightHeight(null);
        return;
      }
      setRightHeight(node.offsetHeight);
    };

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    updateHeight(); // 초기 1회

    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

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

  // =====================
  // 모바일 스와이프 제스처
  // =====================
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    const startY = touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (startX == null || startY == null) return;

    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;

    const diffX = endX - startX;
    const diffY = endY - startY;

    // 세로 움직임이 더 크면 스와이프 취급 안 함
    if (Math.abs(diffY) > Math.abs(diffX)) return;

    const THRESHOLD = 50; // px
    if (Math.abs(diffX) < THRESHOLD) return;

    if (diffX < 0 && activeSlide < slideCount - 1) {
      // 왼쪽으로 스와이프 → 다음
      setActiveSlide((prev) => Math.min(prev + 1, slideCount - 1));
    } else if (diffX > 0 && activeSlide > 0) {
      // 오른쪽으로 스와이프 → 이전
      setActiveSlide((prev) => Math.max(prev - 1, 0));
    }
  };

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
            flex flex-col sm:flex-row gap-10 
            items-start sm:items-stretch
          "
        >
          {/* 왼쪽 슬라이드: 이 박스 높이가 데스크탑 기준 높이 */}
          <div className="relative w-full sm:w-[45%] flex flex-col items-center">
            <div
              ref={slideBoxRef}
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "4 / 5" }} // 비율 고정
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* 슬라이드 인디케이터 */}
              <div className="z-10 absolute bottom-[2%] left-1/2 -translate-x-1/2 flex gap-1">
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

              {/* 슬라이드 컨테이너 */}
              <div
                className="relative flex transition-transform duration-500 ease-in-out"
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
                      className="relative"
                      style={{
                        width: `${100 / slideCount}%`,
                        aspectRatio: "4 / 5",
                        flexShrink: 0,
                      }}
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
                    setActiveSlide((p) => Math.min(p + 1, slideCount - 1))
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

          {/* 오른쪽 텍스트 + 버튼 */}
          <div
            className="w-full sm:w-[55%] flex flex-col mb-15 md:mb-0"
            // 데스크탑에서만 높이 고정, 모바일에서는 자연 높이
            style={rightHeight ? { height: rightHeight } : undefined}
          >
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

            {/* 내용:
                - 데스크탑(rightHeight 있을 때): 남은 공간 안에서만 스크롤
                - 모바일(rightHeight 없음): 스크롤 제한 없이 전체 표시 */}
            <div
              className={`mt-2 pr-2 flex-1 ${
                rightHeight ? "overflow-y-auto no-scrollbar" : ""
              }`}
            >
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            {/* 버튼: 항상 텍스트 아래 */}
            <div className="bg-white flex justify-end gap-4 mt-4">
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
