import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-[var(--text)]">로그인 중 문제가 발생했습니다.</p>
      <Link
        href="/login"
        className="text-sm text-[var(--accent)] hover:underline"
      >
        로그인 페이지로 돌아가기
      </Link>
    </div>
  );
}
