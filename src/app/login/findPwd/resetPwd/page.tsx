"use client";

import { SubmitButton, TextInput } from "@/components/authFormComponents";
import Header from "@/components/header";
import React, { useState } from "react";
import BaseModal from "@/components/baseModal"; // ✅ 모달 import
import Footer from "@/components/footer";

const ResetPwdPage: React.FC = () => {
  const [pwd, setPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // ✅ 모달 상태

  const handleSubmit = () => {
    // 실제 비밀번호 변경 API 연동이 있다면 여기서 호출
    // 성공 후 모달 열기
    setModalOpen(true);
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center px-4 py-20">
        {/* 타이틀 */}
        <h1 className="text-[36px] font-bold mb-18">비밀번호 재설정</h1>

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

          <div className="mb-1" />
          <SubmitButton text="비밀번호 변경" onClick={()=>{alert('')}}/>
        </form>
      </main>

      {/* ✅ 비밀번호 변경 완료 모달 */}
      <BaseModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <p className="text-lg font-medium mb-6">비밀번호가 변경되었습니다.</p>
        <button
          onClick={() => setModalOpen(false)}
          className="bg-red-500 text-white text-sm font-semibold px-6 py-2 rounded-md hover:bg-red-600"
        >
          확인
        </button>
      </BaseModal>
      <Footer/>
    </div>
  );
};

export default ResetPwdPage;
