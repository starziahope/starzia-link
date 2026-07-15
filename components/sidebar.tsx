"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFolders } from "@/lib/folders-context";
import { useBookmarks } from "@/lib/bookmarks-context";
import { createClient } from "@/utils/supabase/client";
import SidebarItem from "@/components/sidebar-item";
import DeleteFolderModal from "@/components/delete-folder-modal";
import EditFolderModal from "@/components/edit-folder-modal";
import type { Folder } from "@/lib/types";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { folders, removeFolder, renameFolder } = useFolders();
  const { bookmarks } = useBookmarks();
  const [pendingDelete, setPendingDelete] = useState<Folder | null>(null);
  const [pendingEdit, setPendingEdit] = useState<Folder | null>(null);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const wasActive = pathname === `/folder/${pendingDelete.id}`;
    await removeFolder(pendingDelete.id);
    setPendingDelete(null);
    if (wasActive) router.push("/");
  };

  const confirmEdit = async (name: string) => {
    if (!pendingEdit) return;
    await renameFolder(pendingEdit.id, name);
    setPendingEdit(null);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--border)] p-4">
      <nav className="flex flex-col gap-1">
        <SidebarItem
          href="/"
          label="전체"
          count={bookmarks.length}
          active={pathname === "/"}
        />

        <p className="mt-4 mb-1 px-3 text-xs font-medium text-[var(--text-sub)]">
          폴더
        </p>

        {folders.map((folder) => (
          <SidebarItem
            key={folder.id}
            href={`/folder/${folder.id}`}
            label={folder.name}
            count={
              bookmarks.filter((b) => b.folderId === folder.id).length
            }
            active={pathname === `/folder/${folder.id}`}
            onEdit={() => setPendingEdit(folder)}
            onDelete={() => setPendingDelete(folder)}
          />
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="sidebar-item mt-auto flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--text-sub)]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        로그아웃
      </button>

      {pendingEdit && (
        <EditFolderModal
          initialName={pendingEdit.name}
          onCancel={() => setPendingEdit(null)}
          onSave={confirmEdit}
        />
      )}

      {pendingDelete && (
        <DeleteFolderModal
          folderName={pendingDelete.name}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </aside>
  );
}
