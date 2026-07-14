"use client";

import { createPortal } from "react-dom";

export default function DeleteFolderModal({
  folderName,
  onCancel,
  onConfirm,
}: {
  folderName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[6px] p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
      >
        <h2 className="text-[20px] leading-[1.3] font-semibold text-[var(--text)]">
          폴더를 삭제할까요?
        </h2>
        <p className="text-sm text-[var(--text-sub)]">
          {`‘${folderName}’ 폴더를 삭제하면 되돌릴 수 없습니다.`}
        </p>

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary rounded-md px-4 py-2 text-sm font-medium"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-danger rounded-md px-4 py-2 text-sm font-medium"
          >
            삭제
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
