"use client";

import { useFolders } from "@/lib/folders-context";
import { useBookmarks } from "@/lib/bookmarks-context";
import LinkCard from "@/components/link-card";

export default function LinkGrid({ folderId }: { folderId?: string }) {
  const { folders } = useFolders();
  const { bookmarks } = useBookmarks();

  const items = folderId
    ? bookmarks.filter((bookmark) => bookmark.folderId === folderId)
    : bookmarks;

  const folderName = folderId
    ? folders.find((folder) => folder.id === folderId)?.name
    : undefined;

  return (
    <div className="flex flex-1 flex-col">
      {folderName && (
        <h1 className="px-6 pt-10 text-[20px] leading-[1.3] font-semibold text-[var(--text)]">
          {folderName}
        </h1>
      )}

      {items.length === 0 ? (
        <section className="flex flex-1 items-center justify-center p-6">
          <p className="text-sm text-[var(--text-sub)]">
            저장된 링크가 없습니다.
          </p>
        </section>
      ) : (
        <section className="grid flex-1 grid-cols-1 content-start gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((bookmark) => (
            <LinkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </section>
      )}
    </div>
  );
}
