"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { bookmarks as initialBookmarks } from "@/lib/mock-data";
import type { Bookmark } from "@/lib/types";

type BookmarksContextValue = {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, "id">) => void;
  removeBookmark: (id: string) => void;
};

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);

  const addBookmark = (bookmark: Omit<Bookmark, "id">) => {
    setBookmarks((prev) => [{ id: crypto.randomUUID(), ...bookmark }, ...prev]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
  };

  return (
    <BookmarksContext.Provider value={{ bookmarks, addBookmark, removeBookmark }}>
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
