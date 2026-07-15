"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/lib/auth-context";
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
  const { userId } = useAuth();
  const [loaded, setLoaded] = useState<{ userId: string; bookmarks: Bookmark[] } | null>(null);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    supabase
      .from("links")
      .select("id, title, url, description, thumbnail_url, folder_id, array")
      .eq("user_id", userId)
      .order("array", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setLoaded({ userId, bookmarks: data.map(toBookmark) });
      });
  }, [userId]);

  // Data belongs to whichever user it was fetched for. As soon as the
  // logged-in user changes, this falls back to an empty list until the
  // effect above loads fresh data for the new user.
  const bookmarks = loaded && loaded.userId === userId ? loaded.bookmarks : [];

  const addBookmark = async (bookmark: NewBookmark) => {
    if (!userId) return;

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

    setLoaded({ userId, bookmarks: [...bookmarks, toBookmark(data)] });
  };

  const removeBookmark = async (id: string) => {
    if (!userId) return;

    const supabase = createClient();
    const { error } = await supabase.from("links").delete().eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setLoaded({
      userId,
      bookmarks: bookmarks.filter((bookmark) => bookmark.id !== id),
    });
  };

  const updateBookmark = async (id: string, updates: BookmarkUpdate) => {
    if (!userId) return;

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

    setLoaded({
      userId,
      bookmarks: bookmarks.map((bookmark) =>
        bookmark.id === id ? { ...bookmark, ...updates } : bookmark
      ),
    });
  };

  const reorderBookmarks = async (orderedIds: string[]) => {
    if (!userId) return;

    const orderMap = new Map(orderedIds.map((id, index) => [id, index]));
    setLoaded({
      userId,
      bookmarks: bookmarks
        .map((bookmark) =>
          orderMap.has(bookmark.id)
            ? { ...bookmark, order: orderMap.get(bookmark.id)! }
            : bookmark
        )
        .sort((a, b) => a.order - b.order),
    });

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
