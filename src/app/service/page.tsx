"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/authFormComponents";
import MobileMenu from "@/components/mobileMenu";
import { motion } from "framer-motion";

import InfiniteSwipeCarousel from "./infiniteSwipeCarousel";
import MobileSectionPager from "./mobileSectionPager";
import CharacterSlideOverlay, { type Slide } from "./characterSlideOverlay";
import CharacterSlider from "./characterSlide";
// import CharacterSlideOverlay from "./characterHandSection";

// ✅ 파일명/시그니처 유지: 고정 오버레이
// import CharacterSlideOverlay, { type Slide } from "./characterSlideOverlay";

/** 유틸: 데스크톱 체크 */
function useIsDesktop(minWidth = 768) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(min-width:${minWidth}px)`);
    const on = () => setOk(mql.matches);
    on();
    mql.addEventListener?.("change", on);
    return () => mql.removeEventListener?.("change", on);
  }, [minWidth]);
  return ok;
}

/** 캐릭터 슬라이드 데이터 */
const SLIDES: Slide[] = [
  {
    name: "메인",
    image: "/icons/character/fridge.png",
    bg: "#f9f9f9",
    cam: { x: 25, y: 45, scale: 0.3 },
  },
  { name: "수박", bg: "#f9f9f9", cam: { x: -17, y: 3, scale: 1.15 } },
  { name: "딸기", bg: "#f9f9f9", cam: { x: 36, y: 32, scale: 1.15 } },
  { name: "체리", bg: "#f9f9f9", cam: { x: -20, y: 63, scale: 1.15 } },
  { name: "사과", bg: "#f9f9f9", cam: { x: 55, y: 63, scale: 1.15 } },
  { name: "토마토", bg: "#f9f9f9", cam: { x: -5, y: 97, scale: 1.15 } },
];

function FadeInSection({
  children,
  delay = 0,
  mode,
}: {
  children: React.ReactNode;
  delay?: number;
  mode?: "translate";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!ref.current) return;
        if (entry.isIntersecting) {
          ref.current.classList.add(
            mode === "translate" ? "fade-in-visible2" : "fade-in-visible"
          );
        } else {
          ref.current.classList.remove(
            mode === "translate" ? "fade-in-visible2" : "fade-in-visible"
          );
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
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

export default function Page() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const isDesktop = useIsDesktop();

  /** ⛳️ 오버레이 트리거 제어 */
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayTriggered = useRef(false); // 최초 1회 트리거 방지
  const sentinelRef = useRef<HTMLDivElement>(null);
  const afterOverlayRef = useRef<HTMLDivElement>(null);

  // 스크롤로 내려오다 센티넬에 "아래에서 위로" 닿을 때 오버레이 띄우기
  useEffect(() => {
    if (!isDesktop) return; // 데스크톱에서만
    const el = sentinelRef.current;
    if (!el) return;

    let prevY = 0;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        const y = e.boundingClientRect.y;
        const scrollingDown = y < prevY; // 내려오는 중
        prevY = y;

        if (!overlayTriggered.current && e.isIntersecting && scrollingDown) {
          overlayTriggered.current = true;
          setShowOverlay(true); // → 오버레이 mount: y:100% → 0%로 올라옴
          // 덮는 느낌 강화를 위해 트리거 지점으로 스냅
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      },
      { threshold: 0.6 } // 60% 보일 때 트리거
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isDesktop]);

  // 오버레이가 위로 퇴장 완료 후, 다음 섹션으로 착지
  const handleOverlayExit = () => {
    setShowOverlay(false); // 언마운트 (시각적으로는 위로 빠져나간 상태)
    const next = afterOverlayRef.current;
    if (next) next.scrollIntoView({ behavior: "auto", block: "start" });
  };

  const problemTexts = [
    "지금 마케팅이 막막한가요?",
    "광고 트렌드가 너무 빨라 따라가기 힘든가요?",
    "브랜드 전략 회의에 인사이트가 필요한가요?",
  ];

  const characters = [
    {
      id: "melo",
      name: "멜로는 항상 진심을 다해 먹어요",
      tags: ["#해안의", "#수두르반카페", "#아시아이트", "#푸피"],
      imageUri: "/icons/character/melo-card.png",
      description: `배달앱 VIP, 동네 맛집 리스트를 엑셀로 정리해두는 철저함

인스타 릴스에 매일 식사 기록 올리는 ‘푸드로그 인플루언서’
(종종 맛집 협찬도 들어온다.)

먹는 게 곧 힐링이고, 사람들과 함께 나누는 게 또 다른 기쁨!

친구들이 오늘 뭐 먹을지 고민될 땐 멜로한테 물어봅니다

식단, 디저트, 야식까지 다 코치해주는 푸드 라이프 컨설턴트
\u200B`,
    },
    {
      id: "berry",
      name: "베리는 새벽 독서가 제일 좋아요",
      tags: ["#공원산책", "#브런치", "#느린산책"],
      imageUri: "/icons/character/berry-card.png",
      description: `사람이 많은 곳은 부담스러워 혼자 인센스 스틱을 피우고선 
      유튜브에서 잔잔한 플레이리스트를 고르는 것에 집중해요

라이프스타일 편집숍과 도쿄 감성 여행 브이로그를 좋아해요

인스타그램 감성이 물씬 풍기는 사진을 아주 잘 찍어서 
친구들이 감성 브이로그를 찍어보라고 칭찬합니다
\u200B
\u200B`,
    },
    {
      id: "seri_lio",
      name: "뷰티 인플루언서 세리 & 그루밍남 리오",
      tags: ["#뷰티남성", "#뷰티리뷰", "#코덕", "#뷰티팁"],
      imageUri: "/icons/character/seri-rio-card.png",
      description: `세리는 뷰티 제품 리뷰가 주력 콘텐츠에요
신상 쿠션이나 틴트는 무조건 사용한답니다.

뷰티 브랜드들이 선물로 보내준 뜯지도 못한 화장품이 한가득

리오는 누나 덕분에 자연스럽게 화장품에 눈떠
친구들에게 제품 추천해주는 걸 즐기는 끼쟁이랍니다

둘은 항상 각종 뷰티 팝업, 콜라보 행사에 출석!
트렌디함과 정보력으로 뷰티 업계 동향을 꿰고 있답니다!`,
    },
    {
      id: "max",
      name: "맥스는 테크기기 리뷰 블로그 운영자에요",
      tags: ["#리뷰크리에이터", "#성능측정", "#주방가전"],
      imageUri: "/icons/character/max-card.png",
      description: `일상부터 운동 루틴까지 자기 삶을 자동화한 시스템 덕후

매주 신제품 기능을 노션에 정리해 써두고
어떤 제품을 언제 어디서 어떻게 사는게 이득인지 알려줘요

테크 브랜드 언팩 행사에 참여해 누구보다 빠르게 리뷰해요
\u200B
\u200B
\u200B`,
    },
    {
      id: "tomi",
      name: `토미는 매일 아침 미니 
    패션쇼를 열어요`,
      tags: ["#루틴일기", "#OOTD", "#코디추천", "#오늘의패션"],
      imageUri: "/icons/character/tommy-card.png",
      description: `옷장 앞에서 미니 패션쇼를 여는 것으로 하루를 시작해요

홍대 셀렉샵부터 디자이너 브랜드까지 모르는게 없어요

직접 올리는 룩북 일기나 OOTD는 조회수 1만은 거뜬해요

양말, 키링, 소품 하나하나 신경 쓰는 까칠한 패셔니스타!
\u200B
\u200B
\u200B`,
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-white pt-11 md:pt-0">
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* 로고 */}
        <section className="hidden md:flex flex-col items-start pl-6 md:pb-[0%] sm:pl-[10%] lg:pl-[17%] pt-[8%] sm:pt-[6%] lg:pt-[4%]">
          <Image
            alt="서비스 로고"
            src="/icons/service-logo.png"
            width={2500}
            height={674}
            className="w-[80%] sm:w-[65%] lg:w-[60%]"
          />
        </section>

        {/* 정보 소개 */}
        <FadeInSection>
          <section className="hidden md:block flex-col items-center py-[10%] px-6 sm:px-10 lg:px-20">
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
          <section className="hidden md:block  flex-col items-center py-16 bg-[#F0F0F0] px-6 sm:px-10 lg:px-20">
            <div className="mb-10 text-center">
              <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl mb-4">
                관찰, 분석, 재구성된 마케팅 인사이트 저장소
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                우리는 콘텐츠에 이런 이야기들을 담습니다.
              </p>
            </div>
            <div className="relative w-full flex mt-20 justify-center">
              <div className="relative w-full max-w-[300px] ">
                <Image
                  src="/images/paper.png"
                  alt="콘텐츠 설명"
                  width={1059}
                  height={501}
                  className="w-full  "
                />

                <FadeInSection delay={0} mode="translate">
                  <div className="absolute  right-[70%] bottom-[300px] w-full max-w-[300px] z-40">
                    <Image
                      src="/images/trend_report.png"
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
                      src="/images/ad_case_analysis.png"
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
                      src="/images/campaign_collection.png"
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
                      src="/images/brand_strategy_commentary.png"
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
          <div className="hidden md:block relative w-full py-16 px-6 sm:px-10 lg:px-20">
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
        <section className="hidden md:flex flex-col items-center px-6 sm:px-10 lg:px-20 pt-[10%] text-center">
          {problemTexts.map((text, idx) => (
            <FadeInSection key={idx}>
              <h1 className="font-bold text-lg sm:text-xl lg:text-3xl py-[30%] ">
                {text}
              </h1>
            </FadeInSection>
          ))}
          <FadeInSection>
            <h3 className=" font-bold text-xs sm:text-base lg:text-lg mt-[40%] mb-[10%] leading-relaxed">
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
              className=" mb-[15%] rounded-sm"
            />
          </FadeInSection>
        </section>

        {/* ⛳️ 오버레이 트리거 지점 (여기 닿으면 아래→위로 덮음) */}
        {/* <section className="hidden md:block h-[10vh]"  >
          <div className="w-full h-full grid place-items-center text-gray-400" />
        </section> */}

        {/* sticky가 아닌 “고정 오버레이” */}
        {true && (
          <CharacterSlideOverlay
            characters={characters} // ← 이 줄만 추가하면 됨!
            vhPages={7}
            // onExit={handleOverlayExit}
            slides={SLIDES}
          />
        )}

        {/* 모바일: 기존 플로우 유지 */}
        <MobileSectionPager offsetTop={0}>
          {/* 1) 로고 + 한줄 소개 */}
          <div className="page-inner safe-pt text-center mt-[-10%]">
            <Image
              alt="서비스 로고"
              src="/icons/service-logo.png"
              width={2500}
              height={674}
              className="w-[80%] max-w-[520px] mx-auto h-auto"
              priority
            />
            <div className="mt-8 space-y-6">
              <h1 className="font-bold text-lg leading-relaxed">
                <span className="text-gray-400 font-normal text-base">
                  Marketer&rsquo;s Fridge
                </span>
                <br />
                마케터를 위한 정보 큐레이션 플랫폼
              </h1>

              <p className="text-sm mb-[0px]">매일같이 쏟아지는</p>

              <div className="flex items-center justify-center gap-2 py-[7px] mb-[0px]">
                <span className="text-sm main-red px-2.5 py-1.5 text-white font-semibold ">
                  광고 사례
                </span>
                <span className="text-sm main-red px-2.5 py-1.5 text-white font-semibold ">
                  소비자 반응
                </span>
                <span className="text-sm main-red px-2.5 py-1.5 text-white font-semibold ">
                  트렌드 리포트
                </span>
              </div>

              <p className="text-sm ">
                그 안에서{" "}
                <span className="font-bold">지금 진짜 필요한 정보</span>를
                골라내는 건 <br />
                쉽지 않은 일이죠
              </p>

              <p className="text-sm">
                그래서 우리는{" "}
                <span className="font-semibold">마케터의 시선</span>으로
                <br />쓸 수 있는 정보만 선별하고
                <br /> 꺼내쓰기 좋게 보관합니다.
              </p>

              <p className="text-sm">
                마치 냉장고 안에서
                <br />
                먹고 싶은 음식을 꺼내 먹듯이
              </p>

              <p className="text-sm">
                이곳에서는 당신이 필요한 순간
                <br /> 원하는{" "}
                <span className="text-red-500 font-semibold">인사이트</span>만
                <span className="font-bold"> 콕!</span> 집어갈 수 있습니다.
              </p>
            </div>
          </div>

          {/* 3) 인사이트 설명(캐러셀) */}
          <div className="page-inner  text-center ">
            <h1 className="font-bold text-lg mb-[-10%] leading-relaxed">
              <span className="text-gray-400 font-normal text-base">
                어떤 인사이트가 필요하신가요?
              </span>
              <br />
              관찰·분석·재구성된 마케팅 인사이트 저장소
            </h1>
            <InfiniteSwipeCarousel />
          </div>

          {/* 4) 서비스 배경 섹션 */}
          <div className="page-inner relative !px-0 text-center">
            <div className="absolute inset-0 -z-10">
              <Image
                src="/images/service-background-mobile.jpg"
                alt="배경"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="px-[5vw] text-white">
              <h1 className="font-bold text-3xl mb-10">왜 ‘Fridge’ 일까요?</h1>
              <div className="text-base space-y-6 leading-relaxed">
                <p>
                  우리는 정보를 그냥 흘려보내지 않습니다
                  <br />
                  꺼내쓰기 좋은 형태로 정리하고 차갑게 보관합니다.
                </p>
                <p>
                  그래서 오늘 지나쳤어도
                  <br />
                  다음 회의에서 문득 생각나면 다시 열어볼 수 있습니다.
                </p>
                <p>
                  그래서 <span className="font-bold">Marketer’s Fridge</span>{" "}
                  입니다.
                </p>
              </div>
            </div>
          </div>

          {/* 5) 문제 제기 */}
          <div className="page-inner text-center">
            <div className="space-y-15">
              {problemTexts.map((t, i) => (
                <h2 key={i} className="font-bold text-base">
                  {t}
                </h2>
              ))}
            </div>
          </div>

          {/* 6) CTA */}
          <div className="page-inner relative text-center">
            <h3 className="font-bold text-base leading-relaxed mb-30">
              필요할 때 꺼내보고
              <br />
              꺼낸 정보로 다시 요리할 수 있도록.
              <br />
              <br />
              <span className="font-playfair text-red-500 font-bold">
                Marketer’s Fridge
              </span>
              는 <br />
              마케팅에 진심인 당신을 위한 정보 저장소입니다.
            </h3>
            <SubmitButton
              text="회원가입하고 바로 시작하기"
              onClick={() => router.push("/signUp")}
              className="mx-auto w-[92%] max-w-[420px] "
            />

            {/* 안내 텍스트 + 아래 화살표 */}
            <div
              className="flex flex-1 w-full absolute place-self-center bottom-[10%]  flex-col items-center"
              aria-hidden="true"
            >
              <p className=" mb-1 text-xs text-gray-500">
                밑으로 더 내려서 캐릭터 구경하기
              </p>
              <div className="flex flex-col items-center gap-1.5">
                <motion.svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <path d="M6 9l6 6 6-6" />
                </motion.svg>
                <motion.svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  className="text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{ y: [0, 6, 0], opacity: [0.4, 0.9, 0.4] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                >
                  <path d="M6 9l6 6 6-6" />
                </motion.svg>
              </div>
            </div>
          </div>

          {/* 7) 캐릭터 소개 초반 (모바일) */}
          <div className="page-inner !max-w-none bg-gray-100">
            <p className="text-red-500 text-6xl font-bold ">Hello!</p>
            <p className="text-red-500 text-6xl font-bold mb-2">We&rsquo;re Family</p>
            <Image
              alt=""
              width="500"
              height="600"
              src="/icons/character/fridge.png"
            ></Image>
          </div>

          {/* 8) 캐릭터 소개 리스트 (모바일) */}
          <div className="page-inner bg-gray-100 mt-[-3%] !max-w-none ">
            <CharacterSlider></CharacterSlider>
          </div>
        </MobileSectionPager>
        <Footer />
      </main>
    </>
  );
}
