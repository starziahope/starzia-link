import type { Metadata } from "next";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
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
        <div className="flex flex-1 flex-col">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
