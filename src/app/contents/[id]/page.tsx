// src/app/contents/[id]/page.tsx
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
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
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  if (!Number.isFinite(postId)) return notFound();

  const { data: post, isLoading, error } = usePost(postId);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const slideBoxRef = useRef<HTMLDivElement>(null);
  const [slideHeight, setSlideHeight] = useState<number>(0);

  // ✅ 공유 준비중 모달
  const [showShareModal, setShowShareModal] = useState(false);

  // ✅ 조회 기록 중복 전송 방지용 플래그
  const hasRecordedRef = useRef(false);

  // ✅ 조회 기록 mutation
  const { mutate: recordView } = usePostViewRecord();

  // ✅ 게시글 이미지/영상 목록 (없으면 기본 이미지 하나)
  const slideImages = useMemo(() => {
    if (post?.images && post.images.length > 0) {
      return post.images;
    }
    return ["/images/cardNews/hot/001.png"];
  }, [post]);

  const slideCount = slideImages.length;

  // ✅ 카테고리 (Breadcrumb에서 사용)
  const category = post?.category || "카테고리";

  useEffect(() => {
    const node = slideBoxRef.current;
    if (!node) return;

    const updateHeight = () => {
      setSlideHeight(node.offsetHeight);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(node);
    updateHeight(); // 초기 설정

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // ✅ 게시글/카테고리 로딩 완료되면 조회 기록 한 번만 전송
  useEffect(() => {
    if (!post) return;
    if (hasRecordedRef.current) return; // 중복 방지

    recordView({
      postId: post.id,
      category: post.category,
    });

    hasRecordedRef.current = true;
  }, [post, recordView]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        로딩 중...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        게시글을 불러올 수 없습니다.
      </div>
    );
  }

  // 🔎 확장자로 영상 여부 판별 (쿼리스트링 제거 후 검사)
  const isVideoSrc = (src: string) => {
    const clean = src.split("?")[0].toLowerCase();
    return /\.(mp4|mov|webm|ogg|m4v)$/i.test(clean);
  };

  return (
    <div className="bg-white pt-17 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 상단 카테고리/경로 */}
      <nav className="flex border-b border-gray-200 text-sm font-medium mt-1 overflow-x-auto no-scrollbar gap-5 px-[5%] lg:px-[17%] ">
        <span className="whitespace-nowrap px-2 py-2 text-red-500 font-bold border-b-2 border-red-500">
          {category}
        </span>
      </nav>

      <Breadcrumb category={category} />

      {/* 본문 */}
      <main className="flex justify-center px-4 sm:px-[8%] lg:px-[17%] mt-10 mb-10 min-h-[70vh]">
        <div className="w-full max-w-screen-lg flex flex-col sm:flex-row gap-10">
          {/* 카드 슬라이드 */}
          <div className="self-center relative w-full sm:w-[45%] flex flex-col items-center">
            <div
              ref={slideBoxRef}
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "4 / 5" }}
            >
              {/* 인디케이터 */}
              <div className="z-10 absolute bottom-[2%] left-1/2 -translate-x-1/2 flex gap-1">
                {slideImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full ${
                      idx === activeSlide
                        ? "bg-white"
                        : "bg-gray-500 opacity-85"
                    }`}
                  ></div>
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
                  const isVideo = isVideoSrc(src);
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
                      {isVideo ? (
                        <video
                          src={src}
                          className="w-full h-full object-cover rounded-xl"
                          controls
                          playsInline
                          autoPlay
                        />
                      ) : (
                        <Image
                          src={src}
                          alt={`slide-${idx + 1}`}
                          fill
                          className="object-cover rounded-xl"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 화살표: 아이콘만 클릭 가능하게 */}
              {activeSlide > 0 && (
                <button
                  type="button"
                  className="absolute top-1/2 left-[1%] -translate-y-1/2 z-20"
                  onClick={() =>
                    setActiveSlide((prev) => Math.max(prev - 1, 0))
                  }
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
              {activeSlide < slideCount - 1 && (
                <button
                  type="button"
                  className="absolute top-1/2 right-[1%] -translate-y-1/2 z-20"
                  onClick={() =>
                    setActiveSlide((prev) =>
                      Math.min(prev + 1, slideCount - 1)
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

          {/* 텍스트 + 버튼 */}
          <div
            className="self-center w-full sm:w-[55%] flex flex-col mb-15 md:mb-0"
            style={{ height: slideHeight || "auto" }}
          >
            <div
              className={`
                pr-2 py-2
                ${
                  slideHeight
                    ? "sm:flex-1 sm:overflow-y-auto sm:no-scrollbar"
                    : ""
                }
              `}
            >
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                {post.title}
              </h1>
              <div className="text-xs text-gray-500 mb-4">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("ko-KR")
                  : ""}
                {post.viewCount !== undefined && ` · ${post.viewCount} views`}
                {post.clickCount !== undefined &&
                  ` · 냉장고에 담은 사람 ${post.bookmarkCount}`}
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">
                {post.subTitle}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            <div className="bg-white flex justify-end gap-4 mt-4 ">
              <SaveToFridgeButton postId={post.id} />
              <button
                className="border border-gray-300 rounded-full px-1.5 py-1 text-sm cursor-pointer"
                onClick={() => setShowShareModal(true)}
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

      {/* 공유 기능 준비중 모달 */}
      <ConfirmModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      >
        <p>준비중입니다.</p>
      </ConfirmModal>
    </div>
  );
}
