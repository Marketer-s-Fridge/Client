// components/header.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, Dispatch, SetStateAction } from "react";
import { Menu, Search, X } from "lucide-react";
import {
  usePopularSearchKeywords,
  useSaveSearchKeyword, // ✅ 추가
} from "@/features/search/hooks/useSearchHistory";

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const mockContents = [
  "신규 브랜드 탐방: 떠오르는 핫 브랜드",
  "패션 아이콘들이 선택한 신상템",
  "셀럽들의 공항 패션 스타일",
  "KOREADB 2025 뉴 브랜드",
  "시간을 초월한 클래식 아이템",
  "포인트 컬러로 완성하는 룩",
];

export default function Header({ menuOpen, setMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // ✅ 인기 검색어 훅
  const {
    data: popularKeywords,
    isLoading: popularLoading,
    isError: popularError,
  } = usePopularSearchKeywords();

  // ✅ 검색어 저장 훅
  const { mutate: saveSearchKeyword } = useSaveSearchKeyword();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/service" },
    { name: "Category", href: "/category" },
    { name: "Contact Us", href: "/contact" },
    { name: "My Page", href: "/myPage" },
    { name: "Log In | Sign Up", href: "/login" },
  ];

  const runSearch = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      alert("검색어를 입력해주세요");
      return;
    }

    // ✅ 검색어 저장
    // SearchHistoryRequestDto 필드에 맞게 필요하면 userId, type 등 추가
    saveSearchKeyword({
      keyword: trimmed,
    } as any);

    const hasResult = mockContents.some((title) => title.includes(trimmed));

    if (hasResult) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/search/noResult?q=${encodeURIComponent(trimmed)}`);
    }
    setShowMobileSearch(false);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    runSearch(query);
  };

  // ✅ 인기 검색어 클릭 시도 저장 + 검색 실행
  const handlePopularClick = (keyword: string) => {
    setQuery(keyword);
    runSearch(keyword);
  };

  return (
    <main>
      <header
        className={`
          fixed md:relative top-0 left-0 w-full z-50
          bg-[#FF4545]
          md:bg-white md:text-gray-700
          md:backdrop-blur-sm
          border-0
          md:border-b md:border-gray-300
          px-4 sm:px-10 lg:px-[17%] py-4 md:py-3
          flex md:flex-row justify-between md:items-center
        `}
      >
        {/* 로고 & 모바일 버튼 */}
        <div className="relative flex flex-1 justify-between items-center ">
          <Link
            href="/"
            className="text-white md:text-red-500 font-bold text-2xl sm:text-2xl md:text-sm font-playfair"
          >
            Marketer&apos;s Fridge
          </Link>
          <div className="place-self-center place-items-center">
            <button
              className="cursor-pointer md:hidden mr-3 align-middle"
              onClick={() => setShowMobileSearch((prev) => !prev)}
              aria-label="모바일 검색 열기"
            >
              <Search size={20} className="text-white" />
            </button>
            <button
              className="cursor-pointer md:hidden align-middle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="메뉴 열기"
            >
              <Menu size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* ✅ 모바일 검색창 */}
        {showMobileSearch && (
          <div className="absolute top-[60px] left-0 w-full z-40 main-red px-4 pt-4 pb-8 shadow-md md:hidden">
            <div className="flex w-full items-center gap-2">
              <button className="absolute top-2/5 left-8 -translate-y-1/2">
                <Search size={16} className="text-gray-400" />
              </button>
              <input
                type="text"
                placeholder="필요한 콘텐츠, 꺼내볼까요?"
                className="flex-1 bg-white border border-gray-300 rounded-full px-10 py-2 text-sm focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <button onClick={() => setShowMobileSearch(false)}>
                <X size={20} className="text-white self-center" />
              </button>
            </div>

            {/* 🔽 여기 흰 부분에 인기 검색어 노출 */}
            <div className="absolute left-0 top-20 bg-white w-full h-[100vh] px-6 pt-4">
              <p className="text-xs font-semibold text-gray-500 mb-3">
                인기 검색어
              </p>

              {popularLoading && (
                <p className="text-xs text-gray-400">불러오는 중...</p>
              )}

              {popularError && !popularLoading && (
                <p className="text-xs text-gray-400">
                  인기 검색어를 불러오지 못했어요.
                </p>
              )}

              {!popularLoading && !popularError && (
                <>
                  {popularKeywords && (popularKeywords as string[]).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {(popularKeywords as string[]).map((keyword) => (
                        <button
                          key={keyword}
                          className="text-xs px-3 py-1 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100"
                          onClick={() => handlePopularClick(keyword)}
                        >
                          {keyword}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">
                      아직 인기 검색어가 없어요.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* 네비게이션 (PC) */}
        <nav className="hidden md:flex flex-wrap justify-end gap-x-8 text-xs text-gray-700">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`whitespace-nowrap transition-colors duration-200 ${
                  isActive ? "font-semibold text-black" : "hover:text-black"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </header>
    </main>
  );
}
