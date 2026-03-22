"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import fridgeBody from "../../../../public/icons/character/fridge-body-re.png";

export default function Fridge({
  stageNum,
  slidesLength,
}: {
  stageNum: number;
  slidesLength: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  // 👉 화면의 50% 이상 보이면 true (once: true → 최초 1번만)

  useEffect(() => {
    if (stageNum === 0 && inView) {
      setOpen(true); // 첫 슬라이드 + 실제 보일 때 → 열림
    } else if (stageNum === slidesLength) {
      setOpen(false); // 마지막 → 닫힘
    } else if (stageNum > 0 && stageNum < slidesLength) {
      setOpen(true); // 캐릭터 소개 → 항상 열림
    }
  }, [stageNum, slidesLength, inView]);

  // 문 두께(px)
  const thickness = 20;

  return (
    <div
      ref={ref}
      className="
    z-50 relative
    w-[19vw]
    h-auto aspect-[3/5]
    perspective-[1200px]
  "
    >
      {/* 본체 */}
      <Image
        src={fridgeBody}
        alt="fridge body"
        fill
        priority // ✅ 첫 화면에서 꼭 보여야 하는 이미지면 무조건 넣기
        placeholder="blur" // ✅ blur 미리 보기 (선택)
        quality={100} // 기본 75 → 100으로
        className="object-contain pointer-events-none"
      />

      {/* 문짝 */}
      <motion.div
        className="absolute top-0 right-0 h-full"
        style={{
          width: "100%", // ✅ 고정값 대신 컨테이너 너비에 맞춤
          transformStyle: "preserve-3d",
          transformOrigin: "right center",
        }}
        animate={{ rotateY: open ? 135 : 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {/* 바깥쪽 */}
        <div
          className="absolute inset-0"
          style={{ transform: `translateZ(${thickness / 5}px)` }}
        >
          <Image
            src="/icons/character/fridge-door-outer.png"
            alt="fridge door outer"
            fill
            className="object-contain"
          />
        </div>

        {/* 안쪽 */}
        <div
          className="absolute inset-0"
          style={{
            transform: `rotateY(180deg) translateZ(${thickness / 2}px)`,
          }}
        >
          <Image
            src="/icons/character/fridge-door-inner.png"
            alt="fridge door inner"
            fill
            className="object-contain"
          />
        </div>
      </motion.div>
    </div>
  );
}
