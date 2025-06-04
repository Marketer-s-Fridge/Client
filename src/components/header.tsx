"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "홈", href: "/" },
    { name: "서비스 소개", href: "/service" },
    { name: "카테고리", href: "/category" },
    { name: "문의하기", href: "/contact" },
    { name: "마이페이지", href: "/myPage" },
    { name: "로그인 | 회원가입", href: "/login" },
  ];

  return (
    <header className="border-b border-gray-300 px-[5%] lg:px-[17%] py-6 sm:py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-y-5 md:gap-y-0 ">
      <Link
        href="/"
        className="text-red-500 font-bold text-5xl md:text-sm font-playfair self-center md:self-baseline"
      >
        Marketer&apos;s Fridge
      </Link>

      {/* 네비게이션 */}
      <nav className="flex flex-wrap justify-center md:justify-end md:gap-x-10 gap-x-[5%] gap-y-2 text-xs text-gray-700">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isLoginJoin = item.name === "로그인 | 회원가입";

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`whitespace-nowrap transition-colors duration-200 ${
                isActive ? "font-bold text-black" : "hover:text-black"
              } ${isLoginJoin ? "text-[11.5px] inline-flex items-center" : ""}`}
            >
              {isLoginJoin ? (
                <>
                  로그인 <span className="text-gray-400">|</span> 회원가입
                </>
              ) : (
                item.name
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
