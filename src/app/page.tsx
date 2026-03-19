import type { PostResponseDto } from "@/features/posts/types";
import HomeClient from "./home/HomeClient";
import {
  fetchEditorPicksServer,
  fetchHotPostsServer,
  fetchPostsByStatusServer,
} from "@/lib/serverApi";

export const revalidate = 60;

type SimplePost = {
  id: number;
  title: string;
  images?: string[];
};

const toSimplePosts = (posts: PostResponseDto[]): SimplePost[] =>
  posts.map((post) => ({
    id: post.id,
    title: post.title,
    images: post.images ?? [],
  }));

export default async function Page() {
  const [hotRes, pickRes, publishedRes] = await Promise.allSettled([
    fetchHotPostsServer(8),
    fetchEditorPicksServer(8),
    fetchPostsByStatusServer("PUBLISHED"),
  ]);

  const hotPosts = hotRes.status === "fulfilled" ? hotRes.value : [];
  const editorPicks = pickRes.status === "fulfilled" ? pickRes.value : [];
  const latestPosts =
    publishedRes.status === "fulfilled"
      ? toSimplePosts(publishedRes.value)
      : [];

  return (
    <HomeClient
      hotPosts={hotPosts}
      editorPicks={editorPicks}
      latestPosts={latestPosts}
    />
  );
}
