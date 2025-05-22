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
    <section className="border-b border-gray-300 px-4 sm:px-10 md:px-20 lg:px-40 xl:px-60 py-3 flex justify-between items-center">
      {/* 홈으로 이동하는 로고 */}
      <Link
        href="/"
        className="text-red-500 font-bold text-sm font-playfair cursor-pointer whitespace-nowrap"
      >
        Marketer&apos;s Fridge
      </Link>

      {/* 네비게이션 */}
      <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs  text-gray-700">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`whitespace-nowrap ${
              pathname === item.href ? 'font-bold text-black' : ''
            } `}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </section>
  );
}
