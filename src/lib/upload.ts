// src/lib/upload.ts
import axios from "axios";

type PresignRes = {
  uploadUrl: string;
  key: string;
};

/** 단건 presign → S3 PUT → 공개 URL 반환 */
export async function uploadSingleImage(file: File, scope: "post" | "avatar" | "misc" = "post") {
  const { data } = await axios.post<PresignRes>("/api/uploads/presign", {
    contentType: file.type,
    size: file.size,
    scope, // 백엔드에서 scope=null이면 기본 post라, 안 써도 되긴 함
  });

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
      const { data } = await axios.post<PresignRes>("/api/uploads/presign", {
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

  // string[] (각 이미지의 S3 URL)
  return results;
}
