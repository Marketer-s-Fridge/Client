"use client";
import Header from "@/components/header";
import React, { useState } from "react";

const InquiryDetailPage: React.FC = () => {
  const [input1, onChangeInput1] = useState<string>("");

  return (
    <div className="flex flex-col bg-white">
      <Header />
      <main className="w-full flex justify-center bg-white text-[#1D1D1D] px-4">
        <div className="w-full max-w-[800px] mt-20">
          {/* 날짜 + 상태 */}
          <div className="flex justify-between">
            <span className="text-base">2025-05-02</span>
            <span className="text-base">[미답변]</span>
          </div>

          <div className="w-full h-[2px] bg-[#b1b1b1] mt-2 mb-6" />

          {/* 제목 */}
          <div className="flex items-center mb-6">
            <label className="w-20 text-balance font-bold">제목</label>
            <p className="flex-1 border border-[#C6C6C6] rounded-lg px-4 py-3 font-bold text-base bg-transparent">
              카드뉴스 이미지 깨짐 현상 문의드립니다.
            </p>
          </div>

          {/* 내용 */}
          <div className="flex mb-6">
            <label className="w-20 text-balance font-bold">내용</label>
            <div className="flex-1 border border-[#C6C6C6] rounded-lg px-4 pt-4 pb-32">
              <p className="whitespace-pre-line text-sm leading-relaxed">
                안녕하세요, 마케팅 인사이트 콘텐츠를 자주 참고하고 있는
                사용자입니다. 최근 업로드된 카드뉴스 중 일부 콘텐츠에서 이미지
                해상도가 낮게 표시되거나, 글자가 흐릿하게 보여 읽기가 어려운
                경우가 있어 문의드립니다. 특히 모바일에서 확인할 때 품질 저하가
                더 두드러지는 것 같으며, 일부 카드에서는 이미지가 잘려서
                보이기도 합니다. 혹시 콘텐츠 업로드 시 자동으로 이미지가
                압축되거나, 표시 방식에 문제가 있는 것인지 궁금합니다. 콘텐츠를
                보다 쾌적하게 열람할 수 있도록 확인 부탁드리며, 개선 가능 여부도
                함께 안내해주시면 감사하겠습니다. 좋은 콘텐츠 항상 감사드립니다.
              </p>
            </div>
          </div>

          {/* 파일 */}
          <div className="flex items-center mb-6">
            <label className="w-20 text-balance font-bold">파일</label>
            <span className="text-base text-[#8E8E8E]">screenshot.jpg</span>
          </div>

          {/* 돌아가기 버튼 */}
          <div className="flex justify-end mb-15">
            <button className="bg-[#FF4545] text-white px-8 py-2.5 rounded-[30px] text-base font-medium">
              돌아가기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InquiryDetailPage;
