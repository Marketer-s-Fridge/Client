// types/mostViewedCategory.ts

/** 🔹 조회 기록 요청 DTO */
export interface MostViewedCategoryRequestDto {
    /** 조회로 집계할 카테고리명 */
    field: string;
    /** 조회한 콘텐츠 ID */
    category: number;
  }
  
  /** 🔹 조회 기록 응답 DTO */
  export interface MostViewedCategoryResponseDto {
    id: number;
    field: string;
    category: number;
    viewedAt: string;
  }
  