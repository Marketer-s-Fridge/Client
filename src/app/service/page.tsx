"use client";

import { useEffect, useRef } from "react";
import Header from "@/components/header";
import { useState } from "react";
import Footer from "@/components/footer";
import Image from "next/image";
import CharacterSection from "./charactorSection";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/authFormComponents";
import MobileMenu from "@/components/mobileMenu";
function FadeInSection({
  children,
  delay = 0,
  mode,
}: {
  children: React.ReactNode;
  delay?: number;
  mode?: "translate"; // 선택적으로 "translate" 모드 지원
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (ref.current) {
          if (entry.isIntersecting) {
            ref.current.classList.add(
              mode === "translate" ? "fade-in-visible2" : "fade-in-visible"
            );
          } else {
            ref.current.classList.remove(
              mode === "translate" ? "fade-in-visible2" : "fade-in-visible"
            );
          }
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [mode]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`opacity-0 transition-opacity duration-1000 ${
        mode === "translate" ? "fade-in-section2" : "fade-in-section"
      }`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const problemTexts = [
    "지금 마케팅이 막막한가요?",
    "광고 트렌드가 너무 빨라 따라가기 힘든가요?",
    "브랜드 전략 회의에 인사이트가 필요한가요?",
  ];

  return (
    <main className="min-h-screen bg-white pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 로고 */}
      <section className="flex flex-col items-start pl-6 sm:pl-[10%] lg:pl-[17%] pt-[8%] sm:pt-[6%] lg:pt-[4%]">
        <Image
          alt="서비스 로고"
          src="/icons/service-logo.png"
          width={2500}
          height={674}
          className="w-[80%] sm:w-[65%] lg:w-[60%]"
        />
      </section>

      {/* 캐릭터 */}
      <CharacterSection />

      {/* 카테고리 바 */}
      <section className="flex flex-row relative mt-4">
        <Image
          src="/images/categoryBar2.jpg"
          alt=""
          width={1300}
          height={50}
          className="w-full"
        />
      </section>

      {/* 정보 소개 */}
      <FadeInSection>
        <section className="flex flex-col items-center py-[10%] px-6 sm:px-10 lg:px-20">
          <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl mb-10 text-center leading-relaxed">
            마케터를 위한 정보 큐레이션 플랫폼
          </h1>
          <div className="text-center text-sm sm:text-base lg:text-lg space-y-10">
            {[
              "매일같이 쏟아지는 광고 사례, 소비자 반응, 트렌드 리포트 <br />그 안에서 지금 진짜 필요한 정보를 골라내는 건 쉽지 않은 일이죠",
              "그래서 우리는 마케터의 시선으로 <br />쓸 수 있는 정보만 선별하고 꺼내 쓰기 좋게 보관합니다.",
              "마치 냉장고 안에서 먹고 싶은 음식을 꺼내 먹듯이 <br />이곳에서는 당신이 필요한 순간, 원하는 인사이트만 콕 집어갈 수 있습니다.",
            ].map((text, idx) => (
              <p key={idx} dangerouslySetInnerHTML={{ __html: text }} />
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* 인사이트 설명 */}
      <FadeInSection>
        <section className="flex flex-col items-center py-16 bg-[#F0F0F0] px-6 sm:px-10 lg:px-20">
          <div className="mb-10 text-center">
            <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl mb-4">
              관찰, 분석, 재구성된 마케팅 인사이트 저장소
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              우리는 콘텐츠에 이런 이야기들을 담습니다.
            </p>
          </div>
          <div className="relative w-full flex mt-20 justify-center">
            {/* 종이 + 위에 덮일 요소들 감싸는 부모 */}
            <div className="relative w-full max-w-[300px] ">
              <Image
                src="/images/종이.png"
                alt="콘텐츠 설명"
                width={1059}
                height={501}
                className="w-full  "
              />

              {/* 겹쳐질 이미지들 */}
              <FadeInSection delay={0} mode="translate">
                <div className="absolute  right-[70%] bottom-[300px] w-full max-w-[300px] z-40">
                  <Image
                    src="/images/트렌드리포트.png"
                    alt="트렌드리포트"
                    width={408}
                    height={161}
                    className="object-contain w-full"
                  />
                </div>
              </FadeInSection>

              <FadeInSection delay={600} mode="translate">
                <div className="absolute  left-[70%] bottom-[300px] w-full max-w-[300px] z-40">
                  <Image
                    src="/images/광고사례분석.png"
                    alt="광고사례분석"
                    width={408}
                    height={161}
                    className="object-contain w-full"
                  />
                </div>
              </FadeInSection>

              <FadeInSection delay={1200} mode="translate">
                <div className="absolute right-[70%] bottom-[100px] w-full max-w-[300px] z-40">
                  <Image
                    src="/images/캠페인모음.png"
                    alt="캠페인모음"
                    width={408}
                    height={161}
                    className="object-contain w-full"
                  />
                </div>
              </FadeInSection>

              <FadeInSection delay={1800} mode="translate">
                <div className="absolute left-[70%] bottom-[100px] w-full max-w-[300px] z-40">
                  <Image
                    src="/images/브랜드전략코멘터리.png"
                    alt="브랜드전략코멘터리"
                    width={408}
                    height={161}
                    className="object-contain w-full"
                  />
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* 서비스 소개 배경 */}
      <FadeInSection>
        <div className="relative w-full py-16 px-6 sm:px-10 lg:px-20">
          <Image
            src="/images/service-background!.jpg"
            alt="배경"
            fill
            className="absolute object-cover w-full h-full z-0"
          />
          <div className="relative z-10 text-white text-center flex flex-col items-center">
            <h1 className="font-bold text-xl sm:text-2xl lg:text-4xl mb-10">
              왜 ‘Fridge’ 인가요?
            </h1>
            <div className="text-sm sm:text-base lg:text-lg space-y-6 leading-relaxed">
              <p>
                우리는 정보를 그냥 흘려보내지 않습니다
                <br /> 꺼내 쓰기 좋은 형태로 정리하고 차갑게 보관합니다
              </p>
              <p>
                그래서 오늘은 지나쳤지만
                <br />
                다음 회의에서 문득 생각나면 다시 열어볼 수 있는 곳
              </p>
              <p>
                그래서 <span className="font-bold">Marketer’s Fridge</span>{" "}
                입니다.
              </p>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* 강조 섹션 */}
      <section className="flex flex-col items-center px-6 sm:px-10 lg:px-20 pt-[10%] text-center">
        {problemTexts.map((text, idx) => (
          <FadeInSection key={idx}>
            <h1 className="font-bold text-lg sm:text-xl lg:text-3xl py-[35%] ">
              {text}
            </h1>
          </FadeInSection>
        ))}
        <FadeInSection>
          <h3 className="font-bold text-xs sm:text-base lg:text-lg mt-[40%] mb-[10%] leading-relaxed">
            필요할 때 꺼내보고 꺼낸 정보로 다시 요리할 수 있도록.
            <br />
            <span className="font-playfair text-red-500 font-bold">
              Marketer’s Fridge
            </span>{" "}
            는 마케팅에 진심인 당신을 위한 정보 저장소입니다.
          </h3>
          <SubmitButton
            text="회원가입하고 바로 시작하기"
            onClick={() => router.push("/signUp")}
            className="w-[70%] sm:w-[50%] lg:w-[45%] mb-[15%] rounded-sm"
          />
        </FadeInSection>
      </section>

      <Footer />
    </main>
  );
}
