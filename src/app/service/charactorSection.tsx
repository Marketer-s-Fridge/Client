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
    <section className="mt-[7%] flex flex-row justify-center items-center gap-[3.6%] relative">
      {characters.map((char, idx) => (
        <div
          key={idx}
          className="relative cursor-pointer group"
        >
          <Image
            alt={char.name}
            src={char.image}
            width={150}
            height={150}
            className="rounded-md transition-all"
          />

          {/* 호버 시 나타나는 정보 */}
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black  text-white rounded-lg px-4 py-2 whitespace-nowrap text-center z-10 opacity-0 group-hover:opacity-90 transition-opacity duration-200">
            <p className="font-bold text-lg">{char.name}</p>
            <p className="text-sm opacity-80">{char.tags.join(" ")}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
