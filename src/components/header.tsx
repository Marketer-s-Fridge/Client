// components/Header.tsx
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
    <section className="border-b border-gray-300 px-60 py-3 flex justify-between items-center">
      {/* 홈으로 이동하는 로고 */}
      <Link href="/" className="text-red-500 font-bold text-sm font-playfair cursor-pointer">
        Marketer&apos;s Fridge
      </Link>

      {/* 네비게이션 */}
      <nav className="space-x-6 text-xs text-gray-700">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`${
              pathname === item.href ? 'font-bold text-black' : ''
            } hover:underline`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </section>
  );
}
