"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import DoughnutChart from "@/components/doughnutChart";
import ChangeNicknameModal from "@/components/changeNicknameModal";
import Image from "next/image";
import Footer from "@/components/footer";
import MobileMenu from "@/components/mobileMenu";
import BaseModal from "@/components/baseModal";
import LoginRequiredModal from "@/components/loginRequiredModal";
import { useRecentBookmarkedPosts } from "@/features/bookmarks/hooks/useRecentBookmarksPost";
import { useBookmarks } from "@/features/bookmarks/hooks/useBookmarks";
import { useAuthStatus } from "@/features/auth/hooks/useAuthStatus";

export default function MyPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthStatus();

  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileReportView, setMobileReportView] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // 데이터 훅 (기존 시그니처 유지)
  const { data: myFridgeContents = [], isLoading: isFridgeLoading } =
    useRecentBookmarkedPosts(3);
  const {
    bookmarkIds,
    toggleBookmarkMutate,
    isLoading: isBookmarkLoading,
  } = useBookmarks();

  // 비로그인 진입 시 모달
  // 모달은 "인증 검사 완료" 이후에만 판정
  useEffect(() => {
    const checked = !isLoading; // 토큰 없으면 곧바로 false → checked = true
    if (checked && !isAuthenticated) setIsLoginModalOpen(true);
  }, [isLoading, isAuthenticated]);

  const recentlyViewedContents = [
    { id: 101, title: "KOREADB 2025 뉴 컬렉션" },
    { id: 102, title: "기능성과 스타일의 완벽 조화" },
    { id: 103, title: "환경을 생각한 지속 가능한 브랜드" },
    { id: 104, title: "셀럽들의 공항 패션 스타일" },
    { id: 105, title: "에센셜 드레스 스타일링" },
    { id: 106, title: "재테크 가이드" },
  ];

  const tempcontents = [
    "KOREADB 2025 뉴 컬렉션",
    "기능성과 스타일의 완벽 조화",
    "환경을 생각한 지속 가능한 브랜드",
  ];

  const cardsPerPage = 3;
  const maxSlideIndex =
    Math.ceil(recentlyViewedContents.length / cardsPerPage) - 1;

  const handleToggleBookmark = (postId: number, isSaved: boolean) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    toggleBookmarkMutate(postId, {
      onSuccess: () => {
        if (!isSaved) {
          setIsSuccessModalOpen(true);
          setTimeout(() => setIsSuccessModalOpen(false), 1000);
        }
      },
    });
  };

  // 로딩 스켈레톤(간단)
  if (isLoading) {
    return (
      <div className="bg-white pt-11 md:pt-0">
        <Header menuOpen={false} setMenuOpen={() => {}} />
        <section className="py-10 px-[5%] lg:px-[17%]">
          <div className="h-6 w-40 bg-gray-100 animate-pulse rounded mb-2" />
          <div className="h-4 w-60 bg-gray-100 animate-pulse rounded" />
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 🔒 로그인 유도 모달 */}
      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        message="로그인 후 MY 페이지를 자유롭게 이용해보세요"
        buttonText="로그인"
        redirectPath="/login"
      />

      {/* ✅ 저장 완료 모달 */}
      <BaseModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      >
        <div className="flex flex-col items-center justify-center py-1.5 px-3">
          <p className="text-medium font-medium text-gray-700 text-center">
            <strong className="text-lg font-semibold">저장 완료!</strong>
            <br />
            MY 냉장고에서 확인해보세요 🧊
          </p>
        </div>
      </BaseModal>

      {/* 👤 프로필 영역 */}
      <section className="flex py-5 md:py-10 px-[5%] lg:px-[17%] main-red text-white w-full">
        <div className="w-full flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center w-1/2 gap-[5%] sm:gap-[10%]">
            <Image
              src="/images/profile-character.png"
              alt="프로필"
              className="w-[35%] sm:w-[40%] h-auto"
              width={230}
              height={230}
            />
            <div className="w-full flex flex-col items-center md:items-start">
              <h2 className="text-medium sm:text-3xl font-bold">
                {user?.nickname || user?.name || "비회원"}
              </h2>
              <p className="text-xs sm:text-sm">{user?.email || "로그인이 필요합니다"}</p>
              {isAuthenticated && (
                <button
                  onClick={() => setIsNicknameModalOpen(true)}
                  className="cursor-pointer w-9/13 mt-2 border border-white rounded-full text-xs px-4 py-1 sm:text-sm"
                >
                  프로필 편집
                </button>
              )}
            </div>
          </div>

          <div className="mt-10 md:mt-0 flex w-full md:w-[50%] text-sm sm:text-lg md:text-2xl font-semibold justify-between">
            <div className="flex flex-1 md:gap-30 gap-5 md:justify-end">
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
            <button
              className="block md:hidden"
              onClick={() => setMobileReportView((v) => !v)}
            >
              {mobileReportView ? "콘텐츠 목록 보기" : "콘텐츠 소비 리포트"}
            </button>
          </div>
        </div>
      </section>

      {/* ===================== */}
      {/* 모바일 전용 뷰 */}
      {/* ===================== */}
      <section className="md:hidden max-w-[1024px] mx-auto px-6 py-8 space-y-12">
        {!mobileReportView ? (
          <>
            {/* 모바일: 최근 본 콘텐츠 */}
            <div>
              <h3 className="text-2xl font-bold mb-4">최근 본 콘텐츠</h3>
              <div className="flex overflow-x-auto gap-4 no-scrollbar snap-x snap-mandatory">
                {recentlyViewedContents.map((item) => {
                  const isSaved = bookmarkIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex-shrink-0 w-[35vw] snap-start"
                    >
                      <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src="/icons/rectangle-gray.png"
                          alt={item.title}
                          width={300}
                          height={350}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="pt-2 px-1 text-sm font-semibold flex items-center justify-between">
                        <span className="truncate pr-2 flex-1">
                          {item.title}
                        </span>
                        <button
                          onClick={() => handleToggleBookmark(item.id, isSaved)}
                          disabled={isBookmarkLoading || !isAuthenticated}
                          aria-disabled={!isAuthenticated}
                        >
                          <Image
                            src={
                              isSaved
                                ? "/icons/redheart.png"
                                : "/icons/grayheart.png"
                            }
                            alt="찜"
                            width={20}
                            height={20}
                            className={`w-4.5 h-5 transition-transform ${
                              isSaved
                                ? "scale-105"
                                : "opacity-30 grayscale scale-100"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 모바일: MY 냉장고 */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">MY 냉장고</h3>
                <button
                  onClick={() => router.push("/myPage/myFridge")}
                  className="cursor-pointer text-sm text-gray-500 flex items-center"
                >
                  더보기
                  <Image
                    src="/icons/right.png"
                    alt="더보기"
                    width={16}
                    height={16}
                    className="ml-1"
                  />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {isFridgeLoading ? (
                  <p className="text-gray-400 text-sm">불러오는 중...</p>
                ) : myFridgeContents.length === 0 ? (
                  <p className="text-gray-400 text-sm">
                    담은 콘텐츠가 없습니다
                  </p>
                ) : (
                  myFridgeContents.map((post) => (
                    <div key={post.id} className="w-full md:w-[140px]">
                      <div className="relative aspect-[3/4] rounded-lg bg-gray-100 overflow-hidden">
                        <Image
                          src={post.images?.[0] || "/icons/rectangle-gray.png"}
                          alt={post.title}
                          width={200}
                          height={250}
                          className="w-full h-full object-cover"
                        />
                        <Image
                          src="/icons/redheart.png"
                          alt="찜"
                          width={30}
                          height={30}
                          className="absolute right-2 bottom-2 w-4 h-4"
                        />
                      </div>
                      <div className="pt-2 text-sm font-semibold truncate">
                        {post.title}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 모바일: 콘텐츠 소비 리포트 */}
            <div>
              <h3 className="text-2xl font-bold mb-4">콘텐츠 소비 리포트</h3>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <DoughnutChart />
                <ul className="md:pl-6 text-sm space-y-2 font-semibold mt-4">
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

            {/* 모바일: 추천 콘텐츠 */}
            <div>
              <h3 className="text-2xl font-bold mb-4">
                마케터님에게 딱 맞는 추천 콘텐츠
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {tempcontents.map((title, i) => (
                  <div key={i} className="w-full">
                    <div className="relative aspect-[3/4] rounded-lg bg-gray-100 overflow-hidden">
                      <Image
                        src="/icons/rectangle-gray.png"
                        alt={title}
                        width={200}
                        height={250}
                        className="w-full h-full object-cover"
                      />
                      <Image
                        src="/icons/redheart.png"
                        alt="찜"
                        width={30}
                        height={30}
                        className="absolute right-2 bottom-2 w-4 h-4"
                      />
                    </div>
                    <div className="pt-2 text-sm font-semibold truncate">
                      {title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      {/* ===================== */}
      {/* 데스크탑/태블릿 뷰 */}
      {/* ===================== */}
      <section className="hidden md:grid max-w-[1024px] mx-auto px-6 py-8 md:py-18 grid-cols-2 gap-16">
        {/* 1️⃣ 최근 본 콘텐츠 (데스크탑 슬라이드) */}
        <div className="w-full">
          <h3 className="text-2xl font-bold mb-4">최근 본 콘텐츠</h3>
          <div className="relative w-full">
            <button
              onClick={() => slideIndex > 0 && setSlideIndex(slideIndex - 1)}
              className="cursor-pointer absolute left-[-33px] top-1/2 -translate-y-1/2 z-10"
            >
              <Image src="/icons/left.png" alt="이전" width={30} height={30} />
            </button>
            <div className="overflow-hidden w-full mx-auto">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${slideIndex * 480}px)`,
                  width: `${(maxSlideIndex + 1) * 480}px`,
                }}
              >
                {Array.from({ length: maxSlideIndex + 1 }).map(
                  (_, pageIndex) => (
                    <div
                      key={pageIndex}
                      className="flex gap-4 w-[480px] flex-shrink-0 justify-start"
                    >
                      {recentlyViewedContents
                        .slice(
                          pageIndex * cardsPerPage,
                          pageIndex * cardsPerPage + cardsPerPage
                        )
                        .map((item) => {
                          const isSaved = bookmarkIds.includes(item.id);
                          return (
                            <div key={item.id} className="w-[140px]">
                              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                  src="/icons/rectangle-gray.png"
                                  alt={item.title}
                                  width={300}
                                  height={350}
                                  className="w-full h-full object-cover cursor-pointer"
                                />
                              </div>
                              <div className="pt-2 px-1 text-sm font-semibold flex items-center justify-between">
                                <span className="truncate pr-2 flex-1">
                                  {item.title}
                                </span>
                                <button
                                  onClick={() =>
                                    handleToggleBookmark(item.id, isSaved)
                                  }
                                  disabled={
                                    isBookmarkLoading || !isAuthenticated
                                  }
                                  aria-disabled={!isAuthenticated}
                                >
                                  <Image
                                    src={
                                      isSaved
                                        ? "/icons/redheart.png"
                                        : "/icons/grayheart.png"
                                    }
                                    alt="찜"
                                    width={20}
                                    height={20}
                                    className={`cursor-pointer w-4.5 h-5 transition-transform ${
                                      isSaved
                                        ? "scale-105"
                                        : "opacity-30 grayscale scale-100"
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )
                )}
              </div>
            </div>
            <button
              onClick={() =>
                slideIndex < maxSlideIndex && setSlideIndex(slideIndex + 1)
              }
              className="cursor-pointer absolute right-[-33px] top-1/2 -translate-y-1/2 z-10"
            >
              <Image src="/icons/right.png" alt="다음" width={30} height={30} />
            </button>
          </div>
        </div>

        {/* 2️⃣ 콘텐츠 소비 리포트 */}
        <div>
          <h3 className="text-2xl font-bold mb-4">콘텐츠 소비 리포트</h3>
          <div className="flex flex-col sm:flex-row sm:items-center ">
            <DoughnutChart />
            <ul className="md:pl-6 text-sm space-y-2 font-semibold">
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

        {/* 3️⃣ MY 냉장고 */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">MY 냉장고</h3>
            <button
              onClick={() => router.push("/myPage/myFridge")}
              className="cursor-pointer text-sm text-gray-500 flex items-center"
            >
              더보기
              <Image
                src="/icons/right.png"
                alt="더보기"
                width={16}
                height={16}
                className="ml-1"
              />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {isFridgeLoading ? (
              <p className="text-gray-400 text-sm">불러오는 중...</p>
            ) : myFridgeContents.length === 0 ? (
              <p className="text-gray-400 text-sm">담은 콘텐츠가 없습니다</p>
            ) : (
              myFridgeContents.map((post) => (
                <div key={post.id} className="w-full">
                  <div className="relative aspect-[3/4] rounded-lg bg-gray-100 overflow-hidden">
                    <Image
                      src={post.images?.[0] || "/icons/rectangle-gray.png"}
                      alt={post.title}
                      width={200}
                      height={250}
                      className="w-full h-full object-cover"
                    />
                    <Image
                      src="/icons/redheart.png"
                      alt="찜"
                      width={30}
                      height={30}
                      className="absolute right-2 bottom-2 w-4 h-4"
                    />
                  </div>
                  <div className="pt-2 text-sm font-semibold truncate">
                    {post.title}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4️⃣ 추천 콘텐츠 */}
        <div>
          <h3 className="text-2xl font-bold mb-4">
            마케터님에게 딱 맞는 추천 콘텐츠
          </h3>
          <div className="grid grid-cols-2 gap-4 md:flex md:gap-4 md:justify-center">
            {tempcontents.map((title, i) => (
              <div key={i} className="w-full md:w-[140px]">
                <div className="relative aspect-[3/4] rounded-lg bg-gray-100 overflow-hidden">
                  <Image
                    src="/icons/rectangle-gray.png"
                    alt={title}
                    width={200}
                    height={250}
                    className="w-full h-full object-cover"
                  />
                  <Image
                    src="/icons/redheart.png"
                    alt="찜"
                    width={30}
                    height={30}
                    className="absolute right-2 bottom-2 w-4 h-4"
                  />
                </div>
                <div className="pt-2 text-sm font-semibold truncate">
                  {title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 닉네임 변경 모달 */}
      {isNicknameModalOpen && (
        <ChangeNicknameModal onClose={() => setIsNicknameModalOpen(false)} />
      )}
      <Footer />
    </div>
  );
}
