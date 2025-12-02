// components/AgreementsSection.tsx
"use client";

import React from "react";

export type AgreementsState = {
  all: boolean;
  age: boolean;
  provide: boolean;
  collect: boolean;
  marketing: boolean;
};

interface AgreementsSectionProps {
  agreements: AgreementsState;
  onChange: (next: AgreementsState) => void;
  showError: boolean;
}

const AgreementsSection: React.FC<AgreementsSectionProps> = ({
  agreements,
  onChange,
  showError,
}) => {
  const handleAllAgree = (checked: boolean) => {
    onChange({
      all: checked,
      age: checked,
      provide: checked,
      collect: checked,
      marketing: checked,
    });
  };

  const handleSingleChange = (key: keyof AgreementsState, checked: boolean) => {
    if (key === "all") {
      handleAllAgree(checked);
    } else {
      onChange({
        ...agreements,
        [key]: checked,
      });
    }
  };

  const items: { key: keyof AgreementsState; text: string; bold?: boolean }[] =
    [
      { key: "all", text: "모두 동의하기", bold: true },
      { key: "age", text: "[필수] 만 14세 이상입니다." },
      { key: "provide", text: "[필수] 개인정보 제공에 동의합니다." },
      { key: "collect", text: "[필수] 개인정보 수집 및 이용에 동의합니다." },
      {
        key: "marketing",
        text: "[선택] 마케팅 활용 및 광고 수신에 동의합니다.",
      },
    ];

  return (
    <div className="w-full  place-self-center mt-6  pt-5 space-y-3 text-sm">
      {items.map(({ key, text, bold }) => {
        const checked = agreements[key];
        const isAll = key === "all";

        return (
          <label
            key={key}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            {/* 접근성용 실제 input (숨김) */}
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => handleSingleChange(key, e.target.checked)}
              className="sr-only peer"
            />

            {/* 커스텀 체크박스 */}
            <div
              className={[
                "flex items-center justify-center",
                isAll ? "h-5 w-5" : "h-4 w-4", // ✅ 모두 동의만 조금 더 큼
                !isAll ? "ml-0.5" : "", // ✅ 모두 동의만 조금 더 큼
                "rounded-[3px] border transition-all duration-150",
                "shadow-[0_0_0_1px_rgba(0,0,0,0.02)]",
                checked
                  ? "bg-red-500 border-red-500"
                  : "bg-white border-gray-300",
                "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-red-200",
              ].join(" ")}
            >
              {checked && (
                <svg
                  className={
                    isAll ? "h-3.5 w-3.5 text-white" : "h-3 w-3 text-white"
                  }
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>

            <span
              className={
                bold
                  ? "font-semibold text-[13px] sm:text-[14px]"
                  : "text-[12.5px] sm:text-[13px] text-gray-800"
              }
            >
              {text}
            </span>
          </label>
        );
      })}

      {showError && (
        <p className="text-[11px] text-red-500 mt-1">필수 동의를 눌러주세요.</p>
      )}
    </div>
  );
};

export default AgreementsSection;
