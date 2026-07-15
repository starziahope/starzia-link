"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/lib/auth-context";
import type { Folder } from "@/lib/types";

type FoldersContextValue = {
  folders: Folder[];
  addFolder: (name: string) => Promise<void>;
  removeFolder: (id: string) => Promise<void>;
  renameFolder: (id: string, name: string) => Promise<void>;
};

const FoldersContext = createContext<FoldersContextValue | null>(null);

export function FoldersProvider({ children }: { children: ReactNode }) {
  const { userId } = useAuth();
  const [loaded, setLoaded] = useState<{ userId: string; folders: Folder[] } | null>(null);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    supabase
      .from("folders")
      .select("id, name")
      .eq("user_id", userId)
      .order("id", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setLoaded({
          userId,
          folders: data.map((folder) => ({ id: String(folder.id), name: folder.name })),
        });
      });
  }, [userId]);

  // Data belongs to whichever user it was fetched for. As soon as the
  // logged-in user changes, this falls back to an empty list until the
  // effect above loads fresh data for the new user.
  const folders = loaded && loaded.userId === userId ? loaded.folders : [];

  const addFolder = async (name: string) => {
    if (!userId) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("folders")
      .insert({ name })
      .select("id, name")
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setLoaded({
      userId,
      folders: [...folders, { id: String(data.id), name: data.name }],
    });
  };

  const removeFolder = async (id: string) => {
    if (!userId) return;

    const supabase = createClient();
    const { error } = await supabase.from("folders").delete().eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setLoaded({
      userId,
      folders: folders.filter((folder) => folder.id !== id),
    });
  };

  const renameFolder = async (id: string, name: string) => {
    if (!userId) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("folders")
      .update({ name })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setLoaded({
      userId,
      folders: folders.map((folder) => (folder.id === id ? { ...folder, name } : folder)),
    });
  };

  return (
    <FoldersContext.Provider
      value={{ folders, addFolder, removeFolder, renameFolder }}
    >
      {children}
    </FoldersContext.Provider>
  );
}

export function useFolders() {
  const context = useContext(FoldersContext);
  if (!context) {
    throw new Error("useFolders must be used within a FoldersProvider");
  }
  return context;
}
