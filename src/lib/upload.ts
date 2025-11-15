// src/lib/upload.ts
import axios from "axios";

interface PresignResponse {
  uploadUrl: string;
  headers?: Record<string, string>;
}

/** presign + S3 PUT + 공개 URL 반환 (단건 공통 로직) */
async function presignAndUpload(file: File): Promise<string> {
  // ⭐ 제네릭 타입 명시 → data 타입 unknown 문제 해결
  const { data } = await axios.post<PresignResponse>("/api/uploads/presign", {
    contentType: file.type,
    size: file.size,
  });

  await axios.put(data.uploadUrl, file, {
    headers: data.headers ?? { "Content-Type": file.type },
  });

  return data.uploadUrl.split("?")[0];
}

/** 🔹 단건 이미지 업로드 */
export async function uploadSingleImage(file: File) {
  return presignAndUpload(file);
}

/** 🔹 여러 장 이미지 업로드 */
export async function uploadBatchImages(files: File[]) {
  if (!files.length) return [];
  return Promise.all(files.map((file) => presignAndUpload(file)));
}
