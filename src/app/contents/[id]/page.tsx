import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import CardNewsDetailClient from "./CardNewsDetailClient";
import { fetchPostServer, fetchPublishedPostsServer } from "@/lib/serverApi";

export const revalidate = 60;

const getPost = cache(async (postId: number) => {
  return await fetchPostServer(postId);
});

export async function generateStaticParams() {
  try {
    const rows = await fetchPublishedPostsServer(30);
    return rows.map((p) => ({ id: String(p.id) }));
  } catch {
    // 빌드/프리뷰 환경에서 API 접근이 불가할 수 있으므로 빈 배열 허용
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isFinite(postId)) return {};

  try {
    const post = await getPost(postId);
    const title = post.title ? `${post.title} | Marketer's Fridge` : "Marketer's Fridge";
    const description =
      post.subTitle ??
      "마케터를 위한 카드뉴스 아카이브 콘텐츠";
    const img = post.images?.[0];
    const ogImage = img
      ? img.startsWith("http")
        ? img
        : `https://marketersfridge.co.kr${img}`
      : undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ogImage ? [{ url: ogImage }] : undefined,
      },
    };
  } catch {
    return {};
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isFinite(postId)) {
    notFound();
  }

  try {
    const post = await getPost(postId);
    return <CardNewsDetailClient postId={postId} initialPost={post} />;
  } catch (e: any) {
    if (e?.status === 404) notFound();
    throw e;
  }
}
