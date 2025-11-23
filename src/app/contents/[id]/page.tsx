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

export default function CardNewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  // hooks
  const { data: post, isLoading, error } = usePost(postId);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const slideBoxRef = useRef<HTMLDivElement>(null);
  const [slideHeight, setSlideHeight] = useState<number>(0);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
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

  // 왼쪽 이미지 박스 높이 측정해서 slideHeight에 저장
  useEffect(() => {
    const node = slideBoxRef.current;
    if (!node) return;

    const updateHeight = () => {
      setSlideHeight(node.offsetHeight);
    };

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    updateHeight();

    return () => observer.disconnect();
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

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShowShareModal(true);
    } catch {
      alert("링크 복사 실패. 브라우저에서 직접 복사해주세요.");
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
          {/* 왼쪽 슬라이드 */}
          <div className="relative w-full sm:w-[45%] flex flex-col items-center">
            <div
              ref={slideBoxRef}
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "4 / 5" }}
            >
              {/* 슬라이드 인디케이터 */}
              <div className="z-10 absolute bottom-[2%] left-1/2 -translate-x-1/2 flex gap-1">
                {slideImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full ${
                      idx === activeSlide ? "bg-white" : "bg-gray-500 opacity-85"
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
            style={slideHeight ? { height: slideHeight } : undefined}
          >
            {/* 텍스트 영역 전체를 카드 높이 안에서 flex로 쪼갬 */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* 제목/메타/서브타이틀 */}
              <div className="pb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  {post.title}
                </h1>

                <div className="text-xs text-gray-500 mb-4">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("ko-KR")
                    : ""}
                  {post.viewCount !== undefined &&
                    ` · ${post.viewCount} views`}
                  {post.bookmarkCount !== undefined &&
                    ` · 냉장고에 담은 사람 ${post.bookmarkCount}`}
                </div>

                {post.subTitle && (
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {post.subTitle}
                  </h3>
                )}
              </div>

              {/* 내용: 여기만 스크롤 */}
              <div
                className="flex-1 mt-2 pr-2 overflow-y-auto no-scrollbar"
              >
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>
            </div>

            {/* 버튼 영역: 오른쪽 섹션 카드 끝 위치에 고정 */}
            <div className="bg-white flex justify-end gap-4 mt-4 flex-shrink-0">
              <SaveToFridgeButton postId={post.id} />
              <button
                className="border border-gray-300 rounded-full px-1.5 py-1 text-sm cursor-pointer"
                onClick={handleShare}
              >
                <Image
                  src="/icons/share.png"
                  alt="공유"
                  width={16}
                  height={16}
                />
              </button>
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
