// src/features/posts/hooks/useBookmarkedPosts.ts
import { useQuery } from "@tanstack/react-query";
import { useBookmarks } from "@/features/bookmarks/hooks/useBookmarks";
import { fetchPostsByStatus } from "@/features/posts/api/postsApi";
import { PostResponseDto } from "@/features/posts/types";
import { isLoggedIn } from "@/utils/isLoggedIn";

export function useBookmarkedPosts(selectedCategory: string | null) {
  const loggedIn = isLoggedIn();
  const { bookmarkIds, isLoading: isBookmarkLoading } = useBookmarks();

  const {
    data: allPosts = [],
    isLoading: isPostLoading,
    error,
  } = useQuery<PostResponseDto[]>({
    queryKey: ["posts", selectedCategory],
    queryFn: () => fetchPostsByStatus("PUBLISHED"),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: loggedIn, // 🔥 로그인 안 되어 있으면 게시글 조회도 안 함
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
