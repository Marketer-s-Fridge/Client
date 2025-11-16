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

  // ✅ 조회 기록 중복 전송 방지용 플래그
  const hasRecordedRef = useRef(false);

  // ✅ 조회 기록 mutation
  const { mutate: recordView } = usePostViewRecord();

  // ✅ 게시글 이미지 목록 (없으면 기본 이미지 하나)
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

    // MostViewedCategoryRequestDto: { category: string; postId: number }
    recordView({
      postId: post.id,
      category: post.category, // post.category가 항상 string이라고 가정
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

  return (
    <div className="bg-white pt-17 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 상단 카테고리/경로 */}
      <nav className="flex border-b border-gray-200 text-sm font-medium mt-1 overflow-x-auto no-scrollbar gap-5 px-[5%] lg:px-[17%] ">
        {/* 필요하면 실제 카테고리 리스트로 교체 */}
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
                {slideImages.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative"
                    style={{
                      width: `${100 / slideCount}%`,
                      aspectRatio: "4 / 5",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={src}
                      alt={`slide-${idx + 1}`}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                ))}
              </div>

              {/* 좌우 클릭 영역 */}
              <div
                className="absolute top-0 left-0 h-full w-1/2 z-10 cursor-pointer"
                onClick={() => setActiveSlide((prev) => Math.max(prev - 1, 0))}
              />
              <div
                className="absolute top-0 right-0 h-full w-1/2 z-10 cursor-pointer"
                onClick={() =>
                  setActiveSlide((prev) => Math.min(prev + 1, slideCount - 1))
                }
              />

              {/* 화살표 */}
              {activeSlide > 0 && (
                <Image
                  width={150}
                  height={150}
                  className="absolute w-6 h-6 top-[47.5%] left-[1%]"
                  src="/icons/cardnews-bt-left.png"
                  alt="←"
                />
              )}
              {activeSlide < slideCount - 1 && (
                <Image
                  width={150}
                  height={150}
                  className="absolute w-6 h-6 top-[47.5%] right-[1%]"
                  src="/icons/cardnews-bt-right.png"
                  alt="→"
                />
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
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                {post.title}
              </h1>
              <div className="text-xs text-gray-500 mb-6">
                {/* post에 맞게 값 매핑 */}
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("ko-KR")
                  : ""}
                {post.viewCount !== undefined && ` · ${post.viewCount} views`}
                {post.clickCount !== undefined &&
                  ` · 냉장고에 담은 사람 ${post.clickCount}`}
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            <div className="bg-white flex justify-end gap-4 mt-4 ">
              <SaveToFridgeButton postId={post.id} />
              <button className="border border-gray-300 rounded-full px-2 py-1 text-sm cursor-pointer">
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
    </div>
  );
}
