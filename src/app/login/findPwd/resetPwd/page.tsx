// src/app/login/findPwd/resetPwd/page.tsx
import ResetPwdPageClient from "./resetPwdPageClient";

type ResetPwdPageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function ResetPwdPage({ searchParams }: ResetPwdPageProps) {
  const raw = searchParams?.userId;
  const userId =
    typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  return <ResetPwdPageClient userId={userId} />;
}
