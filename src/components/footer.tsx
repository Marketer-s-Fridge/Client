// components/Footer.tsx
import React from "react";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <div className="flex flex-col bg-white mt-10 sm:mt-16 md:mt-24 lg:mt-32 xl:mt-37 mb-10">
      <div className="self-stretch bg-white">
        <div className="flex flex-col items-start self-stretch bg-[#FF4545] py-5 sm:py-8 px-[5%] lg:px-[17%]">
          {/* 상단 네비게이션 */}
          <div className="flex flex-wrap text-[11.5px] sm:text-xs gap-5 mb-10 sm:mb-25">
            <span className="text-white font-bold">Home</span>
            <span className="text-white font-bold">About us</span>
            <span className="text-white font-bold">Category</span>
            <span className="text-white font-bold">Contact Us</span>
            <span className="text-white font-bold">My Page</span>
            <span className="text-white font-bold">Log In | Sign Up</span>
          </div>

          {/* 회사 정보 및 타이틀 */}

          {/* 하단 정책 관련 */}
          <div className="flex  flex-row justify-between items-center w-full gap-4">
            {/* 왼쪽 정책 메뉴 */}
            <div className="flex lg:flex-row justify-between items-start lg:items-center w-full mb-4 gap-6">
              <div className="flex flex-col gap-2 self-center items-start">
                {/* 인스타 링크 */}
                <a
                  href="https://www.instagram.com/marketers_fridge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-row items-center gap-2"
                >
                  <Image
                    src="/icons/insta-bt3.png"
                    width={150}
                    height={150}
                    alt="인스타그램버튼"
                    className="w-6 h-6"
                  />
                  <span className="text-white text-[11px] sm:text-[14px]">
                    marketers_fridge
                  </span>
                </a>

                {/* 메일 주소 */}
                <div className="flex flex-row items-center gap-2">
                  <Image
                    src="/icons/mail-icon2.png" // 아이콘 경로는 실제 프로젝트에 맞게 조정
                    width={150}
                    height={150}
                    alt="메일 아이콘"
                    className="w-6 h-6"
                  />
                  <span className="text-white text-[11px] sm:text-[14px]">
                    marketersfridge@gmail.com
                  </span>
                </div>
              </div>
            </div>

            {/* 오른쪽 로고 텍스트 */}
            <div className="flex flex-col gap-4">
              <span className="font-playfair text-white text-lg sm:text-3xl md:text-4xl font-bold whitespace-nowrap">
                Marketer’s Fridge
              </span>
              <div className="flex flex-row text-[10px] sm:text-xs gap-4 self-end">
                <span className="text-white ">이용약관</span>
                <span className="text-white ">개인정보처리방침</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
