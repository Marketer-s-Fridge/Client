'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: '홈', href: '/' },
    { name: '서비스 소개', href: '#' },
    { name: '카테고리', href: '/category' },
    { name: '문의하기', href: '/contact' },
    { name: '마이페이지', href: '/myPage' },
    { name: '로그인 | 회원가입', href: '/login' },
  ];

  return (
    <header className="border-b border-gray-300 px-6 sm:px-6 md:px-10 lg:px-20 xl:px-65 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-3 sm:gap-y-0">
      {/* 로고 */}
      <Link
        href="/"
        className="text-red-500 font-bold text-sm font-playfair"
      >
        Marketer&apos;s Fridge
      </Link>

      {/* 네비게이션 */}
      <nav className="flex flex-wrap justify-center sm:justify-end md:gap-x-10 gap-x-2 gap-y-2 text-xs text-gray-700">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isLoginJoin = item.name === '로그인 | 회원가입';

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`whitespace-nowrap transition-colors duration-200 ${
                isActive ? 'font-bold text-black' : 'hover:text-black'
              } ${isLoginJoin ? 'text-[11.5px] inline-flex items-center' : ''}`}
            >
              {isLoginJoin
                ? (
                  <>
                    로그인 <span className="text-gray-400">|</span> 회원가입
                  </>
                )
                : item.name
              }
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
