import { ConnectionStatus } from "@/components/connection/ConnectionStatus";
import type { ConnectionStatus as Status } from "@/types/device";

type DiscoveryStatusProps = {
  status: Status;
  peerCount: number;
  errorMessage: string | null;
  showWakeHint?: boolean;
};

export function DiscoveryStatus({ status, peerCount, errorMessage, showWakeHint = false }: DiscoveryStatusProps) {
  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-[hsl(var(--panel-border))] bg-[hsl(var(--panel))]/70 px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[hsl(var(--accent-soft))]">
            <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--accent-bright))]" />
          </span>
          <span>
            <h2 className="font-display text-sm font-bold tracking-tight text-foreground">Nearby devices</h2>
            <p className="text-sm font-semibold text-[hsl(var(--muted-text))]">
              {peerCount ? `${peerCount} nearby ${peerCount === 1 ? "device" : "devices"} found` : "Scanning nearby browsers"}
            </p>
          </span>
        </div>
        <ConnectionStatus status={status} />
        {showWakeHint ? (
          <p className="rounded-xl bg-amber-400/10 px-3 py-2 text-sm font-semibold text-amber-200 sm:basis-full">
            The signaling server may be waking up. Free hosting can take about a minute after inactivity.
          </p>
        ) : null}
        {errorMessage ? <p className="text-sm font-semibold text-destructive sm:basis-full">{errorMessage}</p> : null}
      </div>
    </section>
  );
}
