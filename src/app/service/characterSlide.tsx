"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

export default function CharacterSlider() {
  return (
    <>
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet custom-bullet", // 기본 bullet 클래스 + 커스텀
          bulletActiveClass:
            "swiper-pagination-bullet-active custom-bullet-active",
        }}
        spaceBetween={30}
        slidesPerView={1}
        className="w-full h-full"
      >
        <SwiperSlide>
          <Image
            src="/icons/character/수박2.png"
            alt="수박"
            width={300}
            height={400}
            className="mx-auto mb-[17.5%]"
          />
          <Image
            src="/icons/character/sketch.png"
            alt="스케치북"
            width={275}
            height={250}
            className="justify-self-center object-contain"
          ></Image>
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/icons/character/사과2.png"
            alt="사과"
            width={300}
            height={400}
            className="mx-auto mb-[17.5%]"
          />
          <Image
            src="/icons/character/sketch.png"
            alt="스케치북"
            width={275}
            height={250}
            className="justify-self-center object-contain"
          ></Image>
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/icons/character/딸기2.png"
            alt="딸기"
            width={300}
            height={400}
            className="mx-auto mb-[17.5%]"
          />
          <Image
            src="/icons/character/sketch.png"
            alt="스케치북"
            width={275}
            height={250}
            className="justify-self-center object-contain"
          ></Image>
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/icons/character/체리2.png"
            alt="체리"
            width={300}
            height={400}
            className="mx-auto mb-[17.5%]"
          />
          <Image
            src="/icons/character/sketch.png"
            alt="스케치북"
            width={275}
            height={250}
            className="justify-self-center object-contain"
          ></Image>
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/icons/character/토마토2.png"
            alt="토마토"
            width={300}
            height={400}
            className="mx-auto mb-[17.5%]"
          />
          <Image
            src="/icons/character/sketch.png"
            alt="스케치북"
            width={275}
            height={250}
            className="justify-self-center object-contain"
          ></Image>
        </SwiperSlide>
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
          bottom: 46% !important; /* 원하는 만큼 내리기 */
        }
      `}</style>
    </>
  );
}
