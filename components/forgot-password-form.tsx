"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { AuthError } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import Toast from "@/components/toast";

function getResetRequestErrorMessage(error: AuthError): string {
  switch (error.code) {
    case "email_address_invalid":
      return "올바르지 않은 이메일 형식입니다.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
    default:
      return "비밀번호 재설정 링크 발송에 실패했습니다. 잠시 후 다시 시도해주세요.";
  }
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    variant: "error" | "success";
  } | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const showToast = (message: string, variant: "error" | "success" = "error") => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, variant });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
  };

  const isFormFilled = email.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (error) {
      showToast(getResetRequestErrorMessage(error));
      return;
    }

    showToast("비밀번호 재설정 링크를 이메일로 발송했습니다.", "success");
  };

  return (
    <>
      {toast && <Toast message={toast.message} variant={toast.variant} />}

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

        <p className="text-center text-sm text-[var(--text-sub)]">
          가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.
        </p>

        <label className="flex flex-col gap-1 text-sm font-medium text-[var(--text-sub)]">
          이메일
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field rounded-md px-3 py-2 text-base"
          />
        </label>

        <button
          type="submit"
          disabled={!isFormFilled || loading}
          className="btn-primary mt-2 rounded-md px-4 py-2 text-sm font-medium"
        >
          {loading ? "발송 중..." : "비밀번호 리셋 링크 발송"}
        </button>

        <Link
          href="/login"
          className="text-center text-sm text-[var(--accent)] hover:underline"
        >
          로그인으로 돌아가기
        </Link>
      </form>
    </>
  );
}
