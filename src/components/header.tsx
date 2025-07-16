"use client";

import Link from "next/link";
import Image from "next/image";
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
    { name: "Home", href: "/" },
    { name: "About Us", href: "/service" },
    { name: "Category", href: "/category" },
    { name: "Contact Us", href: "/contact" },
    { name: "My Page", href: "/myPage" },
    { name: "Log In | Sign Up", href: "/login" },
  ];

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
        {/* 햄버거 메뉴 (모바일만) */}
        {/* 로고 */}
        <div className="relative flex flex-1 justify-between items-center ">
          <Link
            href="/"
            className=" text-white md:text-red-500 font-bold text-xl sm:text-2xl md:text-sm font-playfair"
          >
            Marketer&apos;s Fridge
          </Link>
          <div>
            <button
              className="md:hidden mr-3"
              onClick={() => setShowMobileSearch(true)}
              aria-label="모바일 검색 열기"
            >
              <Image
                src="/icons/search1.png"
                alt="검색"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            </button>
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="메뉴 열기"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
        {showMobileSearch && (
          <div className="absolute top-[60px] left-0 w-full z-40 main-red px-4 pt-4 pb-8 shadow-md md:hidden">
            <div className="flex w-full items-center gap-2">
              <button className="absolute top-2/5 left-6 -translate-y-1/2">
                <Image
                  src="/icons/search.png"
                  alt="검색"
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 cursor-pointer"
                  width={50}
                  height={50}
                />
              </button>
              <input
                type="text"
                placeholder="필요한 콘텐츠, 꺼내볼까요?"
                className="flex-1 bg-white border border-gray-300 rounded-full px-10 py-2 text-sm focus:outline-none"
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
