"use client";

import { usePathname } from "next/navigation";
import { bookmarks, folders } from "@/lib/mock-data";
import SidebarItem from "@/components/sidebar-item";

export default function Sidebar() {
  const pathname = usePathname();

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
          />
        ))}
      </nav>
    </aside>
  );
}
