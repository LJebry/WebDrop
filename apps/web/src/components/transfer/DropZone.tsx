"use client";

import { MAX_FILE_SIZE_BYTES } from "@webdrop/shared";
import { FolderUp } from "lucide-react";
import { useState } from "react";
import { formatBytes } from "@/lib/transfer";
import { cn } from "@/lib/utils";

type DropZoneProps = {
  onFileSelected: (file: File | null) => void;
};

export function DropZone({ onFileSelected }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);

  return (
    <label
      className={cn(
        "grid min-h-40 cursor-pointer place-items-center rounded-xl border-2 border-dashed bg-slate-950/25 px-5 py-6 text-center transition-[background-color,border-color,transform,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.99]",
        dragging ? "border-[#62b7ad] bg-[#3f8f86]/10 shadow-lg shadow-[#3f8f86]/10" : "border-slate-700"
      )}
      onDragEnter={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        onFileSelected(event.dataTransfer.files[0] || null);
      }}
    >
      <input
        className="sr-only"
        type="file"
        onChange={(event) => onFileSelected(event.target.files?.[0] || null)}
      />
      <span className="grid gap-3">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#3f8f86]/15 text-[#62b7ad]">
          <FolderUp className="h-6 w-6" />
        </span>
        <span className="text-sm font-bold text-slate-100">Drop files here to share</span>
        <span className="text-xs font-semibold text-slate-500">Tap to browse · Max {formatBytes(MAX_FILE_SIZE_BYTES)}</span>
      </span>
    </label>
  );
}
