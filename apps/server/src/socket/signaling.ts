import type { Socket } from "socket.io";
import { SOCKET_EVENTS, type SignalPayload } from "@webdrop/shared";
import type { PeerService } from "../services/peerService.js";

export function registerSignalingHandlers(socket: Socket, peerService: PeerService): void {
  const forward = (eventName: string, payload: SignalPayload) => {
    const target = peerService.getById(payload.toPeerId);
    if (!target) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: "The signaling target is no longer connected." });
      return;
    }

    socket.to(target.socketId).emit(eventName, payload);
  };

  socket.on(SOCKET_EVENTS.WEBRTC_OFFER, (payload: SignalPayload) => forward(SOCKET_EVENTS.WEBRTC_OFFER, payload));
  socket.on(SOCKET_EVENTS.WEBRTC_ANSWER, (payload: SignalPayload) => forward(SOCKET_EVENTS.WEBRTC_ANSWER, payload));
  socket.on(SOCKET_EVENTS.WEBRTC_ICE_CANDIDATE, (payload: SignalPayload) =>
    forward(SOCKET_EVENTS.WEBRTC_ICE_CANDIDATE, payload)
  );
}
