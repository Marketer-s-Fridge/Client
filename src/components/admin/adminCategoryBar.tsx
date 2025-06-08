"use client";

import React from "react";

interface AdminCategoryBarProps {
  title: string;
  iconSrc?: string;
}

const AdminCategoryBar: React.FC<AdminCategoryBarProps> = ({
  title,
  iconSrc = "/icons/down.png",
}) => {
  return (
    <div className="flex items-center px-[10%] sm:px-[15%] py-2.5 border-b-2 border-gray-300">
      <h1 className="text-lg font-bold text-[#1D1D1D]">{title}</h1>
      <img
        src={iconSrc}
        className="w-5 h-5 object-contain ml-2"
        alt="카테고리 아이콘"
      />
    </div>
  );
};

export default AdminCategoryBar;
