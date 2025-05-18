'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type SearchInputProps = {
  showInstagramButton?: boolean;
};

export default function SearchInput({ showInstagramButton = true }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="relative w-[60%] sm:w-[50%] md:w-[60%] max-w-[550px] mx-auto">
      <div className="relative w-full rounded-full border border-gray-300 bg-white">
        <input
          type="text"
          placeholder="필요한 콘텐츠, 꺼내볼까요?"
          className="w-full px-6 py-2 text-sm rounded-full border border-gray-300 focus:outline-none pr-12
                     sm:py-2.5 md:py-3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="absolute top-1/2 right-4 -translate-y-1/2"
          onClick={handleSearch}
        >
          <img src="/icons/search.png" alt="검색" className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      {showInstagramButton && (
        <a
          href="https://www.instagram.com/marketers_fridge?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-right"
        >
          <img
            src="/icons/insta-bt.png"
            alt="Marketer's Fridge Instagram"
            className="w-[120px] h-auto inline-block"
          />
        </a>
      )}
    </div>
  );
}
