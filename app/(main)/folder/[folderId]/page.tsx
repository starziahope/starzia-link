import { cookies } from "next/headers";
import type { Metadata } from "next";
import LinkGrid from "@/components/link-grid";
import { createClient } from "@/utils/supabase/server";

export async function generateMetadata(
  props: PageProps<"/folder/[folderId]">
): Promise<Metadata> {
  const { folderId } = await props.params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("folders")
    .select("name")
    .eq("id", folderId)
    .single();

  return {
    title: data?.name ?? "폴더",
  };
}

export default async function FolderPage(
  props: PageProps<"/folder/[folderId]">
) {
  const { folderId } = await props.params;

  return <LinkGrid folderId={folderId} />;
}
