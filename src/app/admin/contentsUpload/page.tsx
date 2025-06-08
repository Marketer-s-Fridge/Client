"use client";

import AdminHeader from "@/components/adminHeader";
import React from "react";
import AdminCategoryBar from "../../../components/admin/adminCategoryBar";

const UploadPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <AdminHeader />

      {/* ✅ 카테고리 바 컴포넌트로 교체 */}
      <AdminCategoryBar title="콘텐츠 업로드" />

      <main className=" mx-auto px-[10%] sm:px-[15%] py-12">
        {/* 콘텐츠 등록 */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* 이미지 업로드 섹션 */}
          {/* 이미지 업로드 섹션 */}
          <div className="flex w-[400px] flex-col">
            <div className="w-full flex justify-center mb-4">
              <img
                src="/images/admin/Category-1.jpg"
                className="w-full aspect-[3/4] rounded object-cover"
                alt="대표 이미지"
              />
            </div>

            {/* 썸네일 리스트 */}
            <div className="w-full flex gap-1">
              {[...Array(6)].map((_, i) => (
                <img
                  key={i}
                  src={`/images/admin/Category-${i + 2}.jpg`}
                  className="w-1/6 aspect-[3/4] rounded object-cover"
                  alt={`썸네일 ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 텍스트 입력 섹션 */}
          <div className="flex-1">
            {/* 제목 */}
            <input
              type="text"
              placeholder="제목"
              className="w-full border-b border-gray-400 focus:outline-none focus:border-black mb-6 pb-1.5 sm:text-2xl placeholder:text-gray-400"
            />

            {/* 부제목 */}
            <input
              type="text"
              placeholder="부제목"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-black mb-6 pb-1.5 sm:text-xl placeholder:text-gray-400"
            />

            <div className="place-self-end text-gray-500 flex flex-row w-[70%] gap-2 mb-6">
              <select className="w-1/2 border border-gray-300 rounded-lg px-1.5 py-2.5">
                <option>카테고리 선택</option>
              </select>
              <select className="w-1/2 border border-gray-300 rounded-lg px-1.5 py-2.5">
                <option>유형 선택</option>
              </select>
            </div>

            <textarea
              placeholder="콘텐츠 내용 작성"
              className="w-full aspect-[4/3] border border-gray-300 rounded p-4 resize-none mb-2"
            />
            <div className="text-right text-sm text-gray-500">0 / 1000</div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-4 mt-10">
          <button className="bg-gray-600 text-white px-6 py-3 rounded">
            이미지 업로드
          </button>
          <button className="border border-gray-400 px-6 py-3 rounded">
            임시 저장
          </button>
          <button className="bg-gray-600 text-white px-6 py-3 rounded">
            업로드 예약
          </button>
          <button className="bg-[#FF4545] text-white px-6 py-3 rounded font-bold">
            업로드
          </button>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
