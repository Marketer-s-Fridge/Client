import PageShell from "@/components/pageShell";

/**
 * 공개/메인 영역: Header + MobileMenu 공통
 * (AuthPageLayout을 쓰는 화면은 (auth-form) 그룹으로 분리해 이중 헤더 방지)
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
