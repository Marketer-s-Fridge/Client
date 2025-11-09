"use client";

import React from "react";
import Image from "next/image";

interface AuthHeaderProps {
  title?: string;
  description?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title = "회원가입",
  description = `마케터의 냉장고에 처음 오셨군요!\n신선한 마케팅 아이디어를 꺼내보기 전에\n먼저 나만의 냉장고를 만들어보세요.`,
}) => {
  return (
    <div className="w-full max-w-[550px] mx-auto text-center mb-10">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4">{title}</h1>
      <p className="text-gray-700 text-[13px] sm:text-base whitespace-pre-line">
        {description}
      </p>
    </div>
  );
};

// components/authFormComponents.tsx
export interface TextInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  rightButtonText?: string;
  onRightButtonClick?: () => void;
  rounded?: string;
  borderColor?: string;
  textColor?: string;
  bgColor?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  className = "",
  error,
  rightButtonText,
  onRightButtonClick,
  rounded = "rounded",
  borderColor = "border-[#C2C2C2]",
  textColor = "text-gray-900",
  bgColor = "bg-white",
}) => {
  return (
    <div className="w-full max-w-[500px] flex flex-col gap-1">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
        <label className="text-[15.5px] sm:text-[14.5px] font-semibold min-w-[80px] sm:w-28 whitespace-nowrap">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex-1 flex flex-row gap-2">
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full text-[13px] border ${textColor} ${bgColor} ${
              error ? "border-red-500" : borderColor
            } ${rounded} px-3 py-2 ${className}`}
          />
          {rightButtonText && (
            <button
              type="button"
              onClick={onRightButtonClick}
              className="cursor-pointer text-[13px] whitespace-nowrap bg-gray-200 rounded px-3 py-2"
            >
              {rightButtonText}
            </button>
          )}
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 sm:ml-[130px] ml-1">{error}</p>
      )}
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
      <Image src={src} alt={alt} className="w-full max-w-[400px]" />
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
  type?: "submit" | "button" | "reset"; // ✅ 이렇게 고쳐야 함!
  text: string;
  onClick?: () => void;
  fullWidth?: boolean;
  variant?: "solid" | "outline";
  color?: string;
  className?: string; // ⬅️ 추가!
  disabled?: boolean; // ✅ 추가
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  type = "submit", // 기본값
  text,
  onClick,
  fullWidth = true,
  variant = "solid",
  color = "#FF4545",
  className = "",
  disabled = false, // ✅ 기본값
}) => {
  const baseStyle =
    "cursor-pointer text-[17px] font-bold py-3 rounded-lg place-self-center w-10/11 md:w-9/11";
  const widthStyle = fullWidth ? "w-9/11" : "px-6";
  const solidStyle = `bg-[${color}] text-white`;
  const outlineStyle = `bg-white border border-[${color}] text-[${color}]`;
  const variantStyle = variant === "outline" ? outlineStyle : solidStyle;

  return (
    <button
      type={type} // ✅ props 전달
      onClick={onClick}
      disabled={disabled} // ✅ 적용
      aria-disabled={disabled}
      className={`${baseStyle} ${widthStyle} ${variantStyle} ${className}`}
    >
      {text}
    </button>
  );
};
// components/authFormComponents.tsx
// components/authFormComponents.tsx

interface GenderRadioGroupProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  required?: boolean;
  error?: string; // ⬅️ 에러 메시지 추가
}

export const GenderRadioGroup: React.FC<GenderRadioGroupProps> = ({
  label = "성별",
  value,
  onChange,
  options = [
    { value: "male", label: "남성" },
    { value: "female", label: "여성" },
  ],
  required = false,
  error,
}) => {
  return (
    <div className="w-full max-w-[500px] flex flex-col gap-1">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
        <label className="text-[15.5px] sm:text-[14.5px] font-semibold min-w-[80px] sm:w-28 whitespace-nowrap">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex gap-6 sm:pl-[5px]">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer py-2"
            >
              <input
                type="radio"
                name="gender"
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="accent-red-500"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* 에러 메시지 출력 */}
      {error && (
        <p className="text-red-500 text-xs mt-1 sm:ml-[130px] ml-1">{error}</p>
      )}
    </div>
  );
};
