"use client";

import { useState } from "react";
import Image from "next/image";

interface SaveToFridgeButtonProps {
  initialSaved?: boolean; // 처음부터 저장된 상태인지 여부
  onToggle?: (saved: boolean) => void; // 부모에서 상태 확인 가능
}

export default function SaveToFridgeButton({
  initialSaved = false,
  onToggle,
}: SaveToFridgeButtonProps) {
  const [saved, setSaved] = useState(initialSaved);

  const handleClick = () => {
    const newState = !saved;
    setSaved(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex self-start text-gray-500 border border-gray-300 rounded-full px-4 py-1 text-sm items-center gap-2 cursor-pointer hover:bg-gray-100 transition"
    >
      <Image
        src={saved ? "/icons/redheart.png" : "/icons/pinkheart.png"}
        alt="하트"
        width={16}
        height={16}
        className={`transition-transform duration-200 ${
          saved ? "scale-105" : "scale-100"
        }`}
      />
      {saved ? "MY냉장고에 저장됨" : "MY냉장고에 저장"}
    </button>
  );
}
