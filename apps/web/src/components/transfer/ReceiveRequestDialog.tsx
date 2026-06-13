import type { TransferRequest } from "@webdrop/shared";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/Dialog";
import { fileIcon } from "./FilePreview";
import { formatBytes } from "@/lib/transfer";

type ReceiveRequestDialogProps = {
  request: TransferRequest | null;
  open: boolean;
  onAccept: () => void;
  onReject: () => void;
};

export function ReceiveRequestDialog({ request, open, onAccept, onReject }: ReceiveRequestDialogProps) {
  return (
    <Dialog open={open && Boolean(request)}>
      {request ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Someone wants to share</DialogTitle>
            <DialogDescription>Accept only if you want to receive this file from the nearby device.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3.5 rounded-xl border border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-strong))] p-3.5 shadow-sm">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[hsl(var(--accent-soft))] text-[hsl(var(--accent-bright))]">
              {fileIcon(request.file.type)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{request.file.name}</p>
              <p className="text-xs text-[hsl(var(--subtle-text))]">{formatBytes(request.file.size)}</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onReject}>
              Reject
            </Button>
            <Button type="button" onClick={onAccept}>
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
