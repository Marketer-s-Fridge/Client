"use client";

import Header from "@/components/header";
import { useState } from "react";
import Footer from "@/components/footer";
import MobileMenu from "@/components/mobileMenu";

export default function PrivacyPolicyPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white pt-11 md:pt-0 flex flex-col">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 본문 */}
      <section className="flex-1 flex justify-center px-4 sm:px-8 lg:px-20 py-15">
        <div className="w-full max-w-4xl">
          <h1 className="text-xl sm:text-2xl font-bold mb-15 text-black">
            [개인정보처리방침]
          </h1>
          <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-800 leading-relaxed">
            <h2 className="font-semibold mt-6 mb-2">수집하는 개인정보 항목</h2>
            <p>
              회사는 회원가입 및 서비스 제공을 위해 다음 정보를 수집할 수 있습니다.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>필수 항목: 이름, 생년월일, 성별, 이메일 주소, 비밀번호</li>
              <li>선택 항목: 프로필 사진, 닉네임 등</li>
            </ul>

            <h2 className="font-semibold mt-6 mb-2">개인정보 수집 방법</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>회원가입 및 서비스 이용 시 이용자가 직접 입력</li>
              <li>이벤트, 고객센터 문의 과정에서 수집</li>
            </ul>

            <h2 className="font-semibold mt-6 mb-2">개인정보의 이용 목적</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>회원관리: 본인 확인, 회원 식별, 불량회원 방지</li>
              <li>서비스 제공: 콘텐츠 제공, 맞춤형 서비스 제공</li>
              <li>마케팅 활용: 이벤트 안내</li>
            </ul>

            <h2 className="font-semibold mt-6 mb-2">개인정보 보유 및 이용 기간</h2>
            <p>
              회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
              단, 관련 법령에 따라 보관이 필요한 경우 일정 기간 보관할 수 있습니다.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>회원 탈퇴 시 즉시 삭제</li>
              <li>전자상거래 관련 기록: 5년 (전자상거래법 기준)</li>
              <li>소비자 불만 또는 분쟁처리 기록: 3년</li>
            </ul>

            <h2 className="font-semibold mt-6 mb-2">개인정보의 제3자 제공</h2>
            <p>
              회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다.
              단, 다음의 경우는 예외입니다.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>법령에 근거한 요청이 있는 경우</li>
              <li>이용자의 사전 동의를 받은 경우</li>
            </ul>

            <h2 className="font-semibold mt-6 mb-2">개인정보 처리 위탁</h2>
            <p>
              회사는 원활한 서비스 제공을 위해 개인정보를 외부 업체에 위탁할 수 있으며,
              위탁 시 관련 법령에 따라 관리·감독합니다.
            </p>

            <h2 className="font-semibold mt-6 mb-2">이용자 및 법정대리인의 권리</h2>
            <p>
              이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다.
            </p>

            <h2 className="font-semibold mt-6 mb-2">개인정보의 보호조치</h2>
            <p>
              회사는 개인정보의 안전한 처리를 위하여 기술적·관리적 보호조치를 시행하고 있습니다.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>CSRF(Cross-Site Request Forgery) 방지 기능을 적용하여 비정상적인 요청 차단</li>
              <li>비밀번호는 암호화 방식으로 저장</li>
            </ul>

            <h2 className="font-semibold mt-6 mb-2">개인정보 보호책임자</h2>
            <p>
              책임자: 진현진, 이재빈 <br />
              이메일: marketersfridge@gmail.com
            </p>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
