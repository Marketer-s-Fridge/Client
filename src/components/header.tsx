"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // 햄버거 아이콘 (lucide 사용)
import { SetStateAction } from "react";
import { Dispatch } from "react";
import { useRouter } from "next/navigation";
interface headerProps {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}
export default function Header({ menuOpen, setMenuOpen }: headerProps) {
  const pathname = usePathname();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: "홈", href: "/" },
    { name: "서비스 소개", href: "/service" },
    { name: "카테고리", href: "/category" },
    { name: "문의하기", href: "/contact" },
    { name: "마이페이지", href: "/myPage" },
    { name: "로그인 | 회원가입", href: "/login" },
  ];

  return (
    <main>
      <header
        className="relative w-full z-50 
             bg-white/80 backdrop-blur-sm 
             md:border-b-1 md:border-b-gray-200
             px-6 sm:px-10 lg:px-[17%] py-4 md:py-3
             flex md:flex-row justify-between md:items-center "
      >
        {/* 햄버거 메뉴 (모바일만) */}
        {/* 로고 */}
        <div className="relative flex flex-1 justify-between items-center ">
          <Link
            href="/"
            className=" text-red-500 font-bold text-xl sm:text-2xl md:text-sm font-playfair"
          >
            Marketer&apos;s Fridge
          </Link>
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴 열기"
          >
            <Menu size={27} />
          </button>
        </div>
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

      {showMobileSearch && (
        <div className="fixed inset-0 z-50 h-[30%] bg-white flex flex-col justify-start items-center px-4 sm:px-10 py-4">
          <div className="flex w-full items-center gap-2">
            <input
              type="text"
              placeholder="필요한 콘텐츠, 꺼내볼까요?"
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // 검색 처리 (예시)
                  router.push("/search/noResult");
                  setShowMobileSearch(false);
                }
              }}
            />
            <button onClick={() => setShowMobileSearch(false)}>
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
