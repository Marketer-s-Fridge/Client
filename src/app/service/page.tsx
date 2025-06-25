"use client";

import { useEffect, useRef } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import CharacterSection from "./charactorSection";
import { useRouter } from "next/navigation"; // 추가
import { SubmitButton } from "@/components/authFormComponents";

function FadeInSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (ref.current) {
          if (entry.isIntersecting) {
            ref.current.classList.add("fade-in-visible");
          } else {
            ref.current.classList.remove("fade-in-visible");
          }
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="opacity-0 transition-opacity duration-1000 fade-in-section"
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter(); // 추가

  const insightData = [
    [
      "트렌드 리포트",
      "지금 소비자와 시장은 어디로 가고 있을까요?",
      "핵심만 정리된 인사이트를 간결하게 제공합니다",
    ],
    [
      "광고 사례 분석",
      "주목받는 광고는 왜 다를까요?",
      "광고의 구성과 흐름을 해설합니다",
    ],
    [
      "SNS 캠페인 모음",
      "인스타그램, 틱톡, 유튜브 쇼츠까지",
      "가장 반응 좋았던 콘텐츠들을 맥락과 함께 소개합니다",
    ],
    [
      "브랜드 전략 코멘터리",
      "이 브랜드는 왜 이렇게 말할까?",
      "말투, 타이밍, 비주얼까지 뜯어보며 전략의 뒷면을 짚어드립니다",
    ],
  ];

  const problemTexts = [
    "지금 마케팅이 막막한가요?",
    "광고 트렌드가 너무 빨라 따라가기 힘든가요?",
    "브랜드 전략 회의에 인사이트가 필요한가요?",
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* 로고 */}
      <section className="flex flex-col items-start relative pl-[10%] sm:pl-[17%] pt-[4%]">
        <Image
          alt=""
          src="/icons/service-logo.png"
          width={2500}
          height={674}
          className="w-[60%]"
        />
      </section>

      {/* 캐릭터 */}
      <CharacterSection />

      {/* 카테고리 바 */}
      <Image
        src="/images/categoryBar.jpg"
        alt=""
        width={1300}
        height={50}
        className="w-full"
      />

      {/* 정보 소개 섹션 */}
      <FadeInSection>
        <section className="flex flex-col items-center py-[12%]">
          <h1 className="font-bold text-2xl md:text-4xl mb-[4.5%] text-center">
            마케터를 위한 정보 큐레이션 플랫폼
          </h1>
          <div className="text-center text-sm md:text-lg">
            {[
              "매일같이 쏟아지는 광고 사례, 소비자 반응, 트렌드 리포트 <br />그 안에서 지금 진짜 필요한 정보를 골라내는 건 쉽지 않은 일이죠",
              "그래서 우리는 마케터의 시선으로 <br />쓸 수 있는 정보만 선별하고 꺼내 쓰기 좋게 보관합니다.",
              "마치 냉장고 안에서 먹고 싶은 음식을 꺼내 먹듯이 <br />이곳에서는 당신이 필요한 순간, 원하는 인사이트만 콕 집아갈 수 있습니다.",
            ].map((text, idx) => (
              <p
                className="mb-[10%]"
                key={idx}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* 인사이트 설명 섹션 */}
      <FadeInSection>
        <section className="flex flex-col items-center pb-[18%]">
          <h1 className=" font-bold text-2xl md:text-4xl mb-[4.5%] text-center">
            관찰, 분석, 재구성된 마케팅 인사이트 저장소
          </h1>
          <div className="w-[60%] items-center flex flex-col md:flex-row gap-[5%]">
            <Image
              alt="임시"
              width={300}
              height={400}
              src="/images/cardNews/2/001.png"
              className="flex-1 *:object-contain"
            />
            <div className="flex-1 flex-col justify-between">
              {insightData.map(([title, line1, line2], idx) => (
                <div key={idx} className="mb-[13%]">
                  <h2 className="text-sm md:text-xl font-semibold">{title}</h2>
                  <h3 className="text-xs md:text-lg">
                    {line1}
                    <br />
                    {line2}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <div className="flex flex-1 flex-column relative mb-[12%] py-[3%]">
          <Image
            src="/images/service-background.png"
            alt="배경"
            width={2000}
            height={600}
            className="absolute object-cover top-0 w-full z-0"
          ></Image>
          <div className="flex flex-1 flex-col relative text-center text-xs md:text-base items-center justify-items-center text-white place-self-center ">
            <h1 className="z-2 font-bold text-xl md:text-4xl mb-[3%] md:mb-[4.5%]">
              왜 ‘Fridge’ 인가요?
            </h1>
            <h3 className="mb-[2%] md:mb-[3%] ">
              우리는 정보를 그냥 흘려보내지 않습니다
              <br /> 꺼내 쓰기 좋은 형태로 정리하고 차갑게 보관합니다
            </h3>
            <h3 className="mb-[2%] md:mb-[3%] ">
              그래서 오늘은 지나쳤지만
              <br />
              다음 회의에서 문득 생각나면 다시 열어볼 수 있는 곳
            </h3>
            <h3 className="">그래서 <span className="">'Marketer’s Fridge'</span> 입니다.</h3>
          </div>
        </div>
      </FadeInSection>

      {/* 마지막 강조 섹션 */}
      <section className="flex flex-col items-center pt-[12%] text-center">
        {problemTexts.map((text, idx) => (
          <FadeInSection key={idx}>
            <h1 className={`font-bold text-lg md:text-3xl py-[30%]`}>{text}</h1>
          </FadeInSection>
        ))}
        <FadeInSection>
          <h3 className="font-bold text-base md:text-lg mt-[30%] mb-[5%]">
            필요할 때 꺼내보고 꺼낸 정보로 다시 요리할 수 있도록.
            <br />
            <span className="font-playfair text-red-500 font-bold">
              Marketer’s Fridge
            </span>
            는 마케팅에 진심인 당신을 위한 정보 저장소입니다.
          </h3>
          <SubmitButton
            text="회원가입하고 시작하기"
            onClick={() => router.push("/signUp")}
            className="w-[50%] mb-[20%]"
          ></SubmitButton>
        </FadeInSection>
      </section>

      <Footer />
    </main>
  );
}
