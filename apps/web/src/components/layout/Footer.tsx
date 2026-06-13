import { Radar, Wifi } from "lucide-react";

type FooterProps = {
  peerCount: number;
};

export function Footer({ peerCount }: FooterProps) {
  return (
    <footer className="shrink-0 pb-8 pt-4">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-[hsl(var(--panel-border))] bg-[hsl(var(--panel))]/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[hsl(var(--accent-soft))] text-[hsl(var(--accent-bright))]">
            <Radar className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <span className="block truncate text-xs font-semibold text-[hsl(var(--muted-text))]">Looking for nearby devices</span>
            <div className="mt-1 flex items-center gap-1">
              <span className="bounce-1 h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-bright))]" />
              <span className="bounce-2 h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-bright))]" />
              <span className="bounce-3 h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-bright))]" />
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[hsl(var(--panel-strong))] px-2.5 py-2">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[hsl(var(--accent-soft))]">
            <Wifi className="h-3 w-3 text-[hsl(var(--accent-bright))]" />
          </span>
          <span className="text-xs font-semibold text-[hsl(var(--muted-text))]">{peerCount} nearby</span>
        </div>
      </div>
    </footer>
  );
}
