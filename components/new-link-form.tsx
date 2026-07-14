"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFolders } from "@/lib/folders-context";
import { useBookmarks } from "@/lib/bookmarks-context";
import FolderSelect from "@/components/folder-select";

export default function NewLinkForm() {
  const [url, setUrl] = useState("");
  const [folderId, setFolderId] = useState("");
  const [loading, setLoading] = useState(false);
  const { folders } = useFolders();
  const { addBookmark } = useBookmarks();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    let title = url;
    try {
      title = new URL(url).hostname.replace(/^www\./, "");
    } catch {
      // URL 파싱에 실패해도 입력값을 그대로 제목으로 사용한다
    }
    let description: string | undefined;
    let thumbnail: string | undefined;

    try {
      const res = await fetch(`/api/og?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        title = data.title ?? title;
        description = data.description;
        thumbnail = data.thumbnail;
      }
    } catch {
      // 오픈 그래프 정보를 가져오지 못해도 링크는 저장한다
    }

    await addBookmark({ title, url, description, thumbnail, folderId });
    setLoading(false);
    router.push("/");
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
          disabled={loading}
          className="btn-primary mt-2 rounded-md px-4 py-2 text-sm font-medium"
        >
          {loading ? "가져오는 중..." : "확인"}
        </button>
      </form>
    </section>
  );
}
