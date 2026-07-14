import type { Bookmark, Folder } from "@/lib/types";

export const folders: Folder[] = [
  { id: "dev", name: "개발" },
  { id: "design", name: "디자인" },
  { id: "shopping", name: "쇼핑" },
  { id: "reading", name: "읽을거리" },
];

export const bookmarks: Bookmark[] = [
  {
    id: "1",
    title: "Next.js Documentation",
    url: "https://nextjs.org/docs",
    description: "Next.js 공식 문서",
    folderId: "dev",
  },
  {
    id: "2",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "웹 표준 레퍼런스",
    folderId: "dev",
  },
  {
    id: "3",
    title: "Dribbble",
    url: "https://dribbble.com",
    description: "디자인 영감 모음",
    folderId: "design",
  },
  {
    id: "4",
    title: "Coolors",
    url: "https://coolors.co",
    description: "컬러 팔레트 생성기",
    folderId: "design",
  },
  {
    id: "5",
    title: "Musinsa",
    url: "https://www.musinsa.com",
    description: "온라인 패션 쇼핑몰",
    folderId: "shopping",
  },
  {
    id: "6",
    title: "Overview of the Web",
    url: "https://developer.chrome.com",
    description: "크롬 개발자 블로그",
    folderId: "reading",
  },
];
