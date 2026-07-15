"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
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
        className="btn-primary mt-2 rounded-md px-4 py-2 text-sm font-medium"
      >
        로그인
      </button>

      <p className="text-center text-sm text-[var(--text-sub)]">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-[var(--accent)] hover:underline">
          회원가입
        </Link>
      </p>
    </form>
  );
}
