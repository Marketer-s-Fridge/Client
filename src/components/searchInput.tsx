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
    <div className="hidden md:flex flex-col w-[80%] sm:w-[75%] md:w-[60%] lg:w-[50%] max-w-[550px] mx-auto mt-6 gap-2">
      <div className="relative w-full rounded-full border border-gray-300 bg-white">
        <input
          type="text"
          placeholder="필요한 콘텐츠, 꺼내볼까요?"
          className="w-full px-5 sm:px-6 md:px-7 py-2.5 md:py-3 md:text-sm sm:text-base rounded-full border border-gray-300 focus:outline-none pr-12"
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
          className="block lg:mt-2 text-right place-self-center md:place-self-end"
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
