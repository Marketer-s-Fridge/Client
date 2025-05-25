import React from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black ">
      <div className="bg-white rounded-xl px-12 py-8 shadow-xl text-center">
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
