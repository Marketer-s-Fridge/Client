"use client";

import React from "react";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  className = "",
}) => {
  return (
    <div className="w-9/11 mx-auto flex items-center gap-2">
      <label className="text-[15px] w-32 font-semibold whitespace-nowrap">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`flex-1 border border-gray-400 rounded-lg px-3 py-2 ${className}`}
      />
    </div>
  );
};

interface DividerTextProps {
  text: string;
}

export const DividerText: React.FC<DividerTextProps> = ({ text }) => {
  return (
    <div className="flex items-center w-full mb-8">
      <div className="flex-1 h-[1px] bg-[#ccc]" />
      <span className="mx-4 text-[#757575] text-xs">{text}</span>
      <div className="flex-1 h-[1px] bg-[#ccc]" />
    </div>
  );
};

interface SocialButtonProps {
  src: string;
  alt: string;
  onClick: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  src,
  alt,
  onClick,
}) => {
  return (
    <button onClick={onClick}>
      <img src={src} alt={alt} className="w-full max-w-[400px]" />
    </button>
  );
};

interface ConsentCheckboxProps {
  label: string;
  required?: boolean;
  checked: boolean;
  onChange: () => void;
}

export const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({
  label,
  required = false,
  checked,
  onChange,
}) => (
  <label className="flex items-center gap-2">
    <input type="checkbox" checked={checked} onChange={onChange} />
    {required ? `[필수] ${label}` : `[선택] ${label}`}
  </label>
);

interface SubmitButtonProps {
  text: string;
  onClick: () => void;
  fullWidth?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  text,
  onClick,
  fullWidth = true,
}) => (
  <button
    onClick={onClick}
    className={`bg-[#FF4545] text-white ${
      fullWidth ? "w-9/11" : "px-6"
    } py-3 rounded-lg text-[17px] font-bold place-self-center`}
  >
    {text}
  </button>
);
