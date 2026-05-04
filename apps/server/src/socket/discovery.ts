import type { Socket } from "socket.io";
import { SOCKET_EVENTS, type DiscoveryJoinPayload, type DiscoveryJoinResponse } from "@webdrop/shared";
import type { DiscoveryService } from "../services/discoveryService.js";

export function registerDiscoveryHandlers(socket: Socket, discoveryService: DiscoveryService): void {
  socket.on(SOCKET_EVENTS.DISCOVERY_JOIN, (payload: DiscoveryJoinPayload, ack?: (response: DiscoveryJoinResponse) => void) => {
    const peer = discoveryService.join(socket, payload.deviceName);
    ack?.({
      peer: {
        id: peer.id,
        deviceName: peer.deviceName,
        connectedAt: peer.connectedAt
      },
      peers: discoveryService.listNearbyPeers(peer.nearbyGroupId)
    });
  });

  socket.on(SOCKET_EVENTS.DISCOVERY_LEAVE, () => {
    discoveryService.leave(socket);
  });
}
