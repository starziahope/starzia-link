import Link from "next/link";

export default function SidebarItem({
  href,
  label,
  count,
  active,
  onDelete,
}: {
  href: string;
  label: string;
  count?: number;
  active: boolean;
  onDelete?: () => void;
}) {
  return (
    <div
      className={`sidebar-item group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${
        active ? "sidebar-item-active" : ""
      }`}
    >
      <Link href={href} className="flex-1 truncate">
        {label}
      </Link>
      <span className="flex shrink-0 items-center gap-1">
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label={`${label} 폴더 삭제`}
            className={`sidebar-item-delete rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 ${
              active ? "text-white/70" : "text-[var(--text-sub)]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        )}
        {count !== undefined && (
          <span
            className={`text-xs ${
              active ? "text-white/70" : "text-[var(--text-sub)]"
            }`}
          >
            {count}
          </span>
        )}
      </span>
    </div>
  );
}
