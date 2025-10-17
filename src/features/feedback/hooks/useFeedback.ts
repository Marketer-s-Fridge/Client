// hooks/useFeedback.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FeedbackRequestDto, FeedbackResponseDto } from "../types";
import { createFeedback, fetchAllFeedbacks, fetchFeedbackByEnquiryId } from "../api/feedback";

/** ✅ 특정 문의의 피드백 조회 */
export const useFeedbackByEnquiryId = (enquiryId?: number) => {
    return useQuery<FeedbackResponseDto>({
        queryKey: ["feedback", enquiryId],
        queryFn: () => fetchFeedbackByEnquiryId(enquiryId!),
        enabled: !!enquiryId, // enquiryId 있을 때만 실행
    });
};

/** ✅ 전체 피드백 조회 */
export const useAllFeedbacks = () => {
    return useQuery<FeedbackResponseDto[]>({
        queryKey: ["feedbacks"],
        queryFn: fetchAllFeedbacks,
    });
};

/** ✅ 피드백 등록 */
export const useCreateFeedback = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: FeedbackRequestDto) => createFeedback(dto),
        onSuccess: () => {
            // 캐시된 피드백 목록 갱신
            queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
        },
    });
};
