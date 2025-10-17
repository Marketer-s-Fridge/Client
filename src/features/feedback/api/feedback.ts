// api/feedback.ts
import api from "@/lib/apiClient";
import { FeedbackRequestDto, FeedbackResponseDto } from "../types";

/** ✅ 특정 문의의 피드백 조회 */
export const fetchFeedbackByEnquiryId = async (
    enquiryId: number
): Promise<FeedbackResponseDto> => {
    const res = await api.get<FeedbackResponseDto>(`/enquiries/${enquiryId}/feedback`);
    return res.data;
};

/** ✅ 전체 피드백 조회 */
export const fetchAllFeedbacks = async (): Promise<FeedbackResponseDto[]> => {
    const res = await api.get<FeedbackResponseDto[]>("/feedbacks");
    return res.data;
};

/** ✅ 피드백 등록 */
export const createFeedback = async (
    dto: FeedbackRequestDto
): Promise<FeedbackResponseDto> => {
    const res = await api.post<FeedbackResponseDto>("/feedbacks", dto);
    return res.data;
};
