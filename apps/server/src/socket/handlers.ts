import type { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "@webdrop/shared";
import { DiscoveryService } from "../services/discoveryService.js";
import { GroupService } from "../services/groupService.js";
import { PeerService } from "../services/peerService.js";
import { registerDiscoveryHandlers } from "./discovery.js";
import { registerSignalingHandlers } from "./signaling.js";
import { registerTransferRequestHandlers } from "./transferRequests.js";

export function registerSocketHandlers(io: Server): void {
  const peerService = new PeerService();
  const groupService = new GroupService(io);
  const discoveryService = new DiscoveryService(io, peerService, groupService);

  io.on("connection", (socket: Socket) => {
    registerDiscoveryHandlers(socket, discoveryService);
    registerTransferRequestHandlers(socket, peerService);
    registerSignalingHandlers(socket, peerService);

    socket.on("disconnect", () => {
      const peer = peerService.getBySocketId(socket.id);
      discoveryService.leave(socket);
      if (peer) {
        socket.to(peer.nearbyGroupId).emit(SOCKET_EVENTS.PEER_DISCONNECTED, { peerId: peer.id });
      }
    });
  });
}
