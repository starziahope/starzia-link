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
  removeBookmark: (id: string) => Promise<void>;
  updateBookmark: (id: string, updates: BookmarkUpdate) => Promise<void>;
  reorderBookmarks: (orderedIds: string[]) => Promise<void>;
};

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

type LinkRow = {
  id: number;
  title: string | null;
  url: string;
  description: string | null;
  thumbnail_url: string | null;
  folder_id: number | null;
  array: number;
};

function toBookmark(row: LinkRow): Bookmark {
  return {
    id: String(row.id),
    title: row.title ?? row.url,
    url: row.url,
    description: row.description ?? undefined,
    thumbnail: row.thumbnail_url ?? undefined,
    folderId: row.folder_id !== null ? String(row.folder_id) : "",
    order: row.array,
  };
}

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("links")
      .select("id, title, url, description, thumbnail_url, folder_id, array")
      .order("array", { ascending: true })
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
    const nextOrder =
      bookmarks.length > 0
        ? Math.max(...bookmarks.map((b) => b.order)) + 1
        : 0;

    const { data, error } = await supabase
      .from("links")
      .insert({
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description,
        thumbnail_url: bookmark.thumbnail,
        folder_id: bookmark.folderId ? Number(bookmark.folderId) : null,
        array: nextOrder,
      })
      .select("id, title, url, description, thumbnail_url, folder_id, array")
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setBookmarks((prev) => [...prev, toBookmark(data)]);
  };

  const removeBookmark = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("links").delete().eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
  };

  const updateBookmark = async (id: string, updates: BookmarkUpdate) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("links")
      .update({
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.description !== undefined && {
          description: updates.description,
        }),
        ...(updates.folderId !== undefined && {
          folder_id: updates.folderId ? Number(updates.folderId) : null,
        }),
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setBookmarks((prev) =>
      prev.map((bookmark) =>
        bookmark.id === id ? { ...bookmark, ...updates } : bookmark
      )
    );
  };

  const reorderBookmarks = async (orderedIds: string[]) => {
    const orderMap = new Map(orderedIds.map((id, index) => [id, index]));
    setBookmarks((prev) =>
      prev
        .map((bookmark) =>
          orderMap.has(bookmark.id)
            ? { ...bookmark, order: orderMap.get(bookmark.id)! }
            : bookmark
        )
        .sort((a, b) => a.order - b.order)
    );

    const supabase = createClient();
    const results = await Promise.all(
      orderedIds.map((id, index) =>
        supabase.from("links").update({ array: index }).eq("id", id)
      )
    );

    const failed = results.find((result) => result.error);
    if (failed?.error) {
      console.error(failed.error);
    }
  };

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        updateBookmark,
        reorderBookmarks,
      }}
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
