// hooks/useFeedback.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FeedbackRequestDto,
  FeedbackResponseDto,
} from "../types";
import {
  createFeedback,
  fetchAllFeedbacks,
  fetchFeedbackByEnquiryId,
} from "../api/feedback";

/** ✅ 특정 문의의 피드백 조회 */
export const useFeedbackByEnquiryId = (enquiryId?: number) => {
  return useQuery<FeedbackResponseDto | null, Error>({
    queryKey: ["feedback", enquiryId],
    queryFn: async () => {
      if (!enquiryId) return null;
      return await fetchFeedbackByEnquiryId(enquiryId);
    },
    enabled: !!enquiryId,
    staleTime: 2 * 60 * 1000,        // 2분 동안 재요청 X
    gcTime: 10 * 60 * 1000,          // 캐시 10분 유지
    refetchOnWindowFocus: false,
    retry: false,
  });
};

/** ✅ 전체 피드백 조회 */
export const useAllFeedbacks = () => {
  return useQuery<FeedbackResponseDto[], Error>({
    queryKey: ["feedbacks"],
    queryFn: fetchAllFeedbacks,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

/** ✅ 피드백 등록 */
export const useCreateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation<FeedbackResponseDto, Error, FeedbackRequestDto>({
    mutationFn: (dto) => createFeedback(dto),
    onSuccess: (data) => {
      // 전체 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      // 특정 문의에 대한 피드백도 갱신
      if (data.enquiryId) {
        queryClient.invalidateQueries({
          queryKey: ["feedback", data.enquiryId],
        });
      }
    },
  });
};
