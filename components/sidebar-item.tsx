import Link from "next/link";

export default function SidebarItem({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count?: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
      }`}
    >
      <span className="truncate">{label}</span>
      {count !== undefined && (
        <span
          className={`text-xs ${
            active
              ? "text-zinc-300 dark:text-zinc-500"
              : "text-zinc-400 dark:text-zinc-600"
          }`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
