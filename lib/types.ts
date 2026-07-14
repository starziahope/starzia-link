export type Folder = {
  id: string;
  name: string;
};

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  description?: string;
  folderId: string;
};
