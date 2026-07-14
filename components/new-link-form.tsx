"use client";

import { useState } from "react";
import { folders } from "@/lib/mock-data";
import FolderSelect from "@/components/folder-select";

export default function NewLinkForm() {
  const [url, setUrl] = useState("");
  const [folderId, setFolderId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="flex flex-1 items-start justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
      >
        <h1 className="text-[20px] leading-[1.3] font-semibold text-[var(--text)]">
          새 링크 추가
        </h1>

        <label className="flex flex-col gap-1 text-sm font-medium text-[var(--text-sub)]">
          링크
          <input
            type="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-field rounded-md px-3 py-2 text-base"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-[var(--text-sub)]">
          폴더
          <FolderSelect folders={folders} value={folderId} onChange={setFolderId} />
        </label>

        <button
          type="submit"
          className="btn-primary mt-2 rounded-md px-4 py-2 text-sm font-medium"
        >
          저장
        </button>
      </form>
    </section>
  );
}
