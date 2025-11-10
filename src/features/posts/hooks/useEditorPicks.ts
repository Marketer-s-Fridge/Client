// src/features/posts/hooks/useEditorPicks.ts
import { useQuery } from "@tanstack/react-query";
import { fetchEditorPicks } from "../api/postsApi";
import type { PostResponseDto } from "../types";

const USE_MOCK = true;

const editorMock = (limit: number): PostResponseDto[] =>
    Array.from({ length: limit }).map((_, idx) => {
        const i = String(idx + 1).padStart(3, "0");
        return {
            id: 3000 + idx,
            title: idx === 0 ? "CEO 스캔들, 마케팅으로 뒤집다?" : `Editor Pick #${idx + 1}`,
            subTitle: "PR 인사이트",
            category: "브랜딩",
            type: "CARD_NEWS",
            content: `💔 CEO 스캔들? PR 교과서로 만들었습니다.\n2025년 7월, 콜드플레이 콘서트 전광판 한 장면이 전 세계를 뒤흔들었습니다. 아스트로노머 CEO & CPO 스캔들 -임원 사임 - 기업 이미지 추락. 보통이라면 사과문, 활동 중단… 하지만 아스트로노머는 사과 대신 브랜드 스토리 전환을 선택했습니다.\n\n할리우드 배우 기네스 팰트로를 전격 투입해, 스캔들은 빼고 웃음과 메시지만 남긴 영상. 결과는 2,700만 조회수와 ‘PR의 정석’이라는 찬사. 그리고, 예상치 못한 2차 전개 콜드플레이 커플 장면은 ‘불륜밈’이 되어 방송·행사·SNS를 뒤덮었습니다.`,
            images: [`/images/cardNews/editor/${i}.png`],   // ✅ 배열 채움
            postStatus: "PUBLISHED",
            workflowStatus: "COMPLETE",
            createdAt: "2025-10-05T00:00:00Z",
            updatedAt: "2025-10-06T00:00:00Z",
        };
    });

export function useEditorPicks(limit = 6) {
    return useQuery<PostResponseDto[], Error>({
        queryKey: ["posts", "editorPicks", limit, USE_MOCK],
        queryFn: () => (USE_MOCK ? Promise.resolve(editorMock(limit)) : fetchEditorPicks(limit)),
        staleTime: 60_000,
        gcTime: 300_000,
        retry: 1,
        placeholderData: (prev) => prev,
    });
}
