"use client";

import { useState } from "react";
import { useFolders } from "@/lib/folders-context";
import { useBookmarks } from "@/lib/bookmarks-context";
import LinkCard from "@/components/link-card";
import DeleteBookmarkModal from "@/components/delete-bookmark-modal";
import EditBookmarkModal from "@/components/edit-bookmark-modal";
import type { Bookmark } from "@/lib/types";

export default function LinkGrid({ folderId }: { folderId?: string }) {
  const { folders } = useFolders();
  const { bookmarks, removeBookmark, updateBookmark } = useBookmarks();
  const [pendingDelete, setPendingDelete] = useState<Bookmark | null>(null);
  const [pendingEdit, setPendingEdit] = useState<Bookmark | null>(null);

  const items = folderId
    ? bookmarks.filter((bookmark) => bookmark.folderId === folderId)
    : bookmarks;

  const folderName = folderId
    ? folders.find((folder) => folder.id === folderId)?.name
    : undefined;

  const confirmDelete = () => {
    if (!pendingDelete) return;
    removeBookmark(pendingDelete.id);
    setPendingDelete(null);
  };

  const confirmEdit = (updates: {
    title: string;
    description?: string;
    folderId: string;
  }) => {
    if (!pendingEdit) return;
    updateBookmark(pendingEdit.id, updates);
    setPendingEdit(null);
  };

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
            <LinkCard
              key={bookmark.id}
              bookmark={bookmark}
              onEdit={() => setPendingEdit(bookmark)}
              onDelete={() => setPendingDelete(bookmark)}
            />
          ))}
        </section>
      )}

      {pendingEdit && (
        <EditBookmarkModal
          bookmark={pendingEdit}
          onCancel={() => setPendingEdit(null)}
          onSave={confirmEdit}
        />
      )}

      {pendingDelete && (
        <DeleteBookmarkModal
          bookmarkTitle={pendingDelete.title}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
