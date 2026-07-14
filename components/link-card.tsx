"use client";

import { useFolders } from "@/lib/folders-context";
import type { Bookmark } from "@/lib/types";

export default function LinkCard({
  bookmark,
  onDelete,
}: {
  bookmark: Bookmark;
  onDelete?: () => void;
}) {
  const { folders } = useFolders();
  const domain = new URL(bookmark.url).hostname.replace(/^www\./, "");
  const folder = folders.find((folder) => folder.id === bookmark.folderId);

  return (
    <div className="card-hover group relative flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={bookmark.title}
        className="absolute inset-0 z-10"
      />

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label={`${bookmark.title} 링크 삭제`}
          className="card-action-button absolute right-2 top-2 z-20 rounded-md p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
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

      {bookmark.thumbnail && (
        <div className="relative aspect-video w-full overflow-hidden bg-[var(--hover-bg)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bookmark.thumbnail}
            alt=""
            className="h-full w-full object-cover"
          />
          {folder && (
            <span className="badge-tag absolute left-2 top-2 rounded px-2 py-0.5 text-[13px] font-medium">
              {folder.name}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {!bookmark.thumbnail && folder && (
          <span className="badge-tag self-start rounded px-2 py-0.5 text-[13px] font-medium">
            {folder.name}
          </span>
        )}
        <div
          className={`flex min-w-0 items-center gap-2 ${
            onDelete && !bookmark.thumbnail ? "pr-7" : ""
          }`}
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-[var(--hover-bg)] text-[10px] font-semibold text-[var(--text-sub)]">
            {domain.charAt(0).toUpperCase()}
          </div>
          <span className="truncate text-xs text-[var(--text-sub)]">
            {domain}
          </span>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold text-[var(--text)] group-hover:underline">
          {bookmark.title}
        </h3>
        {bookmark.description && (
          <p className="line-clamp-2 text-xs text-[var(--text-sub)]">
            {bookmark.description}
          </p>
        )}
      </div>
    </div>
  );
}
