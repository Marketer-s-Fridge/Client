"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

type SearchInputProps = {
  showInstagramButton?: boolean;
};

export default function SearchInput({
  showInstagramButton = true,
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search/noResult`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex flex-col w-[90%] sm:w-[75%] md:w-[60%] lg:w-[50%] max-w-[550px] mx-auto md:mt-6 gap-2">
      <div className="relative w-full rounded-full border border-gray-300 bg-white">
        {/* 👇 모바일용 왼쪽 아이콘 */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 md:hidden">
          <Image
            src="/icons/search.png"
            alt="검색"
            className="w-5 h-5"
            width={20}
            height={20}
          />
        </div>

        {/* 👇 PC용 오른쪽 아이콘 */}
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block"
          onClick={handleSearch}
        >
          <Image
            src="/icons/search.png"
            alt="검색"
            className="w-6 h-6 md:w-7 md:h-7"
            width={28}
            height={28}
          />
        </button>

        <input
          type="text"
          placeholder="필요한 콘텐츠, 꺼내볼까요?"
          className="w-full py-2 md:py-3 text-[13px] md:text-sm sm:text-base rounded-full focus:outline-none
            pl-11 md:pl-6 pr-4 md:pr-14 border border-transparent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {showInstagramButton && (
        <a
          href="https://www.instagram.com/marketers_fridge?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block lg:mt-2 text-right place-self-center md:place-self-end"
        >
          <Image
            src="/icons/insta-bt.png"
            alt="Marketer's Fridge Instagram"
            className="w-[120px] h-auto"
            width={200}
            height={250}
          />
        </a>
      )}
    </div>
  );
}
