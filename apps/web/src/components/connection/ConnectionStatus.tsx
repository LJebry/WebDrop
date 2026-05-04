import type { ConnectionStatus as Status } from "@/types/device";
import { Badge } from "@/components/ui/badge";

type ConnectionStatusProps = {
  status: Status;
};

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const label = {
    idle: "Not connected",
    connecting: "Connecting",
    connected: "Connected",
    error: "Connection failed"
  }[status];

  return (
    <Badge variant={status === "connected" ? "default" : status === "error" ? "destructive" : "secondary"}>
      {label}
    </Badge>
  );
}
