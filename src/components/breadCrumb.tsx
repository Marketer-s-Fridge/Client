"use client";

import Link from "next/link";

interface BreadcrumbProps {
  category: string;
}

export default function Breadcrumb({ category }: BreadcrumbProps) {
  return (
    <div className="flex px-[5%] lg:px-[17%] text-xs pt-5 text-gray-500 mb-8">
      <Link href="/" className="hover:text-black">
        홈
      </Link>
      <span className="mx-2">&gt;</span>
      <Link href="/category" className="hover:text-black">
        카테고리
      </Link>
      <span className="mx-2">&gt;</span>
      <span className="text-black font-medium">{category}</span>
    </div>
  );
}
