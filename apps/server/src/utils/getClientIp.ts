import type { Socket } from "socket.io";

export function getClientIp(socket: Socket): string {
  const forwarded = socket.handshake.headers["x-forwarded-for"];
  const rawForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const candidate = rawForwarded?.split(",")[0]?.trim() || socket.handshake.address || "unknown";

  const normalized = candidate.replace(/^::ffff:/, "");
  return isLocalDevelopmentAddress(normalized) ? "local-development-network" : normalized;
}

function isLocalDevelopmentAddress(ip: string): boolean {
  return (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}
