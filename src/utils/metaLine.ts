// src/utils/metaLine.ts
export const META_PREFIX_REGEX = /^(에디터|출처)\s*[|ㅣ│]\s*/;

/** 에디터/출처 라인인지 여부 판별 */
export function isMetaLine(line: string): boolean {
  const trimmed = line.trim();
  return META_PREFIX_REGEX.test(trimmed);
}

/** 에디터/출처 라인을 "라벨 | 내용" 형태로 통일 */
export function normalizeMetaLine(line: string): string {
  const trimmed = line.trim();
  return trimmed.replace(
    META_PREFIX_REGEX,
    (_, label: string) => `${label} | `
  );
}

/** 컨텐츠를 줄 단위 배열로 분리 */
export function splitContentLines(content?: string | null): string[] {
  if (!content) return [];
  return content.split("\n");
}
