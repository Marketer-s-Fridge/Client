// components/Footer.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <div className="flex flex-col bg-white mt-10 sm:mt-16 md:mt-24 lg:mt-32 xl:mt-37 mb-10">
      <div className="self-stretch bg-white">
        <div className="flex flex-col items-start self-stretch bg-[#FF4545] py-5 sm:py-8 px-[5%] lg:px-[17%]">
          {/* 상단 네비게이션 */}
          <div className="flex flex-wrap text-[11.5px] sm:text-xs gap-5 mb-10 sm:mb-25">
            <Link href="/" className="text-white font-bold hover:underline">
              Home
            </Link>
            <Link
              href="/service"
              className="text-white font-bold hover:underline"
            >
              About us
            </Link>
            <Link
              href="/category"
              className="text-white font-bold hover:underline"
            >
              Category
            </Link>
            <Link
              href="/contact"
              className="text-white font-bold hover:underline"
            >
              Contact Us
            </Link>
            <Link
              href="/myPage"
              className="text-white font-bold hover:underline"
            >
              My Page
            </Link>
            <Link
              href="/login"
              className="text-white font-bold hover:underline"
            >
              Log In | Sign Up
            </Link>
          </div>

          {/* 하단 정책 관련 */}
          <div className="flex flex-row justify-between items-center w-full gap-4">
            {/* 왼쪽 SNS/메일 */}
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
                    src="/icons/mail-icon2.png"
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

            {/* 오른쪽 로고 & 정책 링크 */}
            <div className="flex flex-col gap-4">
              <span className="font-playfair text-white text-lg sm:text-3xl md:text-4xl font-bold whitespace-nowrap">
                Marketer’s Fridge
              </span>
              <div className="flex flex-row text-[10px] sm:text-xs gap-4 self-end">
                <Link
                  href="/terms-of-service"
                  className="text-white hover:underline"
                >
                  이용약관
                </Link>
                <Link
                  href="/privacy-policy"
                  className="text-white hover:underline"
                >
                  개인정보처리방침
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
