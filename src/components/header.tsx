"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // 햄버거 아이콘 (lucide 사용)

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "홈", href: "/" },
    { name: "서비스 소개", href: "/service" },
    { name: "카테고리", href: "/category" },
    { name: "문의하기", href: "/contact" },
    { name: "마이페이지", href: "/myPage" },
    { name: "로그인 | 회원가입", href: "/login" },
  ];

  return (
    <header className="border-b border-gray-300 px-[5%] lg:px-[17%] py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-y-3 relative">
      {/* 로고 */}
      <div className="flex justify-between items-center">
        <Link
          href="/"
          className="text-red-500 font-bold text-2xl sm:text-3xl md:text-sm font-playfair"
        >
          Marketer&apos;s Fridge
        </Link>

        {/* 햄버거 메뉴 (모바일만) */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="메뉴 열기"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 네비게이션 (PC) */}
      <nav className="hidden md:flex flex-wrap justify-end gap-x-8 text-sm text-gray-700">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`whitespace-nowrap transition-colors duration-200 ${
                isActive ? "font-bold text-black" : "hover:text-black"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 네비게이션 (모바일 드롭다운) */}
      {isOpen && (
        <nav className="flex flex-col md:hidden mt-4 gap-3 text-sm text-gray-700">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors duration-200 ${
                  isActive ? "font-bold text-black" : "hover:text-black"
                }`}
                onClick={() => setIsOpen(false)} // 메뉴 클릭 시 닫기
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
