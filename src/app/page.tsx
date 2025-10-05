"use client";

import Header from "@/components/header";
import { useState } from "react";
import SearchInput from "@/components/searchInput";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/footer";
import MobileMenu from "@/components/mobileMenu";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import SaveToFridgeButton from "@/components/saveToFridgeButton";

export default function HomePage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 검색 입력창 */}
      <section className="hidden md:block bg-white flex-col items-center  pb-6 pt-14 sm:pb-12 relative">
        <SearchInput showInstagramButton />
      </section>

      {/* 오늘의 카드뉴스 */}
      <section className="w-full">
        {/* PC/Tablet 이상: 기존 그리드 유지 */}
        <div className="hidden md:block main-red py-8 px-5 sm:px-10 lg:px-[17%]">
          <h2 className="text-white text-xl sm:text-3xl font-bold mb-6">
            New Contents
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Image
                key={i}
                alt=""
                src={`/images/cardNews/${i}/001.png`}
                className="aspect-[3/4] bg-white rounded-lg shadow cursor-pointer 
                     transition duration-300 ease-in-out hover:scale-105 w-full"
                onClick={() => router.push("/cardNews")}
                width={250}
                height={300}
              />
            ))}
          </div>
        </div>

        {/* 모바일: 슬라이드 드래그형 카드뉴스 */}
        <div className="block md:hidden relative mt-4 px-5 w-full py-8">
          <h3 className="text-xl md:text-2xl font-bold mb-4">New Contents</h3>
          <Swiper
            slidesPerView={"auto"}
            spaceBetween={10}
            modules={[Autoplay]}
            className="w-full"
          >
            {[1, 2, 3, 4].map((i) => (
              <SwiperSlide
                key={i}
                className="!w-[40%] max-w-xs shrink-0" // 👈 핵심: 슬라이드 크기 고정
              >
                <Image
                  alt={`카드뉴스 ${i}`}
                  src={`/images/cardNews/${i}/001.png`}
                  className="aspect-[3/4] object-cover shadow cursor-pointer rounded-lg"
                  onClick={() => router.push("/cardNews")}
                  width={300}
                  height={400}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 모바일: 슬라이드 하나씩 */}
        {/* <div className="block md:hidden relative mt-4">
          <Swiper
            slidesPerView={1}
            loop
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            modules={[Autoplay]}
            className=" overflow-hidden"
          >
            {[1, 2, 3, 4].map((i) => (
              <SwiperSlide key={i}>
                <Image
                  alt=""
                  src={`/images/cardNews/${i}/001.png`}
                  className="w-full aspect-[3/4] object-cover shadow cursor-pointer"
                  onClick={() => router.push("/cardNews")}
                  width={300}
                  height={400}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div> */}
      </section>
      {/* 인기 콘텐츠 + 에디터 픽 */}
      <section className="hidden md:block bg-white py-12 px-5 sm:px-10 lg:px-[25%]">
        <div className="max-w-[1024px] mx-auto grid grid-cols-1 gap-16">
          {/* 인기 콘텐츠 */}
          <div className="flex flex-col">
            <div className="flex items-start gap-2 mb-4">
              {/* <Image
                alt="인기콘텐츠 아이콘"
                src="/icons/popular-icon.png"
                width={28}
                height={28}
                className="w-7 h-7"
              /> */}
              <h3 className="text-xl md:text-2xl font-bold">Hot Contents</h3>
            </div>
            <div className=" flex flex-col lg:flex-row gap-10">
              <div
                className=" transition duration-300 ease-in-out hover:scale-103 cursor-pointer w-full lg:w-[40%] aspect-[3/4] relative rounded-lg overflow-hidden shadow"
                onClick={() => router.push("/cardNews")}
              >
                <Image
                  src="/images/cardNews/hot/001.png"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="lg:w-[60%] flex flex-col justify-between lg:h-full py-2">
                <div>
                  <p className="text-lg sm:text-xl font-bold mt-1">
                    콜라보의 새로운 기준 제니 X 스탠리{" "}
                  </p>
                  <div className="flex flex-wrap text-gray-400 gap-x-4 text-xs mt-2">
                    <p>2025.10.05</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-5 leading-relaxed">
                    제니(@jennierubyjane)의 취향은 곧 모두의 취향이 된다는 ’제니
                    효과‘의 비밀은 단순한 유명세가 아니었어요. 제니는 단순한
                    모델 역할을 넘어, 직접 디자인에 참여하는 크리에이터로서 한국
                    전통 나전칠기의 우아한 감성을 담아냈죠. 패키지부터 텀블러에
                    달린 귀여운 참까지, 그녀의 섬세한 터치는 팬들의 소장 욕구를
                    완벽하게 자극했어요. <br />
                    <br />
                    여기에 스탠리(@stanley_korea)는 팝업 스토어에 팬들을 위한
                    백스테이지 무드를 구현하고, 한정판 출시로 색다른 경험을
                    선물했습니다. 이처럼 팬심을 이해하고 소통하는 마케팅은
                    역대급 반응을 일으키며, 스탠리가 110년 전통을 넘어
                    라이프스타일의 완성으로 자리 잡게 했어요...
                  </p>
                </div>
                <div className="mt-6">
                  <SaveToFridgeButton></SaveToFridgeButton>
                </div>
              </div>
            </div>
          </div>

          {/* 에디터 픽 */}
          <div className="flex flex-col">
            <div className="flex items-start gap-2 mb-4">
              {/* <Image
                alt="에디터픽 아이콘"
                src="/icons/editorPick-icon.png"
                width={28}
                height={28}
                className="w-7 h-7"
              /> */}
              <h3 className="text-2xl font-bold">Editor Pick</h3>
            </div>
            <div className=" flex flex-col lg:flex-row gap-10">
              <div
                className=" transition duration-300 ease-in-out hover:scale-103 cursor-pointer w-full lg:w-[40%] aspect-[3/4] relative rounded-lg overflow-hidden shadow"
                onClick={() => router.push("/cardNews")}
              >
                <Image
                  src="/images/cardNews/editor/001.png"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="lg:w-[60%] flex flex-col justify-between lg:h-full py-2">
                <div>
                  <p className="text-lg sm:text-xl font-semibold mt-1">
                    CEO 스캔들, 마케팅으로 뒤집다?
                  </p>
                  <div className="flex flex-wrap text-gray-400 gap-x-4 text-xs mt-2">
                    <p>2025.10.05</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-5 leading-relaxed">
                    💔 CEO 스캔들? PR 교과서로 만들었습니다.
                    <br />
                    2025년 7월, 콜드플레이 콘서트 전광판 한 장면이 전 세계를
                    뒤흔들었습니다. 아스트로노머 CEO & CPO 스캔들 -임원 사임 -
                    기업 이미지 추락. 보통이라면 사과문, 활동 중단… 하지만
                    아스트로노머는 사과 대신 브랜드 스토리 전환을 선택했습니다.
                    <br />
                    <br />
                    할리우드 배우 기네스 팰트로를 전격 투입해, 스캔들은 빼고
                    웃음과 메시지만 남긴 영상. 결과는 2,700만 조회수와 ‘PR의
                    정석’이라는 찬사. 그리고, 예상치 못한 2차 전개 콜드플레이
                    커플 장면은 ‘불륜밈’이 되어 방송·행사·SNS를 뒤덮었습니다.
                    기업이 뜻하지 않은 패러디와 콘텐츠가 .. <br />
                    <br />
                  </p>
                </div>
                <div className="mt-6">
                  <SaveToFridgeButton></SaveToFridgeButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Contents */}
      <div className="md:hidden flex flex-col px-5">
        <div className="flex items-start gap-2 mb-4">
          <Image
            alt="인기콘텐츠 아이콘"
            src="/icons/popular-icon.png"
            width={28}
            height={28}
            className="w-7 h-7"
          />
          <h3 className="text-xl md:text-2xl font-bold">Hot Contents</h3>
        </div>
        <Swiper slidesPerView={1} spaceBetween={20} className=" w-full">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SwiperSlide key={i} className="!w-full">
              <Image
                alt={`Hot 콘텐츠 ${i}`}
                src={`/images/cardNews/2/00${i}.png`}
                className="w-full aspect-[3/4] object-cover rounded-lg shadow cursor-pointer"
                width={600}
                height={800}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Editor Pick */}
      <div className="md:hidden flex flex-col mt-14 px-5">
        <div className="flex items-start gap-2 mb-4">
          <Image
            alt="에디터픽 아이콘"
            src="/icons/editorPick-icon.png"
            width={28}
            height={28}
            className="w-7 h-7"
          />
          <h3 className="text-xl md:text-2xl font-bold">Editor Pick</h3>
        </div>
        <Swiper slidesPerView={1} spaceBetween={20} className="w-full">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SwiperSlide key={i} className="!w-full">
              <Image
                alt={`Editor 콘텐츠 ${i}`}
                src={`/images/cardNews/3/00${i}.png`}
                className="w-full aspect-[3/4] object-cover rounded-lg shadow cursor-pointer"
                width={600}
                height={800}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Footer />
    </main>
  );
}
