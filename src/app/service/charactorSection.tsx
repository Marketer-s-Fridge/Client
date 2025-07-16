"use client";

import Image from "next/image";

const characters = [
  {
    name: "멜로",
    tags: ["#먹방러", "#푸드인플루언서"],
    image: "/icons/charactor/수박.png",
  },
  {
    name: "토미",
    tags: ["#빈티지", "#룩북중독자"],
    image: "/icons/charactor/토마토.png",
  },
  {
    name: "맥스",
    tags: ["#테크리뷰어", "#전략가"],
    image: "/icons/charactor/사과.png",
  },
  {
    name: "베리",
    tags: ["#감성러", "#소확행"],
    image: "/icons/charactor/딸기.png",
  },
  {
    name: "세리&리오",
    tags: ["#남녀쌍둥이", "#뷰티덕후"],
    image: "/icons/charactor/체리.png",
  },
];

export default function CharacterSection() {
  return (
    <section className="relative w-full mt-[17%]  flex justify-center items-center">
      <div className="absolute inset-0 flex justify-center items-end gap-[3.6%]">
        {characters.map((char, idx) => (
          <div key={idx} className="relative cursor-pointer group">
            <Image
              alt={char.name}
              src={char.image}
              width={0}
              height={0}
              sizes="(max-width: 768px) 60px, (max-width: 1024px) 80px, 100px"
              className="w-[10vw] max-w-[150px] min-w-[50px] h-auto transition-all"
            />

            {/* 호버 시 정보 */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-black rounded-lg px-4 py-2 text-xs md:text-sm text-center z-10 opacity-0 group-hover:opacity-90 transition-opacity duration-200 whitespace-nowrap">
              <p className="font-bold text-sm md:text-lg">{char.name}</p>
              <p className="opacity-80">{char.tags.join(" ")}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
