"use client";

import { createPortal } from "react-dom";

export default function Toast({
  message,
  variant = "error",
}: {
  message: string;
  variant?: "error" | "success";
}) {
  const background = variant === "success" ? "var(--success)" : "var(--error)";

  return createPortal(
    <div
      className="fixed top-4 left-1/2 z-30 -translate-x-1/2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-md"
      style={{ background }}
    >
      {message}
    </div>,
    document.body
  );
}
