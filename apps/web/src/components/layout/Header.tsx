"use client";

import { MAX_FILE_SIZE_BYTES } from "@webdrop/shared";
import { Bell, CheckCircle2, Coffee, Ellipsis, Info, Moon, Send, ShieldCheck, Sun, Wifi } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
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
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const { nearbyPeers, connectionStatus } = useDeviceStore();
  const { incomingRequest, outgoingRequest, transferPhase, progress, download, selectedFileMetadata } = useTransferStore();

  const hasActivity = Boolean(incomingRequest || outgoingRequest || selectedFileMetadata || download || transferPhase !== "idle");

  useEffect(() => {
    const savedTheme = localStorage.getItem("webdrop:theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const nextTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : prefersLight ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("webdrop:theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  return (
    <header className="relative z-10 grid shrink-0 grid-cols-[1fr_auto] items-start gap-3 py-6 md:grid-cols-[1fr_auto_1fr]">
      <div className="flex items-center gap-2.5">
        <span className="grid h-12 w-12 place-items-center rounded-full border-4 border-dashed border-[hsl(var(--accent-line))] bg-[hsl(var(--accent-soft))] text-[hsl(var(--accent-bright))]">
          <Send className="h-5 w-5 -rotate-12" />
        </span>
        <span>
          <span className="block font-display text-xl font-bold tracking-tight text-foreground">WebDrop</span>
          <span className="block text-sm font-semibold text-[hsl(var(--muted-text))]">Web</span>
        </span>
      </div>

      <a
        href="https://www.buymeacoffee.com/jerry.robayo"
        target="_blank"
        rel="noreferrer"
        className="order-3 col-span-2 mx-auto inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--accent-line))] bg-[hsl(var(--accent-soft))] px-3.5 py-2 text-xs font-bold text-[hsl(var(--accent-bright))] transition-[background-color,border-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:bg-[hsl(var(--accent-soft))] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-bright))] focus:ring-offset-2 focus:ring-offset-background md:order-none md:col-span-1 md:self-center"
      >
        <Coffee className="h-4 w-4" />
        Support WebDrop
      </a>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          className="pressable grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--panel-muted))] text-[hsl(var(--muted-text))] hover:bg-[hsl(var(--panel-strong))]"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="pressable relative grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--panel-muted))] text-[hsl(var(--muted-text))] hover:bg-[hsl(var(--panel-strong))]"
              aria-label="Activity"
            >
              <Bell className="h-4.5 w-4.5" />
              {hasActivity ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[hsl(var(--accent-bright))]" /> : null}
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Activity</DialogTitle>
              <DialogDescription>Current discovery and transfer status.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 text-sm font-semibold text-foreground">
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
              className="pressable grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--panel-muted))] text-[hsl(var(--muted-text))] hover:bg-[hsl(var(--panel-strong))]"
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
            <div className="grid gap-3 text-sm font-semibold text-foreground">
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
    <div className="flex gap-3 rounded-xl border border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-strong))] p-3 shadow-sm">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[hsl(var(--accent-soft))] text-[hsl(var(--accent-bright))]">{icon}</span>
      <span className="min-w-0">
        <span className="block text-xs font-bold uppercase tracking-wide text-[hsl(var(--subtle-text))]">{label}</span>
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
