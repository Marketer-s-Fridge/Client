// src/components/PostFeature.tsx
import Image from "next/image";
import { useRouter } from "next/navigation";
import SaveToFridgeButton from "@/components/saveToFridgeButton";
import type { PostResponseDto } from "@/features/posts/types";

export default function PostFeature({
  title,
  item,
  fallback,
}: {
  title: string;
  item?: PostResponseDto;
  fallback: string;
}) {
  const router = useRouter();
  const date = item?.createdAt
    ? new Date(item.createdAt).toISOString().slice(0, 10).replaceAll("-", ".")
    : "";

  return (
    <div>
      <h3 className="text-xl md:text-2xl font-bold mb-6">{title}</h3>
      <div className="flex flex-col lg:flex-row gap-10">
        <div
          className="transition duration-300 ease-in-out hover:scale-103 cursor-pointer w-full lg:w-[40%] aspect-[3/4] relative rounded-lg overflow-hidden shadow"
          onClick={() => item && router.push(`/contents/${item.id}`)}
          aria-label={item?.title ?? title}
        >
          {item ? (
            <Image
              src={item.images?.[0] || fallback}
              alt={item.title || title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 360px, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-100 animate-pulse" />
          )}
        </div>

        <div className="lg:w-[60%] flex flex-col justify-between lg:h-full py-2">
          <div>
            <p className="text-lg sm:text-xl font-bold mt-1">
              {item?.title ?? "로딩 중"}
            </p>
            <div className="flex flex-wrap text-gray-400 gap-x-4 text-xs mt-2">
              <p>{date}</p>
            </div>
            <p className="text-sm text-gray-600 mt-5 leading-relaxed whitespace-pre-line line-clamp-12">
              {item?.content ?? "요약을 불러오는 중입니다."}
            </p>
          </div>
          <div className="mt-6">
            <SaveToFridgeButton postId={item?.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
