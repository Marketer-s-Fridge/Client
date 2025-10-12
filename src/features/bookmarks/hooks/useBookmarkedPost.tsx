import { useQuery } from "@tanstack/react-query";
// import { PostResponseDto } from "../types";
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
    queryFn: async () => await fetchPostsByStatus("PUBLISHED"),
    staleTime: 1000 * 60,
  });

  // 북마크 ID와 전체 게시글 매칭
  const bookmarkedPosts = allPosts.filter((post) =>
    bookmarkIds.includes(post.id)
  );

  // 카테고리 필터링
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
