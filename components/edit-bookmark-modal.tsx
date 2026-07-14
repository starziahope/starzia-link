"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useFolders } from "@/lib/folders-context";
import FolderSelect from "@/components/folder-select";
import type { Bookmark } from "@/lib/types";

export default function EditBookmarkModal({
  bookmark,
  onCancel,
  onSave,
}: {
  bookmark: Bookmark;
  onCancel: () => void;
  onSave: (updates: {
    title: string;
    description?: string;
    folderId: string;
  }) => void;
}) {
  const { folders } = useFolders();
  const [folderId, setFolderId] = useState(bookmark.folderId);
  const [title, setTitle] = useState(bookmark.title);
  const [description, setDescription] = useState(bookmark.description ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onSave({
      title: trimmedTitle,
      description: description.trim() || undefined,
      folderId,
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[6px] p-4"
      onClick={onCancel}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
      >
        <h2 className="text-[20px] leading-[1.3] font-semibold text-[var(--text)]">
          링크 수정
        </h2>

        <label className="flex flex-col gap-1 text-sm font-medium text-[var(--text-sub)]">
          폴더
          <FolderSelect folders={folders} value={folderId} onChange={setFolderId} />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-[var(--text-sub)]">
          제목
          <input
            autoFocus
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field rounded-md px-3 py-2 text-base"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-[var(--text-sub)]">
          설명
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="input-field resize-none rounded-md px-3 py-2 text-base"
          />
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary rounded-md px-4 py-2 text-sm font-medium"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="btn-primary rounded-md px-4 py-2 text-sm font-medium"
          >
            저장
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
