"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, Dispatch, SetStateAction } from "react";
import { Menu, Search, X } from "lucide-react";
import {
  usePopularSearchKeywords,
  useSaveSearchKeyword,
} from "@/features/search/hooks/useSearchHistory";

import { useAuthStatus } from "@/features/auth/hooks/useAuthStatus";

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ menuOpen, setMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { isAuthenticated, user } = useAuthStatus();
  const isAdmin = isAuthenticated && user?.id === "mf-admin";

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/service" },
    { name: "Category", href: "/category" },
    { name: "Contact Us", href: "/contact" },
    { name: "My Page", href: "/myPage" },
    { name: "Log In | Sign Up", href: "/login" },
  ];

  const finalNavItems = isAdmin
    ? [...navItems, { name: "Admin", href: "/admin" }]
    : navItems;

  const {
    data: popularKeywords,
    isLoading: popularLoading,
    isError: popularError,
  } = usePopularSearchKeywords();

  const { mutate: saveSearchKeyword } = useSaveSearchKeyword();

  const runSearch = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      alert("검색어를 입력해주세요");
      return;
    }

    saveSearchKeyword({ keyword: trimmed } as any);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setShowMobileSearch(false);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") runSearch(query);
  };

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
        {/* 로고 / 모바일 버튼 */}
        <div className="relative flex flex-1 justify-between items-center ">
          <Link
            href="/"
            className="text-white md:text-red-500 font-bold text-2xl md:text-sm font-playfair"
          >
            Marketer&apos;s Fridge
          </Link>
          <div className="place-self-center place-items-center">
            <button
              className="cursor-pointer md:hidden mr-3"
              onClick={() => setShowMobileSearch((prev) => !prev)}
            >
              <Search size={20} className="text-white" />
            </button>
            <button
              className="cursor-pointer md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* PC 네비 */}
        <nav className="hidden md:flex justify-end gap-x-8 text-xs text-gray-700">
          {finalNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`whitespace-nowrap ${
                  isActive ? "font-semibold text-black" : "hover:text-black"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* 🔍 모바일 검색창 (Search 아이콘 눌렀을 때만 표시) */}
      {showMobileSearch && (
        <div className="md:hidden fixed top-[56px] left-0 w-full z-40 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1.5">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="검색어를 입력하세요"
                className="w-full text-sm outline-none"
              />
            </div>
            <button
              className="p-1"
              onClick={() => setShowMobileSearch(false)}
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* 인기 검색어 (선택) */}
          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
            {!popularLoading && !popularError &&
              popularKeywords &&
              popularKeywords.map((k: any) => (
                <button
                  key={k.keyword}
                  onClick={() => handlePopularClick(k.keyword)}
                  className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700"
                >
                  #{k.keyword}
                </button>
              ))}
          </div>
        </div>
      )}
    </main>
  );
}
