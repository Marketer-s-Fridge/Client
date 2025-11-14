"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
// ✅ 경로는 실제 프로젝트 구조에 맞게 수정하기
import { useSaveSearchKeyword } from "@/features/search/hooks/useSearchHistory";

type SearchInputProps = {
  showInstagramButton?: boolean;
};

// 🔍 임시 mock 데이터 (실제론 API로 대체 가능)
const mockContents = [
  "신규 브랜드 탐방: 떠오르는 핫 브랜드",
  "패션 아이콘들이 선택한 신상템",
  "셀럽들의 공항 패션 스타일",
  "KOREADB 2025 뉴 브랜드",
  "시간을 초월한 클래식 아이템",
  "포인트 컬러로 완성하는 룩",
];

export default function SearchInput({
  showInstagramButton = true,
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // ✅ 검색어 저장 훅
  const { mutate: saveSearchKeyword } = useSaveSearchKeyword();

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) {
      alert("검색어를 입력해주세요");
      return;
    }

    // ✅ 검색어 저장 (결과 여부와 상관없이 기록)
    // SearchHistoryRequestDto 타입에 맞게 필드 추가해서 사용하면 됨
    saveSearchKeyword({
      keyword: trimmed,
      // ex) userId, type 등 필요하면 여기서 같이 넘기기
    } as any);

    // ✅ 검색 결과 존재 여부 확인
    const hasResult = mockContents.some((title) => title.includes(trimmed));

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
