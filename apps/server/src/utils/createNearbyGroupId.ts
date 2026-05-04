import crypto from "node:crypto";

export function createNearbyGroupId(ip: string): string {
  return `nearby:${crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32)}`;
}
