'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AdminHeader() {
  return (
    <header className="w-full border-b border-gray-300 px-6 sm:px-6 md:px-10 lg:px-20 xl:px-65 py-4 flex items-center justify-between">
      {/* 로고 */}
      <Link href="/" className="text-red-500 font-bold text-sm font-playfair">
        Marketer&apos;s Fridge
      </Link>

      {/* 오른쪽 아이콘 + 이름 */}
      <div className="flex items-center gap-3">
        {/* 알림 아이콘 */}
        <Image
          src="/icons/bell-bt.png"
          alt="Notification"
          width={20}
          height={20}
        />

        {/* 회색 동그라미 */}
        <div className="w-5 h-5 bg-gray-500 rounded-full" />

        {/* Admin12 텍스트 */}
        <span className="text-sm font-semibold text-black">Admin12</span>
      </div>
    </header>
  );
}
