import { Card, CardContent } from "@/components/ui/Card";
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
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-sm font-bold tracking-tight text-[#453a2d]">Nearby devices</h2>
          <p className="text-sm font-semibold text-[#b09b82]">
            {peerCount ? `${peerCount} nearby device found` : "Scanning nearby browsers"}
          </p>
        </div>
        <ConnectionStatus status={status} />
        {showWakeHint ? (
          <p className="rounded-2xl bg-[#fbd9c4]/70 px-3 py-2 text-sm font-semibold text-[#7a6750] sm:basis-full">
            The signaling server may be waking up. Free hosting can take about a minute after inactivity.
          </p>
        ) : null}
        {errorMessage ? <p className="text-sm font-semibold text-destructive sm:basis-full">{errorMessage}</p> : null}
      </CardContent>
    </Card>
  );
}
