import "server-only";

import type { PostResponseDto } from "@/features/posts/types";

const VERCEL_ORIGIN = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  VERCEL_ORIGIN ??
  "http://localhost:3000"
).replace(/\/$/, "");

function getOrigin() {
  return API_ORIGIN;
}

const withQuery = (path: string, query?: Record<string, string | number>) => {
  if (!query) return path;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
};

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const origin = await getOrigin();
  const res = await fetch(`${origin}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`HTTP ${res.status} ${path}${text ? `: ${text}` : ""}`);
    (err as any).status = res.status;
    throw err;
  }

  return (await res.json()) as T;
}

export async function fetchPostServer(id: number) {
  return await fetchJson<PostResponseDto>(`/api/posts/${id}`, {
    // 상세 페이지는 자주 바뀌지 않으므로 ISR로 캐시
    next: { revalidate: 60 },
  });
}

export async function fetchPublishedPostsServer(limit?: number) {
  return await fetchJson<PostResponseDto[]>(
    withQuery("/api/posts/published", typeof limit === "number" ? { limit } : undefined),
    {
      next: { revalidate: 60 },
    }
  );
}

export async function fetchEditorPicksServer(limit?: number) {
  return await fetchJson<PostResponseDto[]>(
    withQuery("/api/posts/editor-picks", typeof limit === "number" ? { limit } : undefined),
    {
      next: { revalidate: 60 },
    }
  );
}

export async function fetchHotPostsServer(limit?: number) {
  return await fetchJson<PostResponseDto[]>(
    withQuery("/api/posts/hot", typeof limit === "number" ? { limit } : undefined),
    {
      next: { revalidate: 60 },
    }
  );
}

export async function fetchPostsByStatusServer(status: string) {
  return await fetchJson<PostResponseDto[]>(
    withQuery("/api/posts/by-status", { postStatus: status }),
    {
      next: { revalidate: 60 },
    }
  );
}
