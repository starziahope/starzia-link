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
      className="group flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-zinc-200 text-[10px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {domain.charAt(0).toUpperCase()}
          </div>
          <span className="truncate text-xs text-zinc-400 dark:text-zinc-500">
            {domain}
          </span>
        </div>
        {folder && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${folder.color}`}
          >
            {folder.name}
          </span>
        )}
      </div>
      <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:underline dark:text-zinc-50">
        {bookmark.title}
      </h3>
      {bookmark.description && (
        <p className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
          {bookmark.description}
        </p>
      )}
    </a>
  );
}
