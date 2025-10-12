"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

const characters = [
  {
    id: "melo",
    name: "멜로는 항상 진심을 다해 먹어요",
    description: [
      "배달앱 VIP, 동네 맛집 리스트를 엑셀로 정리해두는 철저함 ",
      "인스타 릴스에 매일 식사 기록 올리는 ‘푸드로그 인플루언서’!",
      "먹는 게 곧 힐링이고, 함께 나누는 게 또 다른 기쁨 ",
    ],
    image: "/icons/character/수박2.png",
  },
  {
    id: "berry",
    name: "베리는 새벽 독서가 제일 좋아요",
    description: [
      "사람이 많은 곳보단 혼자만의 시간",
      "인센스 피우고 감성 플레이리스트 들으며 마음을 정리해요",
      "사진 감각이 뛰어나 친구들이 감성 브이로그 찍으라며 부러워해요 ",
    ],
    image: "/icons/character/사과2.png",
  },
  {
    id: "seri_lio",
    name: "뷰티 인플루언서 세리 & 그루밍남 리오",
    description: [
      "세리는 뷰티 제품 리뷰의 달인",
      "리오는 자연스럽게 화장품에 눈뜬 끼쟁이",
      "둘은 늘 뷰티 팝업 행사에서 트렌드를 선도해요!",
    ],
    image: "/icons/character/딸기2.png",
  },
  {
    id: "max",
    name: "맥스는 테크기기 리뷰 블로그 운영자에요",
    description: [
      "삶의 모든 순간을 자동화한 시스템 덕후",
      "노션에 신제품 기능을 꼼꼼히 정리하고 리뷰하는 게 일상!",
      "가전 브랜드 언팩행사에서 늘 첫 줄에 앉아 있어요",
    ],
    image: "/icons/character/체리2.png",
  },
  {
    id: "tomi",
    name: "토미는 매일 아침 미니 패션쇼를 열어요",
    description: [
      "하루의 시작은 옷장 앞 패션쇼",
      "홍대 셀렉샵부터 디자이너 브랜드까지 완벽 정리!",
      "소품 하나에도 진심인 감각적인 패셔니스타",
    ],
    image: "/icons/character/토마토2.png",
  },
];

export default function CharacterSlider() {
  return (
    <>
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet custom-bullet",
          bulletActiveClass:
            "swiper-pagination-bullet-active custom-bullet-active",
        }}
        spaceBetween={30}
        slidesPerView={1}
        className="w-full h-full"
      >
        {characters.map((char) => (
          <SwiperSlide key={char.id} className="flex flex-col items-center">
            <Image
              src={char.image}
              alt={char.name}
              width={300}
              height={400}
              className="mx-auto mb-[17.5%]"
            />

            <div className="relative flex flex-col items-center ">
              {/* ✏️ 스케치북 이미지 */}
              <Image
                src="/icons/character/sketch.png"
                alt="스케치북"
                width={290}
                height={250}
                className="object-contain shadow-xl"
              />

              {/* 📜 캐릭터 설명 텍스트 */}
              <div className="absolute top-[18%] w-[72%] text-left text-gray-700 text-[13.5px] leading-relaxed font-medium">
                <p className="font-semibold text-[15.5px] mb-3 underline-title">
                  {char.name}
                </p>

                {char.description.map((line, i) => (
                  <div key={i} className="underline-line mb-2">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .custom-bullet {
          width: 9.5px;
          height: 9.5px;
          background: #d9d9d9;
          opacity: 1;
          margin: 0 6px !important;
        }
        .custom-bullet-active {
          background: #969696 !important;
        }
        .swiper-pagination {
          bottom: 46% !important;
        }

        /* 🎨 밑줄이 전체 너비를 채우게 */
        .underline-line {
          width: 100%;
          border-bottom: 2px solid rgba(0, 0, 0, 0.15);
          padding-bottom: 3px;
        }

        .underline-title {
          width: 100%;
          border-bottom: 2px solid rgba(0, 0, 0, 0.25);
          padding-bottom: 4px;
          display: block;
        }
      `}</style>
    </>
  );
}
