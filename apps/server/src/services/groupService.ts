import type { Server } from "socket.io";
import { SOCKET_EVENTS, type PublicPeer } from "@webdrop/shared";

export class GroupService {
  constructor(private readonly io: Server) {}

  broadcastPeers(nearbyGroupId: string, peers: PublicPeer[]): void {
    this.io.to(nearbyGroupId).emit(SOCKET_EVENTS.DISCOVERY_PEERS_UPDATED, peers);
  }
}
