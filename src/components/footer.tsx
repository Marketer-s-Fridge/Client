// components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="flex flex-col bg-white mt-20">
      <div className="self-stretch bg-white h-[500px]">
        <div className="flex flex-col items-start self-stretch bg-[#FF4545] py-[21px] mt-[167px] mb-[148px]">
          {/* 상단 네비게이션 */}
          <div className="flex items-start mb-[118px] ml-[240px]">
            <span className="text-white text-sm font-bold ml-3 mr-8">
              About us
            </span>
            <span className="text-white text-xs font-bold ml-5 mr-10">
              카테고리
            </span>
            <span className="text-white text-xs font-bold ml-5 mr-10">
              문의하기
            </span>
            <span className="text-white text-xs font-bold mx-5">
              마이페이지
            </span>
          </div>

          {/* 아이콘 */}
          {/* <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SgOCKWkYTi/h04varu5_expires_30_days.png"
            alt="footer icon"
            className="w-[23px] h-[23px] ml-[1527px] object-fill"
          /> */}

          {/* 회사 정보 및 타이틀 */}
          <div className="flex items-center mb-2.5 ml-[245px]">
            <span className="text-white text-xs w-[137px] mr-[560px] whitespace-pre-line">
              (주)마케터스프리지 대표자;
              {"\n"}000-00-00000
              {"\n"}서울특별시 마포구 마포대로
              {"\n"}marketersfridge@co.kr
            </span>
            <span className="font-playfair text-white text-[40px] font-bold">
              Marketer’s Fridge
            </span>
          </div>

          {/* 하단 정책 관련 */}
          <div className="flex items-center ml-[240px]">
            <span className="text-white text-xs mr-[420px]">
              © 2025 Company Name. All rights reserved.
            </span>
            <div className="flex shrink-0 items-start px-[18px]">
              <span className="text-white text-xs ml-[3px] mr-8">이용약관</span>
              <span className="text-white text-xs mb-[1px] mr-[29px]">
                개인정보처리방침
              </span>
              <span className="text-white text-xs ml-[3px] mr-8">
                서비스 이용 문의
              </span>
              <span className="text-white text-xs">광고 문의</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
