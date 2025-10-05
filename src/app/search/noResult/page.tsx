import { Suspense } from "react";
import NoResultClient from "./noResultClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-20">로딩 중...</div>}>
      <NoResultClient />
    </Suspense>
  );
}
