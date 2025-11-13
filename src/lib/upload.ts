// src/lib/upload.ts
// import api from "@/lib/api"; // ✅ 토큰/withCredentials 붙는 axios 인스턴스
import axios from "axios";  // ✅ S3 PUT 용(절대 URL이라 상관 없음)
import api from "./apiClient";

type PresignRes = {
  uploadUrl: string;
  key: string;
};

/** 단건 presign → S3 PUT → 공개 URL 반환 */
export async function uploadSingleImage(
  file: File,
  scope: "post" | "avatar" | "misc" = "post"
) {
  // ✅ 여기서 api 사용 → Authorization 자동 첨부
  const { data } = await api.post<PresignRes>("/api/uploads/presign", {
    contentType: file.type,
    size: file.size,
    scope,
  });

  // pre-signed URL은 절대 URL이라 그냥 axios 써도 OK
  await axios.put(data.uploadUrl, file, {
    headers: { "Content-Type": file.type },
  });

  // 쿼리스트링 제거한 S3 공개 URL만 반환
  return data.uploadUrl.split("?")[0];
}

/** 여러 장 → presign 여러 번 호출 → 병렬 PUT → 공개 URL 배열 반환 */
export async function uploadBatchImages(
  files: File[],
  scope: "post" | "avatar" | "misc" = "post"
) {
  if (!files.length) return [];

  const results = await Promise.all(
    files.map(async (file) => {
      const { data } = await api.post<PresignRes>("/api/uploads/presign", {
        contentType: file.type,
        size: file.size,
        scope,
      });

      await axios.put(data.uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });

      return data.uploadUrl.split("?")[0];
    })
  );

  return results; // string[]
}
