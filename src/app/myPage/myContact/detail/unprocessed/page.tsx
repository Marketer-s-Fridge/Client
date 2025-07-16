"use client";

import Header from "@/components/header";
import React from "react";
import { FiPaperclip } from "react-icons/fi";
import MobileMenu from "@/components/mobileMenu";
import { useState } from "react";

const InquiryDetailPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col bg-white text-[#1D1D1D] pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />{" "}
      <main className="w-full flex justify-center px-4">
        <div className="w-full px-[5%] lg:px-[22.5%] mt-20">
          {/* 문의 카테고리 */}
          <p className="text-lg font-bold mb-2">[ 기술적 문제 ]</p>

          {/* 유저 정보 */}
          <div className="flex items-center gap-3 mb-1 border-gray-600 border-y-1 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-300" />
            <span className="text-sm font-medium">마케터</span>
            <span className="text-sm text-[#8E8E8E]">a123456789@gmail.com</span>
            <span className="ml-auto text-sm">2025-05-02</span>
            <span className="text-sm ">[미답변]</span>
          </div>

          <div className="py-8">
            {/* 제목 */}
            <p className="text-base font-bold mb-6">
              카드뉴스 이미지 깨짐 현상 문의드립니다.
            </p>

            {/* 본문 내용 */}
            <p className=" whitespace-pre-line text-sm leading-relaxed text-[#1D1D1D]">
              안녕하세요, 마케팅 인사이트 콘텐츠를 자주 참고하고 있는
              사용자입니다. 최근 업로드된 카드뉴스 중 일부 콘텐츠에서 이미지
              해상도가 낮게 표시되거나, 글자가 흐릿하게 보여 읽기가 어려운
              경우가 있어 문의드립니다. 특히 모바일에서 확인할 때 품질 저하가 더
              두드러지는 것 같으며, 일부 카드에서는 이미지가 잘려서 보이기도
              합니다. 혹시 콘텐츠 업로드 시 자동으로 이미지가 압축되거나, 표시
              방식에 문제가 있는 것인지 궁금합니다. 콘텐츠를 보다 쾌적하게
              열람할 수 있도록 확인 부탁드리며, 개선 가능 여부도 함께
              안내해주시면 감사하겠습니다. 좋은 콘텐츠 항상 감사드립니다.
            </p>

            {/* 첨부 파일 */}
            <div className="flex items-center gap-1 text-sm text-[#000000] mt-10">
              <span>첨부파일 1개</span>
              <FiPaperclip className="text-gray-500" />
              <span className="text-[#8E8E8E] underline underline-offset-2 cursor-pointer">
                screenshot.jpg
              </span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#4a5565] mb-3" />
        </div>
      </main>
      {/* 버튼 */}
      <div className="flex justify-end w-full px-[5%] lg:px-[22.5%] pt-[3%] pb-[8%]">
        <button className="bg-[#FF4545] text-white px-6 py-1.5 rounded-full text-sm font-medium cursor-pointer">
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default InquiryDetailPage;
