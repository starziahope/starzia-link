import type { Folder } from "@/lib/types";

export default function FolderSelect({
  folders,
  value,
  onChange,
}: {
  folders: Folder[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-field select-field rounded-md px-3 py-2 text-base"
    >
      <option value="">폴더 선택</option>
      {folders.map((folder) => (
        <option key={folder.id} value={folder.id}>
          {folder.name}
        </option>
      ))}
    </select>
  );
}
