// src/hooks/useImageUpload.ts
import { useCallback, useState } from "react";
import axios from "axios";

type PresignRes = {
  uploadUrl: string;
  key: string;
};

/** presign 1회 */
async function presignOnce(file: File, scope: string = "post") {
  const { data } = await axios.post<PresignRes>("/api/uploads/presign", {
    contentType: file.type,
    size: file.size,
    scope,
  });

  await axios.put(data.uploadUrl, file, {
    headers: { "Content-Type": file.type },
  });

  return data.uploadUrl.split("?")[0]; // S3 공개 URL
}

export function useImageUpload() {
  const [loading, setLoading] = useState(false);

  /** 단일 이미지 업로드 */
  const uploadSingle = useCallback(async (file: File, scope: string = "post") => {
    try {
      setLoading(true);
      return await presignOnce(file, scope);
    } finally {
      setLoading(false);
    }
  }, []);

  /** 여러 이미지 업로드 */
  const uploadBatch = useCallback(
    async (files: File[], scope: string = "post") => {
      if (!files.length) return [];
      try {
        setLoading(true);
        const results = await Promise.all(files.map((file) => presignOnce(file, scope)));
        return results; // string[] (각 파일 공개 URL)
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    uploadSingle,
    uploadBatch,
  };
}
