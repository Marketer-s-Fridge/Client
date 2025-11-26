// app/login/findPwd/resetPwd/ResetPwdPageClient.tsx
"use client";

import {
  SubmitButton,
  TextInput,
  AuthHeader,
} from "@/components/authFormComponents";
import Header from "@/components/header";
import MobileMenu from "@/components/mobileMenu";
import ConfirmModal from "@/components/confirmModal";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useResetPasswordByFindPw } from "@/features/auth/hooks/useResetPasswordByFindPw";

interface ResetPwdPageClientProps {
  userId: string;
}

const ResetPwdPageClient: React.FC<ResetPwdPageClientProps> = ({ userId }) => {
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [pwdError, setPwdError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const router = useRouter();
  const { mutateAsync, isPending } = useResetPasswordByFindPw();

  // 비밀번호 유효성 검사
  const isValidPassword = (password: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/.test(
      password
    );

  const handleSubmit = async () => {
    setSubmitError("");

    if (!userId) {
      setSubmitError("유효하지 않은 비밀번호 재설정 요청입니다.");
      return;
    }

    let valid = true;

    if (!isValidPassword(newPwd)) {
      setPwdError(
        "비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다. (8~20자)"
      );
      valid = false;
    } else setPwdError("");

    if (newPwd !== confirmPwd) {
      setConfirmError("비밀번호가 일치하지 않습니다.");
      valid = false;
    } else setConfirmError("");

    if (!valid) return;

    try {
      await mutateAsync({
        userId,
        newPassword: newPwd,
        confirmNewPassword: confirmPwd,
      });
      setModalOpen(true);
    } catch (e: unknown) {
      console.error("비밀번호 재설정 실패:", e);
      setSubmitError("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    router.push("/login");
  };

  return (
    <div className="bg-white pt-11 md:pt-0">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="flex justify-center bg-white py-[16vh] px-4">
        <div className="w-full max-w-[480px] flex flex-col items-center">
          <AuthHeader
            title="비밀번호 재설정"
            description={`새로운 비밀번호를 입력해 주세요.`}
          />

          <form
            className="w-8/9 md:w-7/9 mb-10 flex flex-col items-center gap-y-4"
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

          <SubmitButton
            text={isPending ? "변경 중..." : "비밀번호 변경"}
            onClick={handleSubmit}
            disabled={isPending}
          />

          {submitError && (
            <p className="text-sm text-red-500 mt-4">{submitError}</p>
          )}
        </div>
      </div>

      <ConfirmModal isOpen={modalOpen} onClose={handleCloseModal}>
        <p>비밀번호가 변경되었습니다. 다시 로그인해 주세요.</p>
      </ConfirmModal>
    </div>
  );
};

export default ResetPwdPageClient;
