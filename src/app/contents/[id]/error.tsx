"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <p className="text-lg font-semibold text-gray-900">
          페이지를 불러오지 못했어요
        </p>
        <p className="mt-2 text-sm text-gray-600 break-words">{error.message}</p>
        <button
          className="mt-4 inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
          onClick={() => reset()}
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}

