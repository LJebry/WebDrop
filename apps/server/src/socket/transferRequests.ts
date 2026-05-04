import crypto from "node:crypto";
import type { Socket } from "socket.io";
import {
  SOCKET_EVENTS,
  type TransferAcceptedPayload,
  type TransferRejectedPayload,
  type TransferRequest,
  type TransferRequestPayload
} from "@webdrop/shared";
import type { PeerService } from "../services/peerService.js";

export function registerTransferRequestHandlers(socket: Socket, peerService: PeerService): void {
  socket.on(SOCKET_EVENTS.TRANSFER_REQUEST, (payload: TransferRequestPayload) => {
    const fromPeer = peerService.getBySocketId(socket.id);
    const toPeer = peerService.getById(payload.toPeerId);

    if (!fromPeer || !toPeer) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: "The selected nearby device is no longer connected." });
      return;
    }

    const request: TransferRequest = {
      transferId: crypto.randomUUID(),
      fromPeerId: fromPeer.id,
      toPeerId: toPeer.id,
      file: payload.file
    };

    socket.to(toPeer.socketId).emit(SOCKET_EVENTS.TRANSFER_REQUEST, request);
  });

  socket.on(SOCKET_EVENTS.TRANSFER_ACCEPTED, (payload: TransferAcceptedPayload) => {
    const sender = peerService.getById(payload.fromPeerId);
    if (sender) socket.to(sender.socketId).emit(SOCKET_EVENTS.TRANSFER_ACCEPTED, payload);
  });

  socket.on(SOCKET_EVENTS.TRANSFER_REJECTED, (payload: TransferRejectedPayload) => {
    const sender = peerService.getById(payload.fromPeerId);
    if (sender) socket.to(sender.socketId).emit(SOCKET_EVENTS.TRANSFER_REJECTED, payload);
  });

  socket.on(SOCKET_EVENTS.TRANSFER_CANCELLED, (payload: TransferAcceptedPayload) => {
    const target = peerService.getById(payload.toPeerId);
    if (target) socket.to(target.socketId).emit(SOCKET_EVENTS.TRANSFER_CANCELLED, payload);
  });
}
