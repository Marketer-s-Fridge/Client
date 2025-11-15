"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileImage } from "@/features/auth/api/authApi";

export function useUpdateProfileImage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (imageUrl: string) => updateProfileImage(imageUrl),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
      qc.invalidateQueries({ queryKey: ["authStatus"] });
    },
  });
}
