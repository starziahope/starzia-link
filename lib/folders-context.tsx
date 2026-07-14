"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Folder } from "@/lib/types";

type FoldersContextValue = {
  folders: Folder[];
  addFolder: (name: string) => Promise<void>;
  removeFolder: (id: string) => void;
  renameFolder: (id: string, name: string) => void;
};

const FoldersContext = createContext<FoldersContextValue | null>(null);

export function FoldersProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("folders")
      .select("id, name")
      .order("id", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setFolders(
          data.map((folder) => ({ id: String(folder.id), name: folder.name }))
        );
      });
  }, []);

  const addFolder = async (name: string) => {
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

    setFolders((prev) => [...prev, { id: String(data.id), name: data.name }]);
  };

  const removeFolder = (id: string) => {
    setFolders((prev) => prev.filter((folder) => folder.id !== id));
  };

  const renameFolder = (id: string, name: string) => {
    setFolders((prev) =>
      prev.map((folder) => (folder.id === id ? { ...folder, name } : folder))
    );
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
