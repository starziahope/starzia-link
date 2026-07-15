"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AuthError } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import Toast from "@/components/toast";

function getLoginErrorMessage(error: AuthError): string {
  switch (error.code) {
    case "invalid_credentials":
      return "이메일 또는 비밀번호가 올바르지 않습니다.";
    case "email_not_confirmed":
      return "이메일 인증이 완료되지 않았습니다.";
    case "user_banned":
      return "이용이 제한된 계정입니다.";
    case "user_not_found":
      return "가입되지 않은 이메일입니다.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
    default:
      return "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.";
  }
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const isFormFilled = email.trim() !== "" && password !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      showToast(getLoginErrorMessage(error));
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

        <label className="flex flex-col gap-1 text-sm font-medium text-[var(--text-sub)]">
          비밀번호
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field rounded-md px-3 py-2 text-base"
          />
        </label>

        <button
          type="submit"
          disabled={!isFormFilled || loading}
          className="btn-primary mt-2 rounded-md px-4 py-2 text-sm font-medium"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <p className="text-center text-sm text-[var(--text-sub)]">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-[var(--accent)] hover:underline">
            회원가입
          </Link>
        </p>
      </form>
    </>
  );
}
