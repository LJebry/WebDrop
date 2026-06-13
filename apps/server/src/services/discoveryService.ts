import type { Server, Socket } from "socket.io";
import { MAX_DEVICE_NAME_LENGTH } from "@webdrop/shared";
import { createNearbyGroupId } from "../utils/createNearbyGroupId.js";
import { getClientIp } from "../utils/getClientIp.js";
import { GroupService } from "./groupService.js";
import { PeerService } from "./peerService.js";

export class DiscoveryService {
  constructor(
    private readonly io: Server,
    private readonly peerService: PeerService,
    private readonly groupService: GroupService
  ) {}

  join(socket: Socket, deviceName: string) {
    const cleanDeviceName = this.normalizeDeviceName(deviceName);
    const clientIp = getClientIp(socket);
    const nearbyGroupId = createNearbyGroupId(clientIp);
    const peer = this.peerService.createPeer({
      socketId: socket.id,
      deviceName: cleanDeviceName,
      nearbyGroupId
    });

    socket.join(nearbyGroupId);
    this.broadcastNearbyGroup(nearbyGroupId);
    return peer;
  }

  leave(socket: Socket) {
    const peer = this.peerService.removeBySocketId(socket.id);
    if (!peer) return;

    socket.leave(peer.nearbyGroupId);
    this.broadcastNearbyGroup(peer.nearbyGroupId);
  }

  broadcastNearbyGroup(nearbyGroupId: string): void {
    this.pruneDisconnectedPeers(nearbyGroupId);
    this.groupService.broadcastPeers(nearbyGroupId, this.peerService.listByNearbyGroup(nearbyGroupId));
  }

  listNearbyPeers(nearbyGroupId: string) {
    return this.peerService.listByNearbyGroup(nearbyGroupId);
  }

  private normalizeDeviceName(deviceName: string): string {
    const trimmed = deviceName.trim().slice(0, MAX_DEVICE_NAME_LENGTH);
    return trimmed || "Browser Device";
  }

  private pruneDisconnectedPeers(nearbyGroupId: string): void {
    for (const peer of this.peerService.listInternalByNearbyGroup(nearbyGroupId)) {
      if (!this.io.sockets.sockets.has(peer.socketId)) {
        this.peerService.removeById(peer.id);
      }
    }
  }
}
