// src/features/posts/hooks/useRecentBookmarkedPosts.ts
import { useQuery } from "@tanstack/react-query";
import { useBookmarks } from "@/features/bookmarks/hooks/useBookmarks";
import { fetchPostsByStatus } from "@/features/posts/api/postsApi";
import { PostResponseDto } from "@/features/posts/types";
import { isLoggedIn } from "@/utils/isLoggedIn";

export function useRecentBookmarkedPosts(limit: number = 3) {
  const loggedIn = isLoggedIn();
  const { bookmarkIds, isLoading: isBookmarkLoading } = useBookmarks();

  const {
    data: allPosts = [],
    isLoading: isPostLoading,
    error,
  } = useQuery<PostResponseDto[]>({
    queryKey: ["posts", "recent-bookmarked"],
    queryFn: () => fetchPostsByStatus("PUBLISHED"),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: loggedIn, // 🔥 로그인 안 되어 있으면 호출 X
  });

  if (!loggedIn) {
    return {
      data: [] as PostResponseDto[],
      isLoading: false,
      error: null as unknown as Error | null,
    };
  }

  const bookmarkedPosts = allPosts.filter((post) =>
    bookmarkIds.includes(post.id)
  );

  const sorted = [...bookmarkedPosts].sort((a, b) => b.id - a.id);

  return {
    data: sorted.slice(0, limit),
    isLoading: isBookmarkLoading || isPostLoading,
    error,
  };
}
