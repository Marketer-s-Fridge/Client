import Header from "@/components/header";
import { Suspense } from "react";
import SearchClient from "./searchClient";

export default function Page() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <Suspense fallback={<div className="text-center py-10">로딩 중...</div>}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
