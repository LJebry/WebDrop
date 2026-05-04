import type { FileMetadata } from "@webdrop/shared";
import { Archive, FileAudio, FileText, FileVideo, Image as ImageIcon } from "lucide-react";
import { formatBytes } from "@/lib/transfer";

type FilePreviewProps = {
  file: FileMetadata | null;
};

export function FilePreview({ file }: FilePreviewProps) {
  if (!file) {
    return <p className="text-sm font-semibold text-[#b09b82]">No file selected.</p>;
  }

  return (
    <div className="flex items-center gap-3.5 rounded-2xl bg-white/70 p-3.5 shadow-sm">
      <div className="organic-blob grid h-11 w-11 shrink-0 place-items-center bg-[#fdeee4] text-[#d97545]">
        {fileIcon(file.type)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#453a2d]">{file.name}</p>
        <p className="mt-0.5 text-xs text-[#b09b82]">
          {formatBytes(file.size)} · {file.totalChunks} chunks
        </p>
      </div>
    </div>
  );
}

export function fileIcon(type: string) {
  const className = "h-5 w-5";
  if (type.startsWith("image/")) return <ImageIcon className={className} />;
  if (type.startsWith("audio/")) return <FileAudio className={className} />;
  if (type.startsWith("video/")) return <FileVideo className={className} />;
  if (type.includes("pdf") || type.includes("document") || type.includes("text")) {
    return <FileText className={className} />;
  }
  return <Archive className={className} />;
}
