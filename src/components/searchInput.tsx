// src/components/searchInput.tsx (예시 경로)
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

import { useSaveSearchKeyword } from "@/features/search/hooks/useSearchHistory";
// ✅ 전체 게시물 훅 import
import { usePosts } from "@/features/posts/hooks/usePosts";

type SearchInputProps = {
  showInstagramButton?: boolean;
};

export default function SearchInput({
  showInstagramButton = true,
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // ✅ 검색어 저장 훅
  const { mutate: saveSearchKeyword } = useSaveSearchKeyword();

  // ✅ 전체 게시물 조회 (PUBLISHED)
  const { data: posts, isLoading } = usePosts(); // 기본값으로 서버 모드 사용

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) {
      alert("검색어를 입력해주세요");
      return;
    }

    // 아직 게시물 로딩 중이면 검색 막기 (원하면 이 부분은 빼도 됨)
    if (isLoading) {
      alert("콘텐츠를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // ✅ 검색어 저장 (결과 여부와 상관없이 기록)
    saveSearchKeyword({
      keyword: trimmed,
      // ex) userId, type 등 필요하면 여기서 같이 넘기기
    } as any);

    // ✅ 전체 게시물 기반으로 검색 결과 존재 여부 확인
    const hasResult =
      posts?.some((post) => post.title.includes(trimmed)) ?? false;

    if (hasResult) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/search/noResult?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch(e);
  };

  return (
    <div className="relative mt-10 flex flex-row gap-2 md:flex-col w-[80%] sm:w-[75%] md:w-[60%] lg:w-[50%] max-w-[550px] mx-auto">
      <div className="relative w-full rounded-full border border-gray-300 bg-white">
        <input
          type="text"
          placeholder="필요한 콘텐츠, 꺼내볼까요?"
          className=" sm:text-medium w-full px-5 sm:px-6 md:px-7 py-2.5 sm:py-2.5 md:py-3 md:text-sm sm:text-base rounded-full border border-gray-300 focus:outline-none pr-12"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="absolute top-1/2 right-4 -translate-y-1/2"
          onClick={handleSearch}
        >
          <Image
            src="/icons/search.png"
            alt="검색"
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 cursor-pointer"
            width={50}
            height={50}
          />
        </button>
      </div>

      {showInstagramButton && (
        <a
          href="https://www.instagram.com/marketers_fridge?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          target="_blank"
          rel="noopener noreferrer"
          className="block text-right place-self-end "
        >
          <Image
            src="/icons/insta-bt2.png"
            alt="Marketer's Fridge Instagram"
            className=" object-contain block w-[30px] md:hidden h-auto"
            width={50}
            height={50}
          />
          <Image
            src="/icons/insta-bt.png"
            alt="Marketer's Fridge Instagram"
            className="hidden md:block w-[100px] sm:w-[110px] md:w-[120px] h-auto"
            width={200}
            height={250}
          />
        </a>
      )}
    </div>
  );
}
