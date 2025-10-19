// api/feedback.ts
import api from "@/lib/apiClient";
import { FeedbackRequestDto, FeedbackResponseDto } from "../types";

/** ✅ 특정 문의의 피드백 조회 */
export const fetchFeedbackByEnquiryId = async (
  enquiryId: number
): Promise<FeedbackResponseDto> => {
  console.log(`🔍 [피드백 조회 요청] enquiryId=${enquiryId}`);
  try {
    const res = await api.get<FeedbackResponseDto>(`/api/enquiries/${enquiryId}/feedback`);
    console.log("✅ [피드백 조회 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [피드백 조회 실패]:", error);
    throw error;
  }
};

/** ✅ 전체 피드백 조회 */
export const fetchAllFeedbacks = async (): Promise<FeedbackResponseDto[]> => {
  console.log("📋 [전체 피드백 조회 요청]");
  try {
    const res = await api.get<FeedbackResponseDto[]>("/api/feedbacks");
    console.log("✅ [전체 피드백 조회 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [전체 피드백 조회 실패]:", error);
    throw error;
  }
};

/** ✅ 피드백 등록 */
export const createFeedback = async (
  dto: FeedbackRequestDto
): Promise<FeedbackResponseDto> => {
  console.log("📝 [피드백 등록 요청]", dto);
  try {
    const res = await api.post<FeedbackResponseDto>("/api/feedbacks", dto);
    console.log("✅ [피드백 등록 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [피드백 등록 실패]:", error);
    throw error;
  }
};
