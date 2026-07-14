import Link from "next/link";
import NewFolderButton from "@/components/new-folder-button";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface-translucent)] px-4 backdrop-blur-[8px]">
      <Link href="/" className="text-base font-semibold text-[var(--text)]">
        한입 링크
      </Link>
      <div className="flex items-center gap-2">
        <NewFolderButton />
        <Link
          href="/new"
          className="btn-primary flex items-center gap-1 rounded-md px-4 py-1.5 text-sm font-medium"
        >
          <span className="text-base leading-none">+</span>
          새 링크
        </Link>
      </div>
    </header>
  );
}
