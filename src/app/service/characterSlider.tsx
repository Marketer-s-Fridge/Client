"use client";

import { useState } from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import UnderlinedDescription from "@/components/underlineDescription";

const characters = [
  {
    id: "melo",
    name: "멜로는 항상 진심을 다해 먹어요",
    description: [
      "배달앱 VIP, 동네 맛집 리스트를 엑셀로 정리해두는 철저함 ",
      "인스타 릴스에 매일 식사 기록 올리는 ‘푸드로그 인플루언서’!",
      "먹는 게 곧 힐링이고, 함께 나누는 게 또 다른 기쁨 ",
    ],
    image: "/icons/character/mobile/melo.png",
  },
  {
    id: "berry",
    name: "베리는 새벽 독서가 제일 좋아요",
    description: [
      "사람이 많은 곳보단 혼자만의 시간",
      "인센스 피우고 감성 플레이리스트 들으며 마음을 정리해요",
      "사진 감각이 뛰어나 친구들이 감성 브이로그 찍으라며 부러워해요 ",
    ],
    image: "/icons/character/mobile/berry.png",
  },
  {
    id: "seri_lio",
    name: "뷰티 인플루언서 세리 & 그루밍남 리오",
    description: [
      "세리는 뷰티 제품 리뷰의 달인",
      "리오는 자연스럽게 화장품에 눈뜬 끼쟁이",
      "둘은 늘 뷰티 팝업 행사에서 트렌드를 선도해요!",
    ],
    image: "/icons/character/mobile/twin.png",
  },
  {
    id: "max",
    name: "맥스는 테크기기 리뷰 블로그 운영자에요",
    description: [
      "삶의 모든 순간을 자동화한 시스템 덕후",
      "노션에 신제품 기능을 꼼꼼히 정리하고 리뷰하는 게 일상!",
      "가전 브랜드 언팩행사에서 늘 첫 줄에 앉아 있어요",
    ],
    image: "/icons/character/mobile/max.png",
  },
  {
    id: "tomi",
    name: "토미는 매일 아침 미니 패션쇼를 열어요",
    description: [
      "옷장 앞에서 미니 패션쇼를 여는 것으로 하루를 시작해요",
      "홍대 셀렉샵부터 디자이너 브랜드까지 모르는게 없어요",
      "양말, 키링 소품 하나하나 신경쓰는 까칠한 패셔니스타!",
    ],
    image: "/icons/character/mobile/tomi.png",
  },
];

export default function CharacterSlider() {
  const [active, setActive] = useState(0);
  const cur = characters[active] ?? characters[0];

  return (
    <div className="flex flex-col items-center w-full">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={30}
        slidesPerView={1}
        allowTouchMove={true}
        observer={true}
        observeParents={true}
        onResize={(swiper) => swiper.update()}
        onSlideChange={(swiper) => {
          const idx = swiper.realIndex ?? swiper.activeIndex ?? 0;
          const safe = Math.max(0, Math.min(characters.length - 1, idx));
          setActive(safe);
        }}
        className="w-full flex justify-center"
        style={{ height: 340, width: 500 }}
      >
        {characters.map((c) => (
          <SwiperSlide
            key={c.id}
            className="flex justify-center items-center h-[360px] w-full"
          >
            <Image
              src={c.image}
              alt={c.name}
              width={285}
              height={330}
              className="object-contain mx-auto"
              priority={c.id === "melo"}
              style={{ height: "auto" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 아래 텍스트 영역 */}
      <div className="relative flex flex-col items-center mt-2">
        <Image
          src="/icons/character/mobileSketch.png"
          alt="스케치북"
          width={350}
          height={300}
          className="object-contain"
          priority
        />
        <div className="absolute top-[25%] w-[77%] text-left">
          <p className="font-semibold text-[15.5px] mb-1 pb-1 border-b-[1px] border-gray-400">
            {cur.name}
          </p>
          <UnderlinedDescription lines={cur.description} />
        </div>
      </div>
    </div>
  );
}
