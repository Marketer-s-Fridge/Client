"use client";
import React, { useRef, useState, useEffect, Children } from "react";

export default function MobileSectionPager({
  children,
  offsetTop = 44, // 헤더 높이(px) - main에 pt-11이면 44 정도
}: {
  children: React.ReactNode;
  offsetTop?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // const [idx, setIdx] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const h = el.clientHeight;
      const i = Math.round(el.scrollTop / h);
      // setIdx(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const pageH = `calc(100svh - ${offsetTop}px)`;

  return (
    <div className="md:hidden relative w-full h-full">
      {/* 스냅 컨테이너 */}
      <div
        ref={ref}
        className="overflow-y-auto snap-y snap-mandatory overscroll-contain"
        style={{
          height: pageH,
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          // 스크롤바가 생겨도 레이아웃 밀림 방지(지원 브라우저 한정)
          scrollbarGutter: "stable",
        }}
      >
        {/* 각 섹션 = 한 화면 */}
        {Children.map(children, (child, i) => (
          <section
            key={i}
            className="snap-start relative isolate overflow-hidden flex w-full"
            style={{
              height: pageH,
              // 스냅이 중간에서 멈추지 않도록
              scrollSnapStop: "always",
            }}
          >
            {/* 섹션 내부는 자유롭게 배치 */}
            <div className="w-full h-full">{child}</div>
          </section>
        ))}
      </div>

   
    </div>
  );
}
