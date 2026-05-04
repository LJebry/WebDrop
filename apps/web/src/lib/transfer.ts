import { FILE_CHUNK_SIZE, type FileMetadata } from "@webdrop/shared";

export function createFileMetadata(file: File): FileMetadata {
  return {
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    type: file.type || "application/octet-stream",
    totalChunks: Math.ceil(file.size / FILE_CHUNK_SIZE)
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}
