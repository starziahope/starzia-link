import LinkGrid from "@/components/link-grid";

export default async function FolderPage(
  props: PageProps<"/folder/[folderId]">
) {
  const { folderId } = await props.params;

  return <LinkGrid folderId={folderId} />;
}
