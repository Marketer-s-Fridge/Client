"use client";

import { SubmitButton, TextInput } from "@/components/authFormComponents";
import Header from "@/components/header";
import React, { useState } from "react";
import ConfirmModal from "@/components/confirmModal";

const ResetPwdPage: React.FC = () => {
  const [pwd, setPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = () => {
    // 실제 비밀번호 변경 API 연동이 있다면 여기에서 호출
    setModalOpen(true);
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
            label="현재 비밀번호"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            type="password"
            required
          />

          <TextInput
            label="새 비밀번호"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            type="password"
            required
          />

          <SubmitButton text="비밀번호 변경" onClick={handleSubmit} />
        </form>
      </main>

      {/* ✅ 비밀번호 변경 완료 모달 */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      ><p>"비밀번호가 변경되었습니다."</p>
      </ConfirmModal>
    </div>
  );
};

export default ResetPwdPage;
