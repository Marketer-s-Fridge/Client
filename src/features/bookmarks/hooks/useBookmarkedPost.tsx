// src/features/posts/hooks/useBookmarkedPosts.ts
import { useQuery } from "@tanstack/react-query";
import { useBookmarks } from "@/features/bookmarks/hooks/useBookmarks";
import { fetchPostsByStatus } from "@/features/posts/api/postsApi";
import { PostResponseDto } from "@/features/posts/types";

export function useBookmarkedPosts(selectedCategory: string | null) {
  const { bookmarkIds, isLoading: isBookmarkLoading } = useBookmarks();

  const {
    data: allPosts = [],
    isLoading: isPostLoading,
    error,
  } = useQuery<PostResponseDto[]>({
    queryKey: ["posts", selectedCategory],
    queryFn: () => fetchPostsByStatus("PUBLISHED"),
    staleTime: 60 * 1000,         // 1분 동안 재요청 X
    gcTime: 5 * 60 * 1000,        // 캐시 5분 보관
    refetchOnWindowFocus: false,  // 탭 이동 시 재요청 X
  });

  const bookmarkedPosts = allPosts.filter((post) =>
    bookmarkIds.includes(post.id)
  );

  const filtered =
    selectedCategory && selectedCategory !== "전체"
      ? bookmarkedPosts.filter((item) =>
          item.title.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      : bookmarkedPosts;

  return {
    data: filtered,
    isLoading: isBookmarkLoading || isPostLoading,
    error,
  };
}
