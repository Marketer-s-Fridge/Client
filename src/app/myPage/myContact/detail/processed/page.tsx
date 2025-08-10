"use client";

import Header from "@/components/header";
import { useState } from "react";
import React from "react";
import { FiPaperclip } from "react-icons/fi";
import MobileMenu from "@/components/mobileMenu";

const InquiryDetailPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col bg-white text-[#1D1D1D] pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />{" "}
      <main className="w-full flex justify-center px-4">
        <div className="w-full px-[5%] lg:px-[22.5%] mt-10 md:mt-20">
          {/* 문의 카테고리 */}
          <p className="text-base md:text-lg font-bold mb-2">[ 기술적 문제 ]</p>

          {/* 유저 정보 */}
          <div className="flex items-center gap-3 mb-1 border-gray-600 border-y-1 py-2">
            <div className="w-4 h-4 md:w-8 md:h-8 rounded-full bg-gray-300" />
            <span className=" text-[10px] md:text-sm font-medium">마케터</span>
            <span className="text-[10px] md:text-sm text-[#8E8E8E]">
              a123456789@gmail.com
            </span>
            <div className="md:hidden flex flex-1 justify-self-end flex-col">
              <span className="text-[10px] md: self-end">[답변완료]</span>
              <span className="ml-auto text-[10px] md:">2025-05-02</span>
            </div>

            <div className="hidden md:flex flex-1 justify-self-end gap-5">
              <span className="ml-auto text-sm">2025-05-02</span>
              <span className="text-sm ">[답변완료]</span>
            </div>
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

          {/* 답변 작성 */}
          <div className="flex flex-row gap-6 mt-10 mb-15">
            <p className="w-1/5 text-base font-bold flex-nowrap">답변</p>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              안녕하세요, 먼저 저희 마케팅 인사이트 콘텐츠를 자주 참고해주시고,
              소중한 의견 보내주셔서 진심으로 감사드립니다. 현재 일부 콘텐츠는
              플랫폼 업로드 시 자동 압축 또는 리사이징 처리로 인해 원본 대비
              해상도가 낮아질 수 있으며, 이로 인해 글자가 뭉개지거나 이미지
              일부가 잘리는 경우가 있을 수 있습니다. 해당 문제는 현재 처리
              완료했으며 앞으로도 더 쾌적하고 읽기 쉬운 콘텐츠를 제공드릴 수
              있도록 지속적으로 확인하고 반영해 나가겠습니다. 불편을 드려
              죄송하며, 앞으로도 많은 관심과 피드백 부탁드립니다. 감사합니다.
              <p className="mt-3 text-xs text-gray-600">2025.05.12</p>
            </p>
          </div>
        </div>
      </main>
      {/* 피드백 */}
      <div className="w-full flex flex-col px-[5%] lg:px-[22.5%] py-[5%] md:py-[2%]  bg-gray-100 gap-4">
        <p className="text-lg md:text-xl font-bold ">답변이 도움이 되셨나요?</p>
        <div className="flex gap-10">
          <label className="flex items-center gap-2 text-medium">
            <input type="radio" name="feedback" />
            도움이 되었어요.
          </label>
          <label className="flex items-center gap-2 text-medium">
            <input type="radio" name="feedback" />
            도움이 되지 않았어요.
          </label>
        </div>
        <button className="w-3/11 md:w-1/11 px-6 bg-white border rounded border-gray-300 text-sm py-0.5 cursor-pointer">
          확인
        </button>
      </div>
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
