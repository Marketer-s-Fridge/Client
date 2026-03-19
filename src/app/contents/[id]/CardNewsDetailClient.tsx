"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Header from "@/components/header";
import Image from "next/image";
import Footer from "@/components/footer";
import Breadcrumb from "@/components/breadCrumb";
import MobileMenu from "@/components/mobileMenu";
import SaveToFridgeButton from "@/components/saveToFridgeButton";
import { usePost } from "@/features/posts/hooks/usePost";
import { usePostViewRecord } from "@/features/views/hooks/useMostViewedCategory";
import ShareButton from "@/components/shareButton";
import type { PostResponseDto } from "@/features/posts/types";
import {
  isMetaLine,
  normalizeMetaLine,
  splitContentLines,
} from "@/utils/metaLine";

export default function CardNewsDetailClient({
  postId,
  initialPost,
}: {
  postId: number;
  initialPost?: PostResponseDto;
}) {
  const { data: post, isLoading, error } = usePost(postId, {
    initialData: initialPost,
  });
  const { mutate: recordView } = usePostViewRecord();

  const hasRecordedRef = useRef(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const slideBoxRef = useRef<HTMLDivElement | null>(null);
  const [rightHeight, setRightHeight] = useState<number | null>(null);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const slideImages = useMemo(() => {
    if (!post?.images || post.images.length === 0) {
      return ["/images/cardNews/hot/001.png"];
    }

    if (post.postType === "REELS") {
      const mediaOnly = post.images.slice(1);
      if (mediaOnly.length === 0) return ["/images/cardNews/hot/001.png"];
      return mediaOnly;
    }

    return post.images;
  }, [post]);

  const isReelsType = post?.postType === "REELS";
  const slideAspect = isReelsType ? "9 / 16" : "4 / 5";

  const slideCount = slideImages.length;
  const category = post?.category ?? "카테고리";

  const isVideoSrc = (src: string) => {
    const clean = src.split("?")[0].toLowerCase();
    return /\.(mp4|mov|webm|ogg|m4v)$/i.test(clean);
  };

  const contentLines = useMemo(
    () => splitContentLines(post?.content),
    [post?.content]
  );

  useEffect(() => {
    const node = slideBoxRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const updateHeight = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 768) {
        setRightHeight(null);
        return;
      }
      setRightHeight(node.offsetHeight);
    };

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    updateHeight();

    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    if (!post || hasRecordedRef.current) return;
    recordView({ postId: post.id, category: post.category });
    hasRecordedRef.current = true;
  }, [post, recordView]);

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

    if (Math.abs(diffY) > Math.abs(diffX)) return;

    const THRESHOLD = 50;
    if (Math.abs(diffX) < THRESHOLD) return;

    if (diffX < 0 && activeSlide < slideCount - 1) {
      setActiveSlide((prev) => Math.min(prev + 1, slideCount - 1));
    } else if (diffX > 0 && activeSlide > 0) {
      setActiveSlide((prev) => Math.max(prev - 1, 0));
    }
  };

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

  const shareUrl = `https://marketersfridge.co.kr/contents/${post.id}`;
  const shareImage =
    post.images && post.images.length > 0
      ? post.images[0].startsWith("http")
        ? post.images[0]
        : `https://marketersfridge.co.kr${post.images[0]}`
      : undefined;

  return (
    <div className="bg-white pt-17 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <nav className="flex border-b border-gray-200 text-sm font-medium mt-1 overflow-x-auto no-scrollbar gap-5 px-[5%] lg:px-[17%] ">
        <span className="whitespace-nowrap px-2 py-2 text-red-500 font-bold border-b-2 border-red-500">
          {category}
        </span>
      </nav>

      <Breadcrumb category={category} />

      <main className="flex justify-center px-4 md:px-[8%] lg:px-[17%] mt-10 mb-0">
        <div
          className="
            w-full max-w-screen-lg 
            flex flex-col md:flex-row gap-10 
            items-start md:items-stretch
          "
        >
          <div className="relative w-full md:w-[45%] flex flex-col items-center">
            <div
              ref={slideBoxRef}
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: slideAspect }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
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
                        aspectRatio: slideAspect,
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

          <div
            className="w-full md:w-[55%] flex flex-col"
            style={rightHeight ? { height: rightHeight } : undefined}
          >
            <div className="pb-2">
              <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2">
                {post.title}
              </h1>

              <div className="text-sm text-gray-500 mb-1 md:mb-4">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("ko-KR")
                  : ""}
                {post.viewCount !== undefined && ` · ${post.viewCount} views`}
                {post.bookmarkCount !== undefined &&
                  ` · 냉장고에 담은 사람 ${post.bookmarkCount}`}
              </div>

              {post.subTitle && (
                <h3 className="text-xl md:text-xl lg:text-2xl font-bold mt-7 md:mt-4 ">
                  {post.subTitle}
                </h3>
              )}
            </div>

            <div
              className={`mt-0 md:mt-2 pr-2 flex-1 ${
                rightHeight ? "overflow-y-auto no-scrollbar" : ""
              }`}
            >
              <div className="text-base md:text-base text-gray-700 leading-tight md:leading-snug">
                {contentLines.map((line, idx) => {
                  const trimmed = line.trim();

                  if (trimmed === "") {
                    return <div key={idx} className="h-2 md:h-3" />;
                  }

                  if (isMetaLine(trimmed)) {
                    return (
                      <p
                        key={idx}
                        className="mt-1.5 md:mt-2 text-right text-sm md:text-sm font-medium text-gray-400"
                      >
                        {normalizeMetaLine(trimmed)}
                      </p>
                    );
                  }

                  return (
                    <p key={idx} className="mb-0.5 md:mb-1">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>

            <div className="bg-white flex justify-end gap-4 mt-4">
              <SaveToFridgeButton postId={post.id} />
              <ShareButton
                title={post.title}
                description={post.subTitle ?? "마케터를 위한 카드뉴스 아카이브 콘텐츠"}
                url={shareUrl}
                imageUrl={shareImage}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

