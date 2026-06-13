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
    <section className="surface-panel rounded-[2rem] px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#a8c09a]/30">
            <span className="h-2.5 w-2.5 rounded-full bg-[#5f8550]" />
          </span>
          <span>
          <h2 className="font-display text-sm font-bold tracking-tight text-[#453a2d]">Nearby devices</h2>
          <p className="text-sm font-semibold text-[#b09b82]">
            {peerCount ? `${peerCount} nearby ${peerCount === 1 ? "device" : "devices"} found` : "Scanning nearby browsers"}
          </p>
          </span>
        </div>
        <ConnectionStatus status={status} />
        {showWakeHint ? (
          <p className="rounded-2xl bg-[#fbd9c4]/70 px-3 py-2 text-sm font-semibold text-[#7a6750] sm:basis-full">
            The signaling server may be waking up. Free hosting can take about a minute after inactivity.
          </p>
        ) : null}
        {errorMessage ? <p className="text-sm font-semibold text-destructive sm:basis-full">{errorMessage}</p> : null}
      </div>
    </section>
  );
}
