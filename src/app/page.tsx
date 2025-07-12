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

export default function HomePage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white">
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
            이번주 카드뉴스
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

        {/* 모바일: 슬라이드 하나씩 */}
        <div className="block md:hidden relative mt-16">
          {/* <h2 className="z-10 absolute text-white text-6xl font-bold mb-4">이번주 카드뉴스</h2> */}
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
        </div>
      </section>
      {/* 인기 콘텐츠 + 에디터 픽 */}
      <section className="bg-white py-12 px-5 sm:px-10 lg:px-[25%]">
        <div className="max-w-[1024px] mx-auto grid grid-cols-1 gap-16">
          {/* 인기 콘텐츠 */}
          <div className="flex flex-col">
            <div className="flex items-start gap-2 mb-4">
              <Image
                alt="인기콘텐츠 아이콘"
                src="/icons/popular-icon.png"
                width={28}
                height={28}
                className="w-7 h-7"
              />
              <h3 className="text-xl md:text-2xl font-bold">이번주 인기 콘텐츠</h3>
            </div>
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="w-full lg:w-[40%] aspect-[3/4] relative rounded-lg overflow-hidden shadow">
                <Image
                  src="/icons/rectangle-gray.png"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="lg:w-[60%] flex flex-col justify-between lg:h-full py-2">
                <div>
                  <p className="text-lg sm:text-xl font-bold mt-1">
                    마크는 왜 당근마켓에 글을 올렸을까?
                  </p>
                  <div className="flex flex-wrap text-gray-400 gap-x-4 text-xs mt-2">
                    <p>2025.05.07</p>
                    <p>12,324 views</p>
                    <p>냉장고에 담은 사람 1,231</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-8 leading-relaxed">
                    NCT 마크(@onyourm__ark)는 첫 솔로 앨범 ‘The Firstfruity’를
                    독특한 방식으로 알렸습니다. 중고거래 플랫폼 ‘당근마켓’을
                    활용해 팬들과의 새로운 접점을 만들었고, 일상 공간 속
                    자연스러운 힌트들을 통해 앨범 세계관을 확장했습니다.
                    <br />
                    <br />
                    ‘Lee’라는 이름으로 당근마켓에 올라온 글과 유튜브 브이로그 속
                    장면들이 연결되면서 팬들은 스스로 퍼즐을 맞추듯 세계관을
                    탐험하게 되었고, 공항 패션을 통한 앨범명 및 발매일 공개,
                    성수동 거리 곳곳에 설치된 과일 포스터와 QR코드까지 이어지며
                    몰입도를 높였습니다. ...
                  </p>
                </div>
                <button className="mt-6 flex self-start text-gray-500 border border-gray-300 rounded-full px-4 py-1 text-sm items-center gap-2 cursor-pointer">
                  <Image
                    src="/icons/pinkheart.png"
                    alt="하트"
                    width={16}
                    height={16}
                  />
                  MY냉장고에 저장
                </button>
              </div>
            </div>
          </div>

          {/* 에디터 픽 */}
          <div className="flex flex-col">
            <div className="flex items-start gap-2 mb-4">
              <Image
                alt="에디터픽 아이콘"
                src="/icons/editorPick-icon.png"
                width={28}
                height={28}
                className="w-7 h-7"
              />
              <h3 className="text-2xl font-bold">에디터 픽</h3>
            </div>
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="w-full lg:w-[40%] aspect-[3/4] relative rounded-lg overflow-hidden shadow">
                <Image
                  src="/icons/rectangle-gray.png"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="lg:w-[60%] flex flex-col justify-between lg:h-full py-2">
                <div>
                  <p className="text-lg sm:text-xl font-semibold mt-1">
                    시니어 마케팅의 시대 성장하는 어른을 위한 전략
                  </p>
                  <div className="flex flex-wrap text-gray-400 gap-x-4 text-xs mt-2">
                    <p>2025.05.07</p>
                    <p>12,324 views</p>
                    <p>냉장고에 담은 사람 1,231</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-8 leading-relaxed">
                    경제적 자원과 소비력을 갖춘 시니어층은 중요한 소비층으로
                    떠올랐으며, 시니어층의 새로운 취미, 학습, 자기계발 수요가
                    증가하면서 관련 제품과 서비스 시장도 함께 확대되고 있습니다.
                    <br />
                    <br />
                    이들은 단순한 고령 소비자가 아닌, 능동적이고 주체적인 삶을
                    추구하며 브랜드와의 정서적 교감을 중요시합니다. 따라서
                    시니어 마케팅은 더이상 선택이 아닌 필수 전략으로 자리잡고
                    있습니다. ...
                  </p>
                </div>

                <button className="mt-6  flex self-start text-gray-500 border border-gray-300 rounded-full px-4 py-1 text-sm items-center gap-2 cursor-pointer">
                  <Image
                    src="/icons/pinkheart.png"
                    alt="하트"
                    width={16}
                    height={16}
                  />
                  MY냉장고에 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
