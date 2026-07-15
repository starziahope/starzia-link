"use client";

import { createPortal } from "react-dom";

export default function Toast({ message }: { message: string }) {
  return createPortal(
    <div className="fixed top-4 left-1/2 z-30 -translate-x-1/2 rounded-md bg-[var(--error)] px-4 py-2 text-sm font-medium text-white shadow-md">
      {message}
    </div>,
    document.body
  );
}
