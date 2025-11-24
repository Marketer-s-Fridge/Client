"use client";

import { useEffect } from "react";

export default function ChunkErrorHandler() {
  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      const error = event.error;

      if (error instanceof Error && error.name === "ChunkLoadError") {
        window.location.reload();
      }
    };

    window.addEventListener("error", handler);
    return () => window.removeEventListener("error", handler);
  }, []);

  return null;
}