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
      className={`sidebar-item flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${
        active ? "sidebar-item-active" : ""
      }`}
    >
      <span className="truncate">{label}</span>
      {count !== undefined && (
        <span
          className={`text-xs ${
            active ? "text-white/70" : "text-[var(--text-sub)]"
          }`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
