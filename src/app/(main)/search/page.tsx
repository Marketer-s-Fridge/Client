import { Suspense } from "react";
import Footer from "@/components/footer";
import SearchClient from "./searchClient";
import { fetchPostsByStatusServer } from "@/lib/serverApi";
import type { PostResponseDto } from "@/features/posts/types";

export const revalidate = 60;

type Content = {
  id: number;
  title: string;
  subTitle?: string;
  category?: string;
  images: string[];
  publishedAt?: string | null;
  createdAt?: string;
};

const toContent = (posts: PostResponseDto[]): Content[] =>
  posts.map((post) => ({
    id: post.id,
    title: post.title,
    subTitle: post.subTitle,
    category: post.category,
    images: post.images ?? [],
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
  }));

export default async function Page() {
  const res = await fetchPostsByStatusServer("PUBLISHED").catch(() => null);
  const initialPosts = res ? toContent(res) : [];
  const initialError = !res;

  return (
    <div className="bg-white min-h-screen mt-16 md:mt-0">
      <Suspense fallback={<div className="text-center py-10"></div>}>
        <SearchClient
          initialPosts={initialPosts}
          initialError={initialError}
        />
      </Suspense>
      <Footer />
    </div>
  );
}
