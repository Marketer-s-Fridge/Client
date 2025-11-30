"use client";

import React, { useEffect, useState } from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnBackdropClick?: boolean;
}

const BaseModal: React.FC<BaseModalProps> = ({
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
          bg-white rounded-2xl shadow-xl text-center transform
          transition-all duration-300
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
          w-full max-w-[380px]    /* 모바일 가로 제한 */
          mx-4                    /* 모바일 여백 */
          px-5 py-5               /* 모바일 패딩 */
          sm:px-10                /* 데스크탑 패딩 */
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
