"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useFolders } from "@/lib/folders-context";

export default function NewFolderButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addFolder } = useFolders();

  const close = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const trimmed = name.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      await addFolder(trimmed);
      close();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-secondary flex items-center gap-1 rounded-md px-4 py-1.5 text-sm font-medium"
      >
        <span className="text-base leading-none">+</span>
        새 폴더
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[6px] p-4"
            onClick={close}
          >
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmit}
              className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <h2 className="text-[20px] leading-[1.3] font-semibold text-[var(--text)]">
                새 폴더 만들기
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
                  onClick={close}
                  className="btn-secondary rounded-md px-4 py-2 text-sm font-medium"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || submitting}
                  className="btn-primary rounded-md px-4 py-2 text-sm font-medium"
                >
                  저장
                </button>
              </div>
            </form>
          </div>,
          document.body
        )}
    </>
  );
}
