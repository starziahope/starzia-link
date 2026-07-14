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
        className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          새 링크 추가
        </h1>

        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          링크
          <input
            type="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          폴더
          <FolderSelect folders={folders} value={folderId} onChange={setFolderId} />
        </label>

        <button
          type="submit"
          className="mt-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          저장
        </button>
      </form>
    </section>
  );
}
