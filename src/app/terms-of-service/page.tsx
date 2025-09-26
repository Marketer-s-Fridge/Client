"use client";

import Header from "@/components/header";
import { useState } from "react";
import Footer from "@/components/footer";
import MobileMenu from "@/components/mobileMenu";

export default function TermsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white pt-11 md:pt-0 flex flex-col">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 본문 */}
      <section className="flex-1 flex justify-center px-4 sm:px-8 lg:px-20 py-15">
        <div className="w-full max-w-4xl">
          <h1 className="text-xl sm:text-2xl font-bold mb-15 text-black">
            [서비스 이용약관]
          </h1>
          <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-800 leading-relaxed">
            <h2 className="font-semibold mt-6 mb-2">제1조 (목적)</h2>
            <p>
              이 약관은 Marketer’s Fridge가 제공하는 Maeketer’s Fridge
              홈페이지의 이용과 관련하여 회사와 회원 간의 권리, 의무 및
              책임사항, 이용조건 및 절차 등 기본적인 사항을 규정함을
              목적으로 합니다.
            </p>

            <h2 className="font-semibold mt-6 mb-2">제2조 (용어 정의)</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                "서비스"란 회사가 운영하는 웹사이트/앱에서 제공하는 모든 온라인
                서비스를 의미합니다.
              </li>
              <li>
                "회원"이란 본 약관에 동의하고 서비스를 이용하는 자를 말합니다.
              </li>
              <li>
                "아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고
                회사가 승인한 문자·숫자의 조합을 의미합니다.
              </li>
              <li>
                "비밀번호"란 회원이 부여받은 아이디와 일치되는 회원임을 확인하고
                회원의 권익 보호를 위해 회원이 정한 문자와 숫자의 조합을
                말합니다.
              </li>
            </ul>

            <h2 className="font-semibold mt-6 mb-2">제3조 (약관의 효력 및 변경)</h2>
            <p>
              본 약관은 서비스를 통해 온라인으로 공지하거나 이메일 등으로
              통지함으로써 효력을 발생합니다. 회사는 관련 법령을 위배하지 않는
              범위에서 약관을 개정할 수 있으며, 개정 시 사전 공지합니다.
            </p>

            <h2 className="font-semibold mt-6 mb-2">제4조 (이용계약의 체결)</h2>
            <p>
              회원가입은 이용자가 약관에 동의하고, 회사가 정한 절차에 따라
              회원가입을 신청하며 회사가 이를 승낙함으로써 성립됩니다.
            </p>

            <h2 className="font-semibold mt-6 mb-2">제5조 (회원의 의무)</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>타인의 정보 도용</li>
              <li>회사 또는 제3자의 지식재산권 침해</li>
              <li>서비스 운영을 방해하는 행위</li>
              <li>법령 또는 공서양속에 반하는 행위</li>
            </ul>

            <h2 className="font-semibold mt-6 mb-2">제6조 (서비스의 제공 및 변경)</h2>
            <p>회사는 회원에게 다음과 같은 서비스를 제공합니다.</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>콘텐츠 열람</li>
              <li>이용 이력 열람 기능</li>
              <li>시청 기록 저장</li>
              <li>개인화 통계 기반 콘텐츠 분석 기능</li>
            </ul>
            <p>
              회사는 필요 시 서비스의 내용을 변경하거나 추가할 수 있으며, 변경 시
              사전 공지합니다.
            </p>

            <h2 className="font-semibold mt-6 mb-2">제7조 (서비스의 중단)</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>시스템 유지보수</li>
              <li>천재지변 및 불가항력</li>
              <li>기타 회사가 필요하다고 판단하는 경우</li>
            </ul>

            <h2 className="font-semibold mt-6 mb-2">제8조 (계약 해지 및 이용제한)</h2>
            <p>
              회원은 언제든지 탈퇴할 수 있으며, 회사는 회원이 약관을 위반한 경우
              이용을 제한하거나 탈퇴 처리할 수 있습니다.
            </p>

            <h2 className="font-semibold mt-6 mb-2">제9조 (지적재산권)</h2>
            <p>
              서비스에 제공된 콘텐츠에 대한 저작권 및 지식재산권은 회사에 있으며,
              무단 복제 및 사용을 금지합니다.
            </p>

            <h2 className="font-semibold mt-6 mb-2">제10조 (면책조항)</h2>
            <p>
              회사는 천재지변 또는 이에 준하는 불가항력으로 인한 서비스 중단에
              대해 책임지지 않습니다. 회사는 회원의 귀책 사유로 인한 서비스 이용
              장애에 대해 책임지지 않습니다.
            </p>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
