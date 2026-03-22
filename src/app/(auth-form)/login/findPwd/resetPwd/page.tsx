// src/app/login/findPwd/resetPwd/page.tsx
import ResetPwdPageClient from "./resetPwdPageClient";

export default async function ResetPwdPage({
  searchParams,
}: {
  // ✅ Next 15가 내부적으로 기대하는 형태: Promise 기반
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  const params = (await searchParams) ?? {};
  const raw = params.userId;
  const userId =
    typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  return <ResetPwdPageClient userId={userId} />;
}
