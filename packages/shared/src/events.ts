export const SOCKET_EVENTS = {
  DISCOVERY_JOIN: "discovery:join",
  DISCOVERY_LEAVE: "discovery:leave",
  DISCOVERY_PEERS_UPDATED: "discovery:peers-updated",

  TRANSFER_REQUEST: "transfer:request",
  TRANSFER_ACCEPTED: "transfer:accepted",
  TRANSFER_REJECTED: "transfer:rejected",
  TRANSFER_CANCELLED: "transfer:cancelled",

  WEBRTC_OFFER: "webrtc:offer",
  WEBRTC_ANSWER: "webrtc:answer",
  WEBRTC_ICE_CANDIDATE: "webrtc:ice-candidate",

  PEER_DISCONNECTED: "peer:disconnected",
  ERROR: "error"
} as const;

export type SocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
