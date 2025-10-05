"use client";

import React, { useEffect, useState } from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, children }) => {
  const [visible, setVisible] = useState(false);

  // ✅ fade in/out 트리거 관리
  useEffect(() => {
    if (isOpen) {
      // 살짝 지연 후 opacity 100 적용 → 자연스러운 fade-in
      const timer = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      // 닫을 때 opacity 0 → 300ms 뒤에 완전 언마운트
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 완전히 닫힌 상태일 땐 렌더하지 않음
  if (!isOpen && !visible) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center 
        bg-black/30 backdrop-blur-[1px]
        transition-opacity duration-300 
        ${isOpen ? "opacity-100" : "opacity-0"}
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()} // 배경 클릭 시 닫힘 방지
        className={`bg-white rounded-2xl px-10 py-5 shadow-xl text-center transform
          transition-all duration-300
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
