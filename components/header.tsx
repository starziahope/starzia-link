import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-black">
      <Link
        href="/"
        className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
      >
        한입 링크
      </Link>
      <Link
        href="/new"
        className="flex items-center gap-1 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        <span className="text-base leading-none">+</span>
        새 링크
      </Link>
    </header>
  );
}
