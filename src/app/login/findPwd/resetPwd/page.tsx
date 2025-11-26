// app/login/findPwd/resetPwd/page.tsx
import ResetPwdPageClient from "./resetPwdPageClient";
type ResetPwdPageProps = {
  searchParams: {
    userId?: string | string[];
    [key: string]: string | string[] | undefined;
  };
};

export default function ResetPwdPage({ searchParams }: ResetPwdPageProps) {
  const rawUserId = searchParams.userId;
  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId ?? "";

  return <ResetPwdPageClient userId={userId} />;
}
