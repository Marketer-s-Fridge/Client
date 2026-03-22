import { Suspense } from "react";
import NoResultClient from "./noResultClient";
import { fetchPostsByStatusServer } from "@/lib/serverApi";
import type { PostResponseDto } from "@/features/posts/types";
import Footer from "@/components/footer";

export const revalidate = 60;

export default async function Page() {
  const res = await fetchPostsByStatusServer("PUBLISHED").catch(() => null);
  const initialPosts: PostResponseDto[] = res ?? [];
  const initialError = !res;

  return (
    <>
      <Suspense fallback={<div className="text-center py-20"></div>}>
        <NoResultClient
          initialPosts={initialPosts}
          initialError={initialError}
        />
      </Suspense>
      <Footer />
    </>
  );
}
