"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useFolders } from "@/lib/folders-context";
import { useBookmarks } from "@/lib/bookmarks-context";
import LinkCard from "@/components/link-card";
import DeleteBookmarkModal from "@/components/delete-bookmark-modal";
import EditBookmarkModal from "@/components/edit-bookmark-modal";
import type { Bookmark } from "@/lib/types";

export default function LinkGrid({ folderId }: { folderId?: string }) {
  const { folders } = useFolders();
  const { bookmarks, removeBookmark, updateBookmark, reorderBookmarks } =
    useBookmarks();
  const [pendingDelete, setPendingDelete] = useState<Bookmark | null>(null);
  const [pendingEdit, setPendingEdit] = useState<Bookmark | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [draggedHeight, setDraggedHeight] = useState<number | null>(null);
  const [dragOrder, setDragOrder] = useState<string[] | null>(null);
  const [settledId, setSettledId] = useState<string | null>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const prevRects = useRef<Map<string, DOMRect> | null>(null);

  const items = folderId
    ? bookmarks.filter((bookmark) => bookmark.folderId === folderId)
    : bookmarks;

  const displayItems = dragOrder
    ? (dragOrder
        .map((id) => items.find((bookmark) => bookmark.id === id))
        .filter(Boolean) as Bookmark[])
    : items;

  const orderKey = displayItems.map((bookmark) => bookmark.id).join(",");

  const captureRects = () => {
    const rects = new Map<string, DOMRect>();
    cardRefs.current.forEach((el, id) => {
      rects.set(id, el.getBoundingClientRect());
    });
    prevRects.current = rects;
  };

  useLayoutEffect(() => {
    const prev = prevRects.current;
    if (!prev) return;
    prevRects.current = null;

    cardRefs.current.forEach((el, id) => {
      const oldRect = prev.get(id);
      if (!oldRect) return;
      const newRect = el.getBoundingClientRect();
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      if (dx === 0 && dy === 0) return;

      el.style.transition = "none";
      el.style.transform = `translate(${dx}px, ${dy}px)`;

      requestAnimationFrame(() => {
        el.style.transition = "transform 250ms ease";
        el.style.transform = "";
      });
    });
  }, [orderKey]);

  const folderName = folderId
    ? folders.find((folder) => folder.id === folderId)?.name
    : undefined;

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await removeBookmark(pendingDelete.id);
    setPendingDelete(null);
  };

  const confirmEdit = async (updates: {
    title: string;
    description?: string;
    folderId: string;
  }) => {
    if (!pendingEdit) return;
    await updateBookmark(pendingEdit.id, updates);
    setPendingEdit(null);
  };

  const handleDragStart = (id: string) => {
    const height = cardRefs.current.get(id)?.getBoundingClientRect().height;
    setDraggedHeight(height ?? null);
    setDraggedId(id);
    setDragOrder(items.map((bookmark) => bookmark.id));
  };

  const handleDragEnter = (targetId: string) => {
    if (!draggedId || draggedId === targetId || !dragOrder) return;
    const fromIndex = dragOrder.indexOf(draggedId);
    const toIndex = dragOrder.indexOf(targetId);
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

    captureRects();
    const reordered = [...dragOrder];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setDragOrder(reordered);
  };

  const handleDrop = () => {
    if (!draggedId || !dragOrder) return;
    const sourceId = draggedId;
    const originalIds = items.map((bookmark) => bookmark.id);
    const shouldPersist = dragOrder.join(",") !== originalIds.join(",");

    if (shouldPersist) {
      // Fire without awaiting so the optimistic reorder inside
      // reorderBookmarks batches with the state resets below —
      // the dragged card lands in its final spot in one render
      // instead of flashing back to its old position first.
      reorderBookmarks(dragOrder);
      setSettledId(sourceId);
      window.setTimeout(() => {
        setSettledId((current) => (current === sourceId ? null : current));
      }, 220);
    }

    setDraggedId(null);
    setDraggedHeight(null);
    setDragOrder(null);
  };

  const handleDragEnd = () => {
    if (dragOrder) {
      captureRects();
    }
    setDraggedId(null);
    setDraggedHeight(null);
    setDragOrder(null);
  };

  return (
    <div className="flex flex-1 flex-col">
      {folderName && (
        <h1 className="px-6 pt-10 text-[20px] leading-[1.3] font-semibold text-[var(--text)]">
          {folderName}
        </h1>
      )}

      {displayItems.length === 0 ? (
        <section className="flex flex-1 items-center justify-center p-6">
          <p className="text-sm text-[var(--text-sub)]">
            저장된 링크가 없습니다.
          </p>
        </section>
      ) : (
        <section className="grid flex-1 grid-cols-1 content-start gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayItems.map((bookmark) => (
            <div
              key={bookmark.id}
              ref={(el) => {
                if (el) cardRefs.current.set(bookmark.id, el);
                else cardRefs.current.delete(bookmark.id);
              }}
              draggable
              onDragStart={() => handleDragStart(bookmark.id)}
              onDragEnter={() => handleDragEnter(bookmark.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop();
              }}
              onDragEnd={handleDragEnd}
            >
              {bookmark.id === draggedId ? (
                <div
                  style={{ height: draggedHeight ?? undefined }}
                  className="rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--hover-bg)]"
                />
              ) : (
                <LinkCard
                  bookmark={bookmark}
                  onEdit={() => setPendingEdit(bookmark)}
                  onDelete={() => setPendingDelete(bookmark)}
                  className={
                    bookmark.id === settledId ? "card-drop-in" : undefined
                  }
                />
              )}
            </div>
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
