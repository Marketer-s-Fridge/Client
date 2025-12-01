"use client";

import React, { useEffect, useState } from "react";

interface BigModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnBackdropClick?: boolean;
}

const BigModal: React.FC<BigModalProps> = ({
  isOpen,
  onClose,
  children,
  closeOnBackdropClick = true,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  return (
    <div
      onClick={() => closeOnBackdropClick && onClose()}
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/30 backdrop-blur-[1px]
        transition-opacity duration-300
        ${isOpen ? "opacity-100" : "opacity-0"}
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white rounded-2xl shadow-xl
          transition-all duration-300 transform
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
          
          /* 🔥 너비 확장: 모바일은 90%, 데스크탑은 최대 540px */
          w-full max-w-[540px]
          
          /* 여백 */
          mx-6
          px-6 py-6
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default BigModal;
