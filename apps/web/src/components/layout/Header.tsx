"use client";

import { MAX_FILE_SIZE_BYTES } from "@webdrop/shared";
import { Bell, CheckCircle2, Ellipsis, Info, Send, ShieldCheck, Wifi } from "lucide-react";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/Dialog";
import { formatBytes } from "@/lib/transfer";
import { useDeviceStore } from "@/store/deviceStore";
import { useTransferStore } from "@/store/transferStore";

export function Header() {
  const nearbyPeers = useDeviceStore((state) => state.nearbyPeers);
  const connectionStatus = useDeviceStore((state) => state.connectionStatus);
  const incomingRequest = useTransferStore((state) => state.incomingRequest);
  const outgoingRequest = useTransferStore((state) => state.outgoingRequest);
  const transferPhase = useTransferStore((state) => state.transferPhase);
  const progress = useTransferStore((state) => state.progress);
  const download = useTransferStore((state) => state.download);
  const selectedFileMetadata = useTransferStore((state) => state.selectedFileMetadata);

  const hasActivity = Boolean(incomingRequest || outgoingRequest || selectedFileMetadata || download || transferPhase !== "idle");

  return (
    <header className="relative z-10 flex shrink-0 items-center justify-between px-1 pb-2 pt-6 sm:pt-8">
      <div className="flex items-center gap-2.5">
        <span className="organic-blob-soft breathe grid h-10 w-10 place-items-center bg-primary text-primary-foreground shadow-md shadow-[#e8915e]/20">
          <Send className="h-5 w-5 -rotate-12" />
        </span>
        <span className="font-display text-xl font-bold tracking-tight text-[#453a2d]">WebDrop</span>
      </div>
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="relative grid h-10 w-10 place-items-center rounded-2xl bg-[#fbd9c4] text-[#7a6750] transition-colors hover:bg-[#edd5a8]"
              aria-label="Activity"
            >
              <Bell className="h-4.5 w-4.5" />
              {hasActivity ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#d97545]" /> : null}
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Activity</DialogTitle>
              <DialogDescription>Current discovery and transfer status.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 text-sm font-semibold text-[#5e4e3c]">
              <ActivityRow
                icon={<Wifi className="h-4 w-4" />}
                label="Nearby discovery"
                value={`${connectionStatus} · ${nearbyPeers.length} nearby`}
              />
              <ActivityRow
                icon={<Send className="h-4 w-4" />}
                label="Transfer"
                value={formatTransferActivity({
                  incomingFileName: incomingRequest?.file.name,
                  outgoingFileName: outgoingRequest?.file.name,
                  selectedFileName: selectedFileMetadata?.name,
                  transferPhase,
                  progress
                })}
              />
              {download ? (
                <ActivityRow
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  label="Ready to download"
                  value={`${download.fileName} · ${formatBytes(download.size)}`}
                />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-2xl bg-[#fbd9c4] text-[#7a6750] transition-colors hover:bg-[#edd5a8]"
              aria-label="About WebDrop"
            >
              <Ellipsis className="h-5 w-5" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>WebDrop details</DialogTitle>
              <DialogDescription>Peer-to-peer sharing for nearby browsers.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 text-sm font-semibold text-[#5e4e3c]">
              <ActivityRow
                icon={<ShieldCheck className="h-4 w-4" />}
                label="File path"
                value="Files move browser-to-browser over WebRTC. The server only handles discovery and signaling."
              />
              <ActivityRow
                icon={<Info className="h-4 w-4" />}
                label="File limit"
                value={`This MVP accepts files up to ${formatBytes(MAX_FILE_SIZE_BYTES)}.`}
              />
              <ActivityRow
                icon={<Wifi className="h-4 w-4" />}
                label="Nearby discovery"
                value="Devices are grouped automatically by public IP for now."
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}

function ActivityRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-white/55 p-3 shadow-sm">
      <span className="organic-blob grid h-9 w-9 shrink-0 place-items-center bg-[#fbd9c4] text-[#d97545]">{icon}</span>
      <span className="min-w-0">
        <span className="block text-xs font-bold uppercase tracking-wide text-[#b09b82]">{label}</span>
        <span className="mt-0.5 block break-words leading-5">{value}</span>
      </span>
    </div>
  );
}

function formatTransferActivity(input: {
  incomingFileName?: string;
  outgoingFileName?: string;
  selectedFileName?: string;
  transferPhase: string;
  progress: number;
}) {
  if (input.incomingFileName) return `Incoming request for ${input.incomingFileName}`;
  if (input.outgoingFileName) return `${input.transferPhase} · ${input.outgoingFileName}`;
  if (input.transferPhase === "transferring") return `Transferring · ${input.progress}%`;
  if (input.selectedFileName) return `Selected ${input.selectedFileName}`;
  return "No active transfer";
}
