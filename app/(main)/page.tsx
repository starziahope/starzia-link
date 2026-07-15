import type { Metadata } from "next";
import LinkGrid from "@/components/link-grid";

export const metadata: Metadata = {
  title: "전체 링크",
};

export default function Home() {
  return <LinkGrid />;
}
