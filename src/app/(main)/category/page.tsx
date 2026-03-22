import Footer from "@/components/footer";
import CategoryClient from "./CategoryClient";
import { fetchPostsByStatusServer } from "@/lib/serverApi";
import type { PostResponseDto } from "@/features/posts/types";

export const revalidate = 60;

export default async function Page() {
  const res = await fetchPostsByStatusServer("PUBLISHED").catch(() => null);
  const initialPosts: PostResponseDto[] = res ?? [];
  const initialError = !res;

  return (
    <div className="w-full bg-white pt-11 md:pt-0">
      <CategoryClient
        initialPosts={initialPosts}
        initialError={initialError}
      />
      <Footer />
    </div>
  );
}
