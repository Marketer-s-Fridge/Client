"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import DoughnutChart from "@/components/doughnutChart";
import ChangeNicknameModal from "@/components/changeNicknameModal";

export default function MyPage() {
  const router = useRouter();
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);

  const recentlyViewedContents = [
    "KOREADB 2025 뉴 컬렉션",
    "시간을 초월한 클래식 아이템",
    "포인트 컬러로 완성하는 룩",
    "셀럽들의 공항 패션 스타일",
    "여름을 위한 에센셜 드레스 스타일링",
    "신규 브랜드 탐방: 떠오르는 디자이너들",
    "패션 아이콘들이 선택한 신상템",
    "재테크 초보자를 위한 금융 상식 가이드",
    "재테크를 위한 중요한 원칙과 전략",
  ];

  const myFridgeContents = [
    "셀럽들의 공항 패션 스타일",
    "여름을 위한 에센셜 드레스 스타일링",
    "신규 브랜드 탐방: 떠오르는 디자이너들",
  ];

  const [slideIndex, setSlideIndex] = useState(0);

  const handlePrev = () => {
    if (slideIndex > 0) setSlideIndex(slideIndex - 1);
  };

  const handleNext = () => {
    if (slideIndex < Math.floor(recentlyViewedContents.length / 3)) {
      setSlideIndex(slideIndex + 1);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* 프로필 영역 */}
      <section className="py-10 px-6 md:px-60 main-red text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-7">
          <img
            src="/images/profile-character.png"
            alt="프로필"
            className="w-24 h-24 md:w-38 md:h-38"
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">마케터</h2>
            <p className="text-sm">a123456789@gmail.com</p>
            <button className="cursor-pointer mt-1 border border-white rounded-full text-sm px-4 py-1" onClick={()=>setIsNicknameModalOpen(true)}>
              프로필 편집
            </button>
          </div>
        </div>
        <div className="flex gap-6 md:gap-30 text-xl md:text-2xl font-bold">
          <button
            className="cursor-pointer"
            onClick={() => router.push("/myPage/account/myInfo")}
          >
            계정 관리
          </button>
          <button
            className="cursor-pointer"
            onClick={() => router.push("/myPage/myContact")}
          >
            내 문의 내역
          </button>
        </div>
      </section>

      {/* 콘텐츠 영역 */}
      <section className="px-6 md:px-60 mx-auto py-14 grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20">
        <div className="flex flex-col gap-10">
          {/* 최근 본 콘텐츠 */}
          <div className="relative">
            <h3 className="text-2xl font-bold mb-4">최근 본 콘텐츠</h3>
            <button
              onClick={handlePrev}
              className="absolute left-[-30px] top-[130px] z-10 hidden md:block"
            >
              <img src="/icons/left.png" alt="prev" className="w-6 h-6" />
            </button>
            <div className="flex flex-wrap gap-4">
              {recentlyViewedContents
                .slice(slideIndex * 3, slideIndex * 3 + 3)
                .map((title, i) => (
                  <div key={i} className="w-18/60 flex-shrink-0">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src="/icons/rectangle-gray.png"
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="pt-2 px-1 text-xs font-semibold leading-snug line-clamp-2 flex justify-between items-start gap-1">
                      <p className="w-full">{title}</p>
                      <img
                        src="/icons/grayheart.png"
                        alt="찜"
                        className="w-4 h-4 shrink-0"
                      />
                    </div>
                  </div>
                ))}
            </div>
            <button
              onClick={handleNext}
              className="absolute right-[-30px] top-[130px] z-10 hidden md:block"
            >
              <img src="/icons/right.png" alt="next" className="w-6 h-6" />
            </button>
          </div>

          {/* MY 냉장고 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">MY 냉장고</h3>
              <button className="text-sm text-gray-500 hover:underline">
                더보기 &gt;
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {myFridgeContents.map((title, i) => (
                <div key={i} className="w-18/60 flex-shrink-0">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src="/icons/rectangle-gray.png"
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pt-2 px-1 text-xs font-semibold leading-snug line-clamp-2 flex justify-between items-start gap-1">
                    <p className="w-full">{title}</p>
                    <img
                      src="/icons/grayheart.png"
                      alt="찜하기"
                      className="w-4 h-4 shrink-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 소비 리포트 */}
        <div>
          <h3 className="text-2xl font-bold mb-10">콘텐츠 소비 리포트</h3>
          <div className="flex items-center gap-11">
            <DoughnutChart />
            <ul className="text-sm space-y-2 font-bold">
              <li className="grid grid-cols-[auto_1fr] items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-sm" />
                <div className="flex justify-between w-full text-black gap-6">
                  <span>Food</span>
                  <span>40%</span>
                </div>
              </li>
              <li className="grid grid-cols-[auto_1fr] items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-sm" />
                <div className="flex justify-between w-full text-black gap-6">
                  <span>Lifestyle</span>
                  <span>35%</span>
                </div>
              </li>
              <li className="grid grid-cols-[auto_1fr] items-center gap-2">
                <div className="w-3 h-3 bg-red-300 rounded-sm" />
                <div className="flex justify-between w-full text-black gap-6">
                  <span>Beauty</span>
                  <span>15%</span>
                </div>
              </li>
              <li className="grid grid-cols-[auto_1fr] items-center gap-2">
                <div className="w-3 h-3 bg-red-200 rounded-sm" />
                <div className="flex justify-between w-full text-black gap-6">
                  <span>Tech</span>
                  <span>7%</span>
                </div>
              </li>
              <li className="grid grid-cols-[auto_1fr] items-center gap-2">
                <div className="w-3 h-3 bg-red-100 rounded-sm" />
                <div className="flex justify-between w-full text-black gap-6">
                  <span>Fashion</span>
                  <span>3%</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      {isNicknameModalOpen && (
        <ChangeNicknameModal onClose={() => setIsNicknameModalOpen(false)} />
      )}
    </div>
  );
}
