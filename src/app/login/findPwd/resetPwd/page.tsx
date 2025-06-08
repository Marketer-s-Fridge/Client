"use client";

import { SubmitButton, TextInput } from "@/components/authFormComponents";
import Header from "@/components/header";
import React, { useState } from "react";
import ConfirmModal from "@/components/confirmModal";

const ResetPwdPage: React.FC = () => {
  const [pwd, setPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [pwdError, setPwdError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // 비밀번호 유효성 검사: 영문+숫자+특수문자 포함, 8~20자
  const isValidPassword = (password: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/;
    return regex.test(password);
  };

  const handleSubmit = () => {
    let valid = true;

    // 새 비밀번호 유효성 검사
    if (!isValidPassword(newPwd)) {
      setPwdError(
        "비밀번호는 영문, 숫자, 특수문자를 모두 포함해야합니다. (8~20자)"
      );
      valid = false;
    } else {
      setPwdError("");
    }

    // 새 비밀번호 일치 검사
    if (newPwd !== confirmPwd) {
      setConfirmError("비밀번호가 일치하지 않습니다.");
      valid = false;
    } else {
      setConfirmError("");
    }

    if (valid) {
      // 실제 비밀번호 변경 API 호출 위치
      setModalOpen(true);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-start pt-[15vh] px-4">
        {/* 타이틀 */}
        <h1 className="text-[36px] font-bold mb-10">비밀번호 재설정</h1>

        {/* 입력 필드 */}
        <form
          className="w-3/8 flex flex-col gap-6 items-center"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TextInput
            label="새 비밀번호"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            type="password"
            required
            error={pwdError}
          />

          <TextInput
            label="새 비밀번호 확인"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            type="password"
            required
            error={confirmError}
          />

          <SubmitButton text="비밀번호 변경" onClick={handleSubmit} />
        </form>
      </main>

      {/* ✅ 비밀번호 변경 완료 모달 */}
      <ConfirmModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <p>비밀번호가 변경되었습니다.</p>
      </ConfirmModal>
    </div>
  );
};

export default ResetPwdPage;
