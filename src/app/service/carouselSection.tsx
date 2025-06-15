"use client";

import React from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const categories = [
  { name: "Beauty", image: "/images/beauty.jpg" },
  { name: "Tech", image: "/images/tech.jpg" },
  { name: "Lifestyle", image: "/images/lifestyle.jpg" },
  { name: "Food", image: "/images/food.jpg" },
  { name: "Fashion", image: "/images/fashion.jpg" },
  { name: "Beauty", image: "/images/beauty.jpg" },
  { name: "Tech", image: "/images/tech.jpg" },
  { name: "Lifestyle", image: "/images/lifestyle.jpg" },
  { name: "Food", image: "/images/food.jpg" },
  { name: "Fashion", image: "/images/fashion.jpg" },
  { name: "Beauty", image: "/images/beauty.jpg" },
  { name: "Tech", image: "/images/tech.jpg" },
  { name: "Lifestyle", image: "/images/lifestyle.jpg" },
  { name: "Food", image: "/images/food.jpg" },
  { name: "Fashion", image: "/images/fashion.jpg" },
  { name: "Beauty", image: "/images/beauty.jpg" },
  { name: "Tech", image: "/images/tech.jpg" },
  { name: "Lifestyle", image: "/images/lifestyle.jpg" },
  { name: "Food", image: "/images/food.jpg" },
  { name: "Fashion", image: "/images/fashion.jpg" },
  { name: "Beauty", image: "/images/beauty.jpg" },
  { name: "Tech", image: "/images/tech.jpg" },
  { name: "Lifestyle", image: "/images/lifestyle.jpg" },
  { name: "Food", image: "/images/food.jpg" },
  { name: "Fashion", image: "/images/fashion.jpg" },
  { name: "Beauty", image: "/images/beauty.jpg" },
  { name: "Tech", image: "/images/tech.jpg" },
  { name: "Lifestyle", image: "/images/lifestyle.jpg" },
  { name: "Food", image: "/images/food.jpg" },
  { name: "Fashion", image: "/images/fashion.jpg" },
];

export default function CarouselSection() {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "free-snap",
    slides: {
      perView: 5,
      spacing: 10,
      origin: "center", // ✅ 여기로 바꿔야 함
    },
    renderMode: "performance",
  });

  return (
    <section className="relative bg-white py-14 text-center">
      <div className="absolute w-full z-10 top-[12%] sm:top-[14%]">
        <h2 className="text-[12px] md:text-3xl font-bold text-red-500">
          콕! 찝어먹기
        </h2>
        <p className="text-[9px] text-xs md:text-base text-gray-600 mt-2 sm:mt-5 sm:leading-5">
          마치 냉장고 앞에서 먹고 싶은 음식을 꺼내 먹듯,
          <br />
          <span className="text-red-600 font-semibold font-playfair">
            {`Marketer’s Fridge `}
          </span>
          에서는 당신이 필요한 순간, 원하는 인사이트만 쏙 꺼내갈 수 있습니다.
        </p>
      </div>

      <div className="relative w-full flex justify-center py-[10%]">
        {/* ✅ 타원형 오버레이 */}
        <Image
          src="/images/elipse.png"
          alt=""
          width={1300}
          height={500}
          className="absolute w-full h-auto top-[10%] z-5"
        ></Image>

        <div ref={sliderRef} className="keen-slider px-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="keen-slider__slide flex justify-center"
              style={{ perspective: "1000px" }}
            >
              <div className="relative w-[290px] aspect-[3/4] rounded-xl overflow-hidden shadow-xl transition-transform duration-0 transform hover:scale-101">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          ))}
        </div>

        <Image
          src="/images/elipse.png"
          alt=""
          width={1300}
          height={500}
          className="absolute w-full h-auto bottom-[10%] z-5"
        ></Image>
      </div>
    </section>
  );
}
