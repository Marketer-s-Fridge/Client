"use client";

import React, { useEffect, useState } from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnBackdropClick?: boolean;
  /** 모달 너비 커스터마이징용 */
  widthClassName?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children,
  closeOnBackdropClick = true,
  widthClassName,
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
      onClick={() => {
        if (closeOnBackdropClick) onClose();
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center
        bg-black/30 backdrop-blur-[1px]
        transition-opacity duration-300
        ${isOpen ? "opacity-100" : "opacity-0"}
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white rounded-2xl shadow-xl transform
          transition-all duration-300
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
          w-full
          ${widthClassName ?? "max-w-[380px]"}  /* 기본 너비 제한 유지 */
          mx-4
          px-5 py-5
          sm:px-10
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
