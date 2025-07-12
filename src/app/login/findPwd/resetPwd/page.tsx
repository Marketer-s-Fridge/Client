"use client";

import { SubmitButton, TextInput } from "@/components/authFormComponents";
import Header from "@/components/header";
import React, { useState } from "react";
import ConfirmModal from "@/components/confirmModal";
import { AuthHeader } from "@/components/authFormComponents";
import MobileMenu from "@/components/mobileMenu";

const ResetPwdPage: React.FC = () => {
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [pwdError, setPwdError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // 비밀번호 유효성 검사
  const isValidPassword = (password: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/;
    return regex.test(password);
  };

  const handleSubmit = () => {
    let valid = true;

    if (!isValidPassword(newPwd)) {
      setPwdError(
        "비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다. (8~20자)"
      );
      valid = false;
    } else {
      setPwdError("");
    }

    if (newPwd !== confirmPwd) {
      setConfirmError("비밀번호가 일치하지 않습니다.");
      valid = false;
    } else {
      setConfirmError("");
    }

    if (valid) {
      // 실제 API 호출 위치
      setModalOpen(true);
    }
  };

  return (
    <div className="bg-white">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="flex justify-center bg-white py-[16vh] px-4">
        <div className="w-full max-w-[480px] flex flex-col items-center">
          {/* 공통 헤더 */}
          <AuthHeader
            title="비밀번호 재설정"
            description={`새로운 비밀번호를 입력해 주세요.`}
          />

          {/* 입력 필드 */}
          <form
            className="w-full flex flex-col items-center gap-y-4 mb-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <TextInput
              label="새 비밀번호"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              type="password"
              required
              error={pwdError}
            />

            <TextInput
              label="새 비밀번호 확인"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              type="password"
              required
              error={confirmError}
            />
          </form>
          <SubmitButton text="비밀번호 변경" onClick={handleSubmit} />
        </div>
      </div>
      {/* ✅ 비밀번호 변경 완료 모달 */}
      <ConfirmModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <p>비밀번호가 변경되었습니다.</p>
      </ConfirmModal>
    </div>
  );
};

export default ResetPwdPage;
