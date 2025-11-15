// src/lib/upload.ts
import axios from "axios";
import api from "@/lib/apiClient"; // ✅ 공용 axios 인스턴스 (withCredentials, Authorization 등 포함)

interface PresignResponse {
  uploadUrl: string;
  headers?: Record<string, string>;
}

/** presign + S3 PUT + 공개 URL 반환 (단건 공통 로직) */
async function presignAndUpload(file: File): Promise<string> {
  // ✅ presign 요청은 api(공용 클라이언트)로 보내서
  //    쿠키, Authorization 헤더 등이 같이 가도록 함
  const { data } = await api.post<PresignResponse>("/uploads/presign", {
    contentType: file.type,
    size: file.size,
  });
  // 만약 NEXT_PUBLIC_API_URL이 `/api`까지 포함 안 했으면,
  // 여기 경로를 "/api/uploads/presign" 으로 맞춰야 함

  // ✅ 실제 S3 업로드는 절대경로이므로 baseURL 없는 axios로 호출 (그대로 유지)
  await axios.put(data.uploadUrl, file, {
    headers: data.headers ?? { "Content-Type": file.type },
  });

  // 쿼리스트링 제거한 공개 URL만 반환
  return data.uploadUrl.split("?")[0];
}

/** 🔹 단건 이미지 업로드 */
export async function uploadSingleImage(file: File) {
  return presignAndUpload(file);
}

/** 🔹 여러 장 이미지 업로드 (presign 여러 번 호출) */
export async function uploadBatchImages(files: File[]) {
  if (!files.length) return [];
  return Promise.all(files.map((file) => presignAndUpload(file)));
}
