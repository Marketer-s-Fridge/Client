"use client";

import Header from "@/components/header";
import SearchInput from "@/components/searchInput";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/footer";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* 검색 입력창 */}
      <section className="bg-white flex flex-col items-center pt-9 pb-7 md:pt-[4.5rem] md:pb-[5rem] relative">
        <SearchInput showInstagramButton />
      </section>

      {/* 이번주 카드뉴스 */}
      <section className="main-red py-[3%] px-[5%] sm:px-[10%] place-items-center justify-items-center ">
        <div className=" sm:aspect-[6/2]">
          <h2 className="text-white text-xl sm:text-3xl font-bold mb-6 ">
            이번주 카드뉴스
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-[2%] ">
            {[1, 2, 3, 4].map((i) => (
              <Image
                alt=""
                src={`/images/cardNews/${i}/001.png`}
                key={i}
                className="aspect-[3/4] bg-white rounded-lg shadow cursor-pointer 
                         transition duration-300 ease-in-out hover:scale-105"
                onClick={() => router.push("/cardNews")}
                width={250}
                height={300}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 인기 콘텐츠 + 에디터 픽 */}
      <section className="bg-white py-[6%] px-[10%] xl:px-[22%]">
        <div className="max-w-[1024px] mx-auto grid grid-cols-1 gap-15">
          {/* 인기 콘텐츠 */}
          <div className="flex flex-col">
            <div className="flex flex-row place-items-start gap-2">
              <Image
                alt="인기콘텐츠 아이콘"
                src="/icons/popular-icon.png"
                width={20}
                height={20}
                className="w-7 h-7"
              ></Image>
              <h3 className="text-2xl font-bold mb-4">이번주 인기 콘텐츠</h3>
            </div>
            <div className="flex flex-col md:flex-row gap-[4%]">
              <div className="flex-[3] relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow">
                <Image
                  src="/icons/rectangle-gray.png"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-[6] flex flex-col justify-between h-full">
                <div>
                  <p className="text-xl font-semibold mt-1">
                    마크는 왜 당근마켓에 글을 올렸을까?
                  </p>
                  <div className="flex text-gray-400 flex-row gap-[3%]">
                    <p className="text-xs mt-1">2025.05.07</p>
                    <p className="text-xs mt-1">12,324 views</p>
                    <p className="text-xs mt-1">냉장고에 담은 사람 1,231</p>
                  </div>
                  <p className="text-ms text-gray-600 mt-[5%]">
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
                <button className="mt-6 hidden md:flex self-start text-gray-500 border border-gray-300 rounded-full px-4 py-1 text-sm items-center gap-2 cursor-pointer">
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
            <div className="flex flex-row place-items-start gap-2">
              <Image
                alt="인기콘텐츠 아이콘"
                src="/icons/editorPick-icon.png"
                width={20}
                height={20}
                className="w-7 h-7"
              ></Image>
              <h3 className="text-2xl font-bold mb-4">에디터 픽</h3>
            </div>
            <div className="flex flex-col md:flex-row gap-[4%]">
              <div className="flex-[3] relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow">
                <Image
                  src="/icons/rectangle-gray.png"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-[6] flex flex-col justify-between h-full">
                <div>
                  <p className="text-xl font-semibold mt-1">
                    시니어 마케팅의 시대 성장하는 어른을 위한 전략
                  </p>
                  <div className="flex text-gray-400 flex-row gap-[3%]">
                    <p className="text-xs mt-1">2025.05.07</p>
                    <p className="text-xs mt-1">12,324 views</p>
                    <p className="text-xs mt-1">냉장고에 담은 사람 1,231</p>
                  </div>
                  <p className="text-ms text-gray-600 mt-[5%]">
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

                <button className="mt-6 hidden md:flex self-start text-gray-500 border border-gray-300 rounded-full px-4 py-1 text-sm items-center gap-2 cursor-pointer">
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
