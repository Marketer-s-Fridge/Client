// src/features/posts/hooks/useRecentBookmarkedPosts.ts
import { useQuery } from "@tanstack/react-query";
import { useBookmarks } from "@/features/bookmarks/hooks/useBookmarks";
import { fetchPostsByStatus } from "@/features/posts/api/postsApi";
import { PostResponseDto } from "@/features/posts/types";

export function useRecentBookmarkedPosts(limit: number = 3) {
  const { bookmarkIds, isLoading: isBookmarkLoading } = useBookmarks();

  const {
    data: allPosts = [],
    isLoading: isPostLoading,
    error,
  } = useQuery<PostResponseDto[]>({
    queryKey: ["posts", "recent-bookmarked"],
    queryFn: async () => await fetchPostsByStatus("PUBLISHED"),
    staleTime: 1000 * 60,
  });

  // 북마크된 게시글만 추출
  const bookmarkedPosts = allPosts.filter((post) =>
    bookmarkIds.includes(post.id)
  );

  // 최신순으로 정렬 (id가 높을수록 최근 게시물이라고 가정)
  const sorted = [...bookmarkedPosts].sort((a, b) => b.id - a.id);

  // 상위 N개만 반환
  const recent = sorted.slice(0, limit);

  return {
    data: recent,
    isLoading: isBookmarkLoading || isPostLoading,
    error,
  };
}
