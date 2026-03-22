import Footer from "@/components/footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white pt-11 md:pt-0 flex flex-col">
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
                  "아이디"란 회원 식별 및 서비스 이용을 위해 회원이 설정하고 회사가
                  승인한 문자/숫자의 조합을 말합니다.
                </li>
                <li>
                  "비밀번호"란 회원이 부여받은 아이디와 일치되는 회원임을 확인하고
                  개인정보 보호를 위해 회원이 정한 문자/숫자/기호의 조합을 말합니다.
                </li>
              </ul>

              <h2 className="font-semibold mt-6 mb-2">제3조 (약관의 효력 및 변경)</h2>
              <p>
                회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며,
                변경된 약관은 서비스 내 공지사항에 게시함으로써 효력이 발생합니다.
              </p>

              <h2 className="font-semibold mt-6 mb-2">제4조 (회원가입)</h2>
              <p>
                이용자는 회사가 정한 가입 양식에 따라 회원 정보를 기입한 후
                본 약관에 동의함으로써 회원가입을 신청합니다.
              </p>

              <h2 className="font-semibold mt-6 mb-2">제5조 (서비스 이용)</h2>
              <p>
                회사는 회원에게 본 서비스의 이용을 허가하며, 서비스의 세부
                내용은 서비스 화면에 게시합니다.
              </p>

              <h2 className="font-semibold mt-6 mb-2">제6조 (회원 탈퇴 및 자격 상실)</h2>
              <p>
                회원은 언제든지 서비스 내 탈퇴 절차를 통해 회원 탈퇴를 할 수 있습니다.
                회사는 회원이 본 약관을 위반하거나 관련 법령을 위반한 경우
                회원 자격을 제한 또는 상실시킬 수 있습니다.
              </p>

              <h2 className="font-semibold mt-6 mb-2">제7조 (개인정보 보호)</h2>
              <p>
                회사는 개인정보 보호법 등 관련 법령이 정하는 바에 따라
                이용자의 개인정보를 보호하며, 개인정보처리방침에 따릅니다.
              </p>

              <h2 className="font-semibold mt-6 mb-2">제8조 (면책)</h2>
              <p>
                회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력에 의해
                서비스를 제공할 수 없는 경우 책임을 지지 않습니다.
              </p>
            </article>
          </div>
        </section>

        <Footer />
      </main>
  );
}
