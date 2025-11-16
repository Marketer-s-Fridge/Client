"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { Menu, Search, X } from "lucide-react";
import {
  usePopularSearchKeywords,
  useSaveSearchKeyword,
} from "@/features/search/hooks/useSearchHistory";

import { useAuthStatus } from "@/features/auth/hooks/useAuthStatus"; // 🔥 추가

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ menuOpen, setMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // 🔥 여기서 로그인 정보 가져옴
  const { isAuthenticated, user, isLoading } = useAuthStatus();

  // 🔥 관리자 여부는 여기에서 판단 (로컬스토리지 X)
  const isAdmin = isAuthenticated && user?.id === "mf-admin";

  // 기본 네비
  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/service" },
    { name: "Category", href: "/category" },
    { name: "Contact Us", href: "/contact" },
    { name: "My Page", href: "/myPage" },
    { name: "Log In | Sign Up", href: "/login" },
  ];

  // 🔥 관리자면 Admin 메뉴 추가
  const finalNavItems = isAdmin
    ? [...navItems, { name: "Admin", href: "/admin" }]
    : navItems;

  // 인기 검색어 훅
  const {
    data: popularKeywords,
    isLoading: popularLoading,
    isError: popularError,
  } = usePopularSearchKeywords();

  // 검색어 저장 훅
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
    </main>
  );
}
