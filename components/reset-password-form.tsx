"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AuthError } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import Toast from "@/components/toast";

function getResetPasswordErrorMessage(error: AuthError): string {
  switch (error.code) {
    case "weak_password":
      return "비밀번호가 너무 취약합니다. 다른 비밀번호를 입력해주세요.";
    case "same_password":
      return "기존 비밀번호와 다른 비밀번호를 입력해주세요.";
    case "session_not_found":
    case "user_not_found":
      return "링크가 유효하지 않거나 만료되었습니다. 비밀번호 찾기를 다시 시도해주세요.";
    default:
      return "비밀번호 재설정에 실패했습니다. 잠시 후 다시 시도해주세요.";
  }
}

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast(message);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
  };

  const isFormFilled = password !== "" && confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (password !== confirmPassword) {
      showToast("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      showToast(getResetPasswordErrorMessage(error));
      return;
    }

    router.push("/");
  };

  return (
    <>
      {toast && <Toast message={toast} />}

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
      >
        <Link
          href="/"
          className="mb-2 text-center text-lg font-semibold text-[var(--text)]"
        >
          한입 링크
        </Link>

        <label className="flex flex-col gap-1 text-sm font-medium text-[var(--text-sub)]">
          새 비밀번호
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field rounded-md px-3 py-2 text-base"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-[var(--text-sub)]">
          새 비밀번호 확인
          <input
            type="password"
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field rounded-md px-3 py-2 text-base"
          />
        </label>

        <button
          type="submit"
          disabled={!isFormFilled || loading}
          className="btn-primary mt-2 rounded-md px-4 py-2 text-sm font-medium"
        >
          {loading ? "변경 중..." : "비밀번호 변경"}
        </button>
      </form>
    </>
  );
}
