export type Peer = {
  id: string;
  socketId: string;
  deviceName: string;
  nearbyGroupId: string;
  connectedAt: number;
};

export type PublicPeer = {
  id: string;
  deviceName: string;
  connectedAt: number;
};

export type FileMetadata = {
  id: string;
  name: string;
  size: number;
  type: string;
  totalChunks: number;
};

export type TransferRequest = {
  transferId: string;
  fromPeerId: string;
  toPeerId: string;
  file: FileMetadata;
};

export type SignalPayload = {
  fromPeerId: string;
  toPeerId: string;
  signal: unknown;
};

export type DiscoveryJoinPayload = {
  deviceName: string;
};

export type DiscoveryJoinResponse = {
  peer: PublicPeer;
  peers: PublicPeer[];
};

export type TransferAcceptedPayload = {
  transferId: string;
  fromPeerId: string;
  toPeerId: string;
};

export type TransferRejectedPayload = TransferAcceptedPayload & {
  reason?: string;
};

export type TransferRequestPayload = {
  toPeerId: string;
  file: FileMetadata;
};

export type SocketErrorPayload = {
  message: string;
};
