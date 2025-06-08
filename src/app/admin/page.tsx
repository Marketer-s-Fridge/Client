import AdminHeader from "@/components/adminHeader";
import Image from "next/image";
import React from "react";

export default function DashboardPage() {
  return (
    <div className="bg-white">
      <AdminHeader />
      <div className="min-h-screen flex bg-white">
        {/* Sidebar */}
        <aside className="w-60 bg-[#f9f9f9] border-r border-gray-200 py-20 px-4 space-y-10 text-sm">
          <ul className="space-y-9 font-bold">
            <li className="flex items-center gap-3.5">
              <Image
                alt="콘텐츠 업로드"
                src="/icons/admin/upload.png"
                width={30}
                height={30}
                className="w-5 aspect-square"
              ></Image>
              콘텐츠 업로드
            </li>
            <li className="flex items-center gap-3.5">
              <Image
                alt="콘텐츠 관리"
                src="/icons/admin/menu.png"
                width={30}
                height={30}
                className="w-5 aspect-square"
              ></Image>{" "}
              콘텐츠 관리
            </li>
            <li className="flex items-center gap-3.5">
              <Image
                alt="임시 저장 리스트"
                src="/icons/admin/archive.png"
                width={30}
                height={30}
                className="w-5 aspect-square"
              ></Image>{" "}
              임시 저장 리스트
            </li>
            <li className="flex items-center gap-3.5">
              <Image
                alt="업로드 에약"
                src="/icons/admin/clock.png"
                width={30}
                height={30}
                className="w-5 aspect-square"
              ></Image>{" "}
              업로드 예약
            </li>
            <li className="flex items-center gap-3.5">
              <Image
                alt="문의 답변 관리"
                src="/icons/admin/mdi_comment-question-outline.png"
                width={30}
                height={30}
                className="w-5 aspect-square"
              ></Image>
              문의 답변 관리
            </li>
            <li className="flex items-center gap-3.5">
              <Image
                alt="통계 및 분석"
                src="/icons/admin/entypo_bar-graph.png"
                width={30}
                height={30}
                className="w-5 aspect-square"
              ></Image>
              통계 및 분석
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10 bg-white">
          {/* Summary */}

          <div className="grid grid-cols-3 items-center justify-center self-center gap-4 text-center text-lg font-semibold my-20">
            <div>
              게시물 수<div className="text-red-500 text-3xl mt-1">435</div>
            </div>
            <div>
              문의사항
              <div className="text-red-500 text-3xl mt-1">1</div>
            </div>
            <div>
              회원 수<div className="text-red-500 text-3xl mt-1">1,654</div>
            </div>
          </div>

          <div className="bg-gray-200 w-full h-0.5"></div>

          <div className="grid grid-cols-2 gap-10 my-10">
            {/* Recent Uploads */}
            <div>
              <h2 className="text-xl font-bold mb-4">최근 업로드</h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <span className="font-bold">Lifestyle</span> 효과적인
                  의사소통을 위한 비언어적 신호{" "}
                  <span className="float-right">2025.05.16</span>
                </li>
                <li>
                  <span className="font-bold">Food</span> 맛있고 건강한 채식
                  요리 레시피 10가지{" "}
                  <span className="float-right">2025.05.12</span>
                </li>
                <li>
                  <span className="font-bold">Lifestyle</span> 건강한 머리카락을
                  위한 헤어케어 팁{" "}
                  <span className="float-right">2025.05.07</span>
                </li>
                <li>
                  <span className="font-bold">Fashion</span> 패션 스타일링:개인
                  맞춤형 옷차림의 중요성{" "}
                  <span className="float-right">2025.05.05</span>
                </li>
                <li>
                  <span className="font-bold">Lifestyle</span>{" "}
                  마인드풀니스:현대인의 스트레스 해소 비법{" "}
                  <span className="float-right">2025.04.29</span>
                </li>
                <li>
                  <span className="font-bold">Lifestyle</span>{" "}
                  마인드풀니스:현대인의 스트레스 해소 비법{" "}
                  <span className="float-right">2025.04.22</span>
                </li>
              </ul>
            </div>

            {/* Visitor Count */}
            <div>
              <h2 className="text-xl font-bold mb-4">방문자 수</h2>
              <div className="flex gap-4">
                <div className="bg-red-100 p-4 rounded-md text-center w-32">
                  <div className="text-xs mb-1">오늘 방문자 수</div>
                  <div className="text-xl font-bold">12</div>
                </div>
                <div className="bg-red-100 p-4 rounded-md text-center w-32">
                  <div className="text-xs mb-1">이번 달 방문자 수</div>
                  <div className="text-xl font-bold">210</div>
                </div>
                <div className="bg-red-100 p-4 rounded-md text-center w-32">
                  <div className="text-xs mb-1">전체 방문자 수</div>
                  <div className="text-xl font-bold">3,456</div>
                </div>
              </div>
              <div className="mt-6 text-xs text-gray-500">
                2025.05.16 24:00 기준
              </div>
              {/* 그래프는 임의 처리 */}
              <div className="mt-2 w-full h-32 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                [방문자 수 그래프 자리]
              </div>

              <button className="bg-red-500 w-full mt-5 text-white px-6 py-4 rounded-lg text-sm font-semibold">
                홈으로 돌아가기
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
