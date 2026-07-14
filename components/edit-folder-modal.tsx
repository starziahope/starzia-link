"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

export default function EditFolderModal({
  initialName,
  onCancel,
  onSave,
}: {
  initialName: string;
  onCancel: () => void;
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[6px] p-4"
      onClick={onCancel}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
      >
        <h2 className="text-[20px] leading-[1.3] font-semibold text-[var(--text)]">
          폴더 이름 수정
        </h2>

        <label className="flex flex-col gap-1 text-sm font-medium text-[var(--text-sub)]">
          폴더 이름
          <input
            autoFocus
            required
            type="text"
            placeholder="폴더 이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field rounded-md px-3 py-2 text-base"
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
            disabled={!name.trim()}
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
