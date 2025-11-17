import { PostResponseDto } from "@/features/posts/types";
import Image from "next/image";
import { useState } from "react";
// 공통 슬라이더 컴포넌트
function MobilePostSlider({
    title,
    posts,
    onClickPost,
  }: {
    title: string;
    posts: PostResponseDto[];
    onClickPost: (id: number) => void;
  }) {
    const [index, setIndex] = useState(0);
  
    const hasPrev = index > 0;
    const hasNext = index < posts.length - 1;
  
    const goPrev = () => {
      if (hasPrev) setIndex((i) => i - 1);
    };
    const goNext = () => {
      if (hasNext) setIndex((i) => i + 1);
    };
  
    const current = posts[index];
  
    return (
      <section className="md:hidden px-4 mt-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-semibold">{title}</h2>
          <span className="text-xs text-gray-500">
            {posts.length === 0 ? "0 / 0" : `${index + 1} / ${posts.length}`}
          </span>
        </div>
  
        {posts.length === 0 ? (
          <p className="text-xs text-gray-400 py-6 text-center">
            표시할 콘텐츠가 없습니다.
          </p>
        ) : (
          <div className="relative">
            {/* 카드 */}
            <button
              className="w-full text-left border border-gray-200 rounded-lg p-3 active:bg-gray-50"
              onClick={() => onClickPost(current.id)}
            >
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={current.images?.[0] || "/images/default-thumbnail.jpg"}
                    alt={current.title}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-red-500 mb-1">
                    {current.category ?? "카테고리"}
                  </p>
                  <p className="text-sm font-medium line-clamp-2">
                    {current.title}
                  </p>
                </div>
              </div>
            </button>
  
            {/* 좌우 버튼 */}
            {hasPrev && (
              <button
                onClick={goPrev}
                className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-2 py-1 text-xs shadow"
              >
                ‹
              </button>
            )}
            {hasNext && (
              <button
                onClick={goNext}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-2 py-1 text-xs shadow"
              >
                ›
              </button>
            )}
          </div>
        )}
      </section>
    );
  }
  