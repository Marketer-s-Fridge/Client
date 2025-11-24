"use client";

import React, { useRef, useEffect, Children } from "react";

export default function MobileSectionPager({
  children,
  offsetTop = 44,
}: {
  children: React.ReactNode;
  offsetTop?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 스크롤 스냅 섹션 내부 컨텐츠에 페이드인 적용
    const targets = Array.from(
      el.querySelectorAll<HTMLElement>("[data-mobile-page]")
    );

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add("mobile-fade-visible");
          } else {
            target.classList.remove("mobile-fade-visible");
          }
        });
      },
      {
        threshold: 0.4, // 40% 이상 보일 때 페이드인
      }
    );

    targets.forEach((t) => io.observe(t));

    return () => {
      targets.forEach((t) => io.unobserve(t));
      io.disconnect();
    };
  }, []);

  const pageH = `calc(100svh - ${offsetTop}px)`;

  return (
    <div className="md:hidden relative w-full h-full overflow-hidden">
      {/* 스냅 컨테이너 */}
      <div
        ref={ref}
        className="
          overflow-y-auto
          snap-y snap-mandatory overscroll-contain
          no-scrollbar
          transition-colors duration-300
        "
        style={{
          height: pageH,
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          scrollbarGutter: "stable",
        }}
      >
        {Children.map(children, (child, i) => (
          <section
            key={i}
            className="
              snap-start
              relative isolate overflow-hidden flex w-full
            "
            style={{
              height: pageH,
              scrollSnapStop: "always",
            }}
          >
            {/* 여기 div가 섹션 내용 래퍼 + 페이드인 대상 */}
            <div
              data-mobile-page
              className="
                w-full h-full
                flex items-center justify-center
                pt-6 pb-10
                mobile-fade-base
              "
            >
              {child}
            </div>
          </section>
        ))}
      </div>

      {/* subtle gradient top */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-black/5 to-transparent" />

      {/* subtle gradient bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-black/5 to-transparent" />
    </div>
  );
}
