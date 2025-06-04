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
      <section className="main-red py-10 px-[5%] sm:px-[10%] place-items-center justify-items-center ">
        <div className=" sm:aspect-[6/2]">
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-6 ">
            이번주 카드뉴스
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-[2%] ">
            {[1, 2, 3, 4].map((i) => (
              <Image
                alt=""
                src="/icons/rectangle-gray.png"
                key={i}
                className=" aspect-[3/4] bg-white rounded-lg shadow cursor-pointer"
                onClick={() => router.push("/cardNews")}
                width={250}
                height={300}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 인기 콘텐츠 + 에디터 픽 */}
      <section className="bg-white py-10 px-[5%] sm:px-10 md:px-20">
        <div className="max-w-[1024px] mx-auto grid grid-cols-2 md:grid-cols-2 gap-10">
          {/* 인기 콘텐츠 */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-4">이번주 인기 콘텐츠</h3>
            <div className="relative aspect-[2/1] w-full rounded-lg overflow-hidden shadow">
              <Image
                src="/icons/rectangle-gray.png"
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">브랜드커뮤니케이션</p>
            <p className="text-sm font-medium mt-1">
              마크는 왜 달마과자에 글을 올렸을까?
            </p>
            <p className="text-xs text-gray-500 mt-1">
              NCT 마크는 첫 솔로 앨범 ‘The Firstfruity’를 독특한 방식으로
              알렸습니다. 중고거래 플랫폼 ‘당근마켓’을 활용해 팬들과의 새로운
              접점을 만들었고, 일상 공간 속 자연스러운 힌트들을 통해 앨범
              세계관...
            </p>
          </div>

          {/* 에디터 픽 */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-4">에디터 픽</h3>
            <div className="relative aspect-[2/1] w-full rounded-lg overflow-hidden shadow">
              <Image
                src="/icons/rectangle-gray.png"
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">리브랜딩</p>
            <p className="text-sm font-medium mt-1">시니어 마케팅의 시대</p>
            <p className="text-xs text-gray-500 mt-1">
              경제적 자원과 소비력을 갖춘 시니어층은 중요한 소비층으로
              떠올랐으며, 시니어층의 새로운 취미, 학습, 자기계발 수요가
              증가하면서 관련 제품과 서비스 시장도 함께 확대되고 있습니다. 이제
              시니어...
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
