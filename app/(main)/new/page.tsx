import type { Metadata } from "next";
import NewLinkForm from "@/components/new-link-form";

export const metadata: Metadata = {
  title: "새 링크 추가",
};

export default function NewLinkPage() {
  return <NewLinkForm />;
}
