/**
 * AuthPageLayout 등 자체 헤더를 포함하는 폼 전용
 * 부모 (main)의 PageShell을 적용하지 않음
 */
export default function AuthFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
