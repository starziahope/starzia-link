import { folders } from "@/lib/mock-data";
import type { Bookmark } from "@/lib/types";

export default function LinkCard({ bookmark }: { bookmark: Bookmark }) {
  const domain = new URL(bookmark.url).hostname.replace(/^www\./, "");
  const folder = folders.find((folder) => folder.id === bookmark.folderId);

  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-hover group flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-[var(--hover-bg)] text-[10px] font-semibold text-[var(--text-sub)]">
            {domain.charAt(0).toUpperCase()}
          </div>
          <span className="truncate text-xs text-[var(--text-sub)]">
            {domain}
          </span>
        </div>
        {folder && (
          <span className="badge-tag shrink-0 rounded px-2 py-0.5 text-[13px] font-medium">
            {folder.name}
          </span>
        )}
      </div>
      <h3 className="line-clamp-2 text-sm font-semibold text-[var(--text)] group-hover:underline">
        {bookmark.title}
      </h3>
      {bookmark.description && (
        <p className="line-clamp-2 text-xs text-[var(--text-sub)]">
          {bookmark.description}
        </p>
      )}
    </a>
  );
}
