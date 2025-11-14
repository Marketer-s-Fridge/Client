// src/features/comments/hooks/useComments.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCommentsByEnquiry,
  createDraftComment,
  updateDraftComment,
  createPublishComment,
  updatePublishComment,
  markEnquiryAsJunk,
  deleteComment,
} from "../api/commentApi";
import { CommentRequestDto, CommentResponseDto } from "../types";

/** ✅ 특정 문의의 댓글 목록 조회 */
export function useComments(enquiryId: number) {
  return useQuery<CommentResponseDto[], Error>({
    queryKey: ["comments", enquiryId],
    queryFn: () => fetchCommentsByEnquiry(enquiryId),
    enabled: !!enquiryId,
    staleTime: 60 * 1000,         // 1분 동안 재요청 X
    gcTime: 5 * 60 * 1000,        // 캐시 5분 보관
    refetchOnWindowFocus: false,  // 탭 포커스 시 자동 재요청 X
    retry: false,
  });
}

/** ✅ 댓글 초안 생성 (POST /api/comments/drafts) */
export function useCreateDraftComment() {
  const queryClient = useQueryClient();

  return useMutation<CommentResponseDto, Error, CommentRequestDto>({
    mutationFn: createDraftComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.enquiryId] });
    },
  });
}

/** ✅ 댓글 초안 수정 (PATCH /api/comments/drafts/{id}) */
export function useUpdateDraftComment() {
  const queryClient = useQueryClient();

  return useMutation<
    CommentResponseDto,
    Error,
    { id: number; dto: CommentRequestDto; etag?: string }
  >({
    mutationFn: ({ id, dto, etag }) => updateDraftComment(id, dto, etag),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.enquiryId] });
    },
  });
}

/** ✅ 댓글 게시 생성 (POST /api/comments/publish) */
export function useCreatePublishComment() {
  const queryClient = useQueryClient();

  return useMutation<CommentResponseDto, Error, CommentRequestDto>({
    mutationFn: createPublishComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.enquiryId] });
    },
  });
}

/** ✅ 댓글 게시 업데이트/갱신 (POST /api/comments/publish/{id}) */
export function useUpdatePublishComment() {
  const queryClient = useQueryClient();

  return useMutation<
    CommentResponseDto,
    Error,
    { id: number; dto: CommentRequestDto; etag?: string }
  >({
    mutationFn: ({ id, dto, etag }) => updatePublishComment(id, dto, etag),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.enquiryId] });
    },
  });
}

/** ✅ 댓글 삭제 (DELETE /api/comments/{id}) */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; enquiryId: number }>({
    mutationFn: ({ id }) => deleteComment(id),
    onSuccess: (_, { enquiryId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", enquiryId] });
    },
  });
}

/** ✅ 문의 정크 처리 (POST /api/comments/junk/{enquiryId}) */
export function useMarkEnquiryAsJunk() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { enquiryId: number }>({
    mutationFn: ({ enquiryId }) => markEnquiryAsJunk(enquiryId),
    onSuccess: (_, { enquiryId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", enquiryId] });
      // 필요하면 여기서 문의 상세/목록 관련 queryKey도 같이 invalidate 가능
    },
  });
}
