// src/components/noContentView.tsx
"use client";

import React from "react";
import Image from "next/image";

interface NoContentViewProps {
  title?: string;
  description?: string;
  imageSrc?: string;
}

const NoContentView: React.FC<NoContentViewProps> = ({
  title = "새로운 콘텐츠를 준비 중이에요",
  description = "곧 흥미로운 콘텐츠로 찾아올게요!",
  imageSrc = "/icons/noContents.png",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 pt-15 text-center">
      <h1 className="text-xl md:text-2xl font-bold mb-4">{title}</h1>
      {description && (
        <p className="text-gray-500 text-sm md:text-base mb-8">{description}</p>
      )}
      <div className="flex justify-center">
        <Image
          src={imageSrc}
          alt="no content"
          width={500}
          height={250}
          className="h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default NoContentView;
