"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { bookmarks } from "@/lib/mock-data";
import { useFolders } from "@/lib/folders-context";
import SidebarItem from "@/components/sidebar-item";
import DeleteFolderModal from "@/components/delete-folder-modal";
import EditFolderModal from "@/components/edit-folder-modal";
import type { Folder } from "@/lib/types";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { folders, removeFolder, renameFolder } = useFolders();
  const [pendingDelete, setPendingDelete] = useState<Folder | null>(null);
  const [pendingEdit, setPendingEdit] = useState<Folder | null>(null);

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const wasActive = pathname === `/folder/${pendingDelete.id}`;
    removeFolder(pendingDelete.id);
    setPendingDelete(null);
    if (wasActive) router.push("/");
  };

  const confirmEdit = (name: string) => {
    if (!pendingEdit) return;
    renameFolder(pendingEdit.id, name);
    setPendingEdit(null);
  };

  return (
    <aside className="w-56 shrink-0 border-r border-[var(--border)] p-4">
      <nav className="flex flex-col gap-1">
        <SidebarItem
          href="/"
          label="All"
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
