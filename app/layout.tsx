import type { Metadata } from "next";
import { FoldersProvider } from "@/lib/folders-context";
import { BookmarksProvider } from "@/lib/bookmarks-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "한입 링크",
  description: "링크를 폴더별로 정리하는 북마크 매니저",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--bg)]">
        <FoldersProvider>
          <BookmarksProvider>{children}</BookmarksProvider>
        </FoldersProvider>
      </body>
    </html>
  );
}
