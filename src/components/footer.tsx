// components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="flex flex-col bg-white mt-10 sm:mt-16 md:mt-24 lg:mt-32 xl:mt-37 mb-10">
      <div className="self-stretch bg-white">
        <div className="flex flex-col items-start self-stretch bg-[#FF4545] py-5 sm:py-8 px-[5%] lg:px-[17%]">
          {/* 상단 네비게이션 */}
          <div className="flex flex-wrap text-[11.5px] sm:text-xs gap-5 mb-10 sm:mb-25">
            <span className="text-white font-bold">About us</span>
            <span className="text-white font-bold">카테고리</span>
            <span className="text-white font-bold">문의하기</span>
            <span className="text-white font-bold">마이페이지</span>
          </div>

          {/* 회사 정보 및 타이틀 */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full mb-4 gap-6">
            <span className="text-white text-[11px] sm:text-xs whitespace-pre-line">
              (주)마케터스프리지 대표자
              {"\n"}000-00-00000
              {"\n"}서울특별시 마포구 마포대로
              {"\n"}marketersfridge@co.kr
            </span>
            <span className="font-playfair text-white text-2xl sm:text-3xl md:text-4xl font-bold">
              Marketer’s Fridge
            </span>
          </div>

          {/* 하단 정책 관련 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
            <span className="text-white text-[11px] sm:text-xs">
              © 2025 Company Name. All rights reserved.
            </span>
            <div className="flex flex-wrap text-[10px] sm:text-xs gap-4">
              <span className="text-white ">이용약관</span>
              <span className="text-white ">개인정보처리방침</span>
              <span className="text-white ">서비스 이용 문의</span>
              <span className="text-white ">광고 문의</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
