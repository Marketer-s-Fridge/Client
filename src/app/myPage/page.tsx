// ✅ Next.js 클라이언트 컴포넌트
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import DoughnutChart from "@/components/doughnutChart";
import ChangeNicknameModal from "@/components/changeNicknameModal";
import Image from "next/image";
import Footer from "@/components/footer";

export default function MyPage() {
  const router = useRouter();
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0); // 🔁 최근 본 콘텐츠 슬라이드 인덱스 상태

  // 최근 본 콘텐츠와 MY 냉장고 데이터
  const recentlyViewedContents = [
    "KOREADB 2025 뉴 컬렉션",
    "기능성과 스타일의 완벽 조화",
    "환경을 생각한 지속 가능한 브랜드",
    "셀럽들의 공항 패션 스타일",
    "에센셜 드레스 스타일링",
    "재테크 가이드",
  ];

  const myFridgeContents = [
    "건강한 라이프스타일을 위한 팁",
    "재테크 초보자를 위한 금융 상식",
    "재테크를 위한 중요한 전략",
  ];

  const cardsPerPage = 3; // 📦 슬라이드 한 페이지당 카드 수
  const maxSlideIndex =
    Math.ceil(recentlyViewedContents.length / cardsPerPage) - 1;

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* 👤 프로필 영역 */}
      <section className="flex py-10 px-[5%] lg:px-[17%] main-red text-white w-full">
        <div className="w-full flex md:flex-row justify-between items-center ">
          <div className="flex w-[1/2] gap-[5%] sm:gap-[10%]">
            <Image
              src="/images/profile-character.png"
              alt="프로필"
              className="w-[35%] sm:w-[40%] h-auto"
              width={230}
              height={230}
            />
            <div className="justify-center-safe items-center self-center">
              <h2 className="text-medium sm:text-2xl font-bold">마케터</h2>
              <p className="text-xs sm:text-sm">a123456789@gmail.com</p>
              <button
                onClick={() => setIsNicknameModalOpen(true)}
                className="flex cursor-pointer mt-2 flex-1 border border-white rounded-full text-xs px-2 py-1 sm:px-4 sm:py-1 sm:text-sm"
              >
                프로필 편집
              </button>
            </div>
          </div>
          <div className="place-content-end flex w-[50%] text-sm sm:text-lg gap-5 sm:gap-15 md:text-2xl font-semibold">
            <button
              onClick={() => router.push("/myPage/account/myInfo")}
              className="cursor-pointer"
            >
              계정 관리
            </button>
            <button
              onClick={() => router.push("/myPage/myContact")}
              className="cursor-pointer"
            >
              내 문의 내역
            </button>
          </div>
        </div>
      </section>

      {/* 📊 콘텐츠 + 리포트 */}
      <section>
        <section className="px-8 py-14">
          <div className="max-w-[1024px] mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 items-start">
            {/* 📚 왼쪽 콘텐츠 */}
            <div className="space-y-12">
              {/* 📌 최근 본 콘텐츠 슬라이드 */}
              <div className="relative">
                <h3 className="text-2xl font-bold mb-4">최근 본 콘텐츠</h3>

                <div className="relative w-full max-w-[480px] mx-0">
                  {/* ◀ 왼쪽 화살표 */}
                  <button
                    onClick={() =>
                      slideIndex > 0 && setSlideIndex(slideIndex - 1)
                    }
                    className="absolute left-[-33px] top-1/2 -translate-y-1/2 z-10 hidden md:block cursor-pointer"
                  >
                    <Image
                      src="/icons/left.png"
                      alt="이전"
                      width={30}
                      height={30}
                    />
                  </button>

                  {/* 📦 슬라이드 컨테이너 */}
                  <div className="overflow-hidden w-full">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${slideIndex * 480}px)`, // ✅ 픽셀 단위로 정확히 이동
                        width: `${(maxSlideIndex + 1) * 480}px`, // ✅ 각 슬라이드 너비만큼 전체 너비
                      }}
                    >
                      {/* 한 페이지에 카드 3개 */}
                      {Array.from({ length: maxSlideIndex + 1 }).map(
                        (_, pageIndex) => (
                          <div
                            key={pageIndex}
                            className="flex gap-6 w-[480px] flex-shrink-0 justify-center"
                          >
                            {recentlyViewedContents
                              .slice(
                                pageIndex * cardsPerPage,
                                pageIndex * cardsPerPage + cardsPerPage
                              )
                              .map((title, i) => (
                                <div
                                  key={i}
                                  className="w-[140px] flex-shrink-0"
                                >
                                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                                    <Image
                                      src="/icons/rectangle-gray.png"
                                      alt={title}
                                      width={200}
                                      height={250}
                                      className="w-full h-full object-cover"
                                    />
                                    <Image
                                      src="/icons/grayheart.png"
                                      alt="찜"
                                      width={20}
                                      height={20}
                                      className="absolute right-2 bottom-2 w-5 h-5"
                                    />
                                  </div>
                                  <div className="pt-2 text-xs font-medium truncate">
                                    {title}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* ▶ 오른쪽 화살표 */}
                  <button
                    onClick={() =>
                      slideIndex < maxSlideIndex &&
                      setSlideIndex(slideIndex + 1)
                    }
                    className="absolute right-[-33px] top-1/2 -translate-y-1/2 z-10 hidden md:block cursor-pointer"
                  >
                    <Image
                      src="/icons/right.png"
                      alt="다음"
                      width={30}
                      height={30}
                    />
                  </button>
                </div>
              </div>

              {/* ❤️ MY 냉장고 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">MY 냉장고</h3>
                  <div className="flex flex-row items-center">
                    <button
                      onClick={() => router.push("/myPage/myFridge")}
                      className="text-sm text-gray-500"
                    >
                      더보기
                    </button>
                    <Image
                      src="/icons/right.png"
                      alt="더보기"
                      width={16}
                      height={16}
                      className="ml-1 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex gap-6 justify-center">
                  {myFridgeContents.map((title, i) => (
                    <div key={i} className="w-[140px]">
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src="/icons/rectangle-gray.png"
                          className="w-full h-full object-cover cursor-pointer"
                          alt={title}
                          width={200}
                          height={250}
                        />
                        <Image
                          src="/icons/redheart.png"
                          className="absolute right-2 bottom-2 w-4 h-4"
                          alt="찜"
                          width={30}
                          height={30}
                        />
                      </div>
                      <div className="pt-2 text-xs font-medium truncate">
                        {title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 🍩 오른쪽 리포트 */}
            <div>
              <h3 className="text-2xl font-bold mb-10">콘텐츠 소비 리포트</h3>
              <div className="flex flex-col sm:flex-row sm:items-center pl-5">
                <DoughnutChart />
                <ul className="pl-10 text-sm space-y-2 font-semibold whitespace-nowrap">
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded-sm" />
                    <span className="flex-1">Food</span>
                    <span>40%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-sm" />
                    <span className="flex-1">Lifestyle</span>
                    <span>35%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-300 rounded-sm" />
                    <span className="flex-1">Beauty</span>
                    <span>15%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-200 rounded-sm" />
                    <span className="flex-1">Tech</span>
                    <span>7%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-100 rounded-sm" />
                    <span className="flex-1">Fashion</span>
                    <span>3%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* ✏️ 닉네임 변경 모달 */}
      {isNicknameModalOpen && (
        <ChangeNicknameModal onClose={() => setIsNicknameModalOpen(false)} />
      )}

      <Footer />
    </div>
  );
}
