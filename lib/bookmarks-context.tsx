"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Bookmark } from "@/lib/types";

type NewBookmark = {
  title: string;
  url: string;
  description?: string;
  thumbnail?: string;
  folderId: string;
};

type BookmarkUpdate = Partial<Pick<Bookmark, "title" | "description" | "folderId">>;

type BookmarksContextValue = {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: NewBookmark) => Promise<void>;
  removeBookmark: (id: string) => void;
  updateBookmark: (id: string, updates: BookmarkUpdate) => void;
};

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

type LinkRow = {
  id: number;
  title: string | null;
  url: string;
  description: string | null;
  thumbnail_url: string | null;
  folder_id: number | null;
};

function toBookmark(row: LinkRow): Bookmark {
  return {
    id: String(row.id),
    title: row.title ?? row.url,
    url: row.url,
    description: row.description ?? undefined,
    thumbnail: row.thumbnail_url ?? undefined,
    folderId: row.folder_id !== null ? String(row.folder_id) : "",
  };
}

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("links")
      .select("id, title, url, description, thumbnail_url, folder_id")
      .order("id", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setBookmarks(data.map(toBookmark));
      });
  }, []);

  const addBookmark = async (bookmark: NewBookmark) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("links")
      .insert({
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description,
        thumbnail_url: bookmark.thumbnail,
        folder_id: bookmark.folderId ? Number(bookmark.folderId) : null,
      })
      .select("id, title, url, description, thumbnail_url, folder_id")
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setBookmarks((prev) => [toBookmark(data), ...prev]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
  };

  const updateBookmark = (id: string, updates: BookmarkUpdate) => {
    setBookmarks((prev) =>
      prev.map((bookmark) =>
        bookmark.id === id ? { ...bookmark, ...updates } : bookmark
      )
    );
  };

  return (
    <BookmarksContext.Provider
      value={{ bookmarks, addBookmark, removeBookmark, updateBookmark }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarksProvider");
  }
  return context;
}
