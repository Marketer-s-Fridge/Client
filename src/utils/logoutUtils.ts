export const clearUserClientDataOnLogout = () => {
    const KEYS_TO_CLEAR = [
        "accessToken",
        "user",

        // 최근 본 콘텐츠
        "recentViewes",

        // 마이 냉장고
        "bookmarks",
        "recent-bookmarked",

        "categoryStats",

        // 추천 콘텐츠
        "recommended",

        // 콘텐츠 소비 리포트
        "consumptionReport",

        // 검색 기록
        "popularSearchKeywords",

        "recentViews",

        "mostViewedCategory",

        "feedback",

        "feedbacks",

        "enquiries",
        "myEnquiries",
    ];

    KEYS_TO_CLEAR.forEach((key) => localStorage.removeItem(key));
};
