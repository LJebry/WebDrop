import type { ReceivedDownload, TransferPhase } from "@/types/transfer";
import { Button } from "@/components/ui/Button";
import { formatBytes } from "@/lib/transfer";

type TransferProgressProps = {
  phase: TransferPhase;
  progress: number;
  download: ReceivedDownload | null;
  errorMessage: string | null;
};

export function TransferProgress({ phase, progress, download, errorMessage }: TransferProgressProps) {
  return (
    <div className="space-y-3">
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-[#62b7ad] transition-[width] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm font-semibold text-slate-500">{labelForPhase(phase, progress)}</p>
      {errorMessage ? <p className="text-sm font-semibold text-destructive">{errorMessage}</p> : null}
      {download ? (
        <Button asChild>
          <a href={download.url} download={download.fileName}>
            Download {download.fileName} ({formatBytes(download.size)})
          </a>
        </Button>
      ) : null}
    </div>
  );
}

function labelForPhase(phase: TransferPhase, progress: number): string {
  if (phase === "requesting") return "Waiting for receiver approval.";
  if (phase === "incoming") return "Incoming request waiting for your response.";
  if (phase === "connecting") return "Establishing WebRTC connection.";
  if (phase === "transferring") return `Transfer in progress: ${progress}%`;
  if (phase === "complete") return "Transfer complete.";
  if (phase === "rejected") return "Transfer rejected.";
  if (phase === "failed") return "Transfer failed.";
  return "No active transfer.";
}
