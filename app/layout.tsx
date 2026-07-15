import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { FoldersProvider } from "@/lib/folders-context";
import { BookmarksProvider } from "@/lib/bookmarks-context";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = "한입 링크";
const description = "링크를 폴더별로 정리하는 북마크 매니저";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  openGraph: {
    title,
    description,
    siteName: title,
    images: ["/thumbnail.png"],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/thumbnail.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--bg)]">
        <AuthProvider>
          <FoldersProvider>
            <BookmarksProvider>{children}</BookmarksProvider>
          </FoldersProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
