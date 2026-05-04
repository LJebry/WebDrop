"use client";

import { FolderUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type DropZoneProps = {
  onFileSelected: (file: File | null) => void;
};

export function DropZone({ onFileSelected }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);

  return (
    <label
      className={cn(
        "grid min-h-44 cursor-pointer place-items-center rounded-3xl border-2 border-dashed bg-white/60 px-5 py-6 text-center transition-all active:scale-[0.98]",
        dragging ? "border-[#d97545] bg-[#fdeee4]/70" : "border-[#b09b82]/45"
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
        <span className="organic-blob-alt mx-auto grid h-14 w-14 place-items-center bg-[#fbd9c4] text-[#d97545]">
          <FolderUp className="h-6 w-6" />
        </span>
        <span className="text-sm font-semibold text-[#5e4e3c]">Drop files here to share</span>
        <span className="text-xs text-[#b09b82]">Tap to browse · Sent peer-to-peer</span>
      </span>
    </label>
  );
}
