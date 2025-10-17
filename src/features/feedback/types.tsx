// types/feedback.ts

/** 🔹 피드백 등록 요청 DTO */
export interface FeedbackRequestDto {
    /** 피드백을 남길 문의 ID */
    enquiryId: number;
    /** 답변이 도움이 되었는지 여부 (true=도움됨, false=도움되지 않음) */
    isHelpful: boolean;
  }
  
  /** 🔹 피드백 응답 DTO */
  export interface FeedbackResponseDto {
    id: number;
    enquiryId: number;
    isHelpful: boolean;
    createdAt: string;
  }
  