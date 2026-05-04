import { Card, CardContent } from "@/components/ui/Card";
import { ConnectionStatus } from "@/components/connection/ConnectionStatus";
import type { ConnectionStatus as Status } from "@/types/device";

type DiscoveryStatusProps = {
  status: Status;
  peerCount: number;
  errorMessage: string | null;
};

export function DiscoveryStatus({ status, peerCount, errorMessage }: DiscoveryStatusProps) {
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
        {errorMessage ? <p className="text-sm font-semibold text-destructive sm:basis-full">{errorMessage}</p> : null}
      </CardContent>
    </Card>
  );
}
