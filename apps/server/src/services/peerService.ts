import crypto from "node:crypto";
import type { Peer, PublicPeer } from "@webdrop/shared";

export class PeerService {
  private readonly peersById = new Map<string, Peer>();
  private readonly peerIdBySocketId = new Map<string, string>();

  createPeer(input: {
    socketId: string;
    deviceName: string;
    nearbyGroupId: string;
  }): Peer {
    const existingPeerId = this.peerIdBySocketId.get(input.socketId);
    if (existingPeerId) {
      this.removeBySocketId(input.socketId);
    }

    const peer: Peer = {
      id: crypto.randomUUID(),
      socketId: input.socketId,
      deviceName: input.deviceName,
      nearbyGroupId: input.nearbyGroupId,
      connectedAt: Date.now()
    };

    this.peersById.set(peer.id, peer);
    this.peerIdBySocketId.set(peer.socketId, peer.id);
    return peer;
  }

  getById(peerId: string): Peer | undefined {
    return this.peersById.get(peerId);
  }

  getBySocketId(socketId: string): Peer | undefined {
    const peerId = this.peerIdBySocketId.get(socketId);
    return peerId ? this.peersById.get(peerId) : undefined;
  }

  listInternalByNearbyGroup(nearbyGroupId: string): Peer[] {
    return [...this.peersById.values()].filter((peer) => peer.nearbyGroupId === nearbyGroupId);
  }

  listByNearbyGroup(nearbyGroupId: string): PublicPeer[] {
    return [...this.peersById.values()]
      .filter((peer) => peer.nearbyGroupId === nearbyGroupId)
      .sort((a, b) => a.connectedAt - b.connectedAt)
      .map((peer) => ({
        id: peer.id,
        deviceName: peer.deviceName,
        connectedAt: peer.connectedAt
      }));
  }

  removeBySocketId(socketId: string): Peer | undefined {
    const peer = this.getBySocketId(socketId);
    if (!peer) return undefined;

    this.peersById.delete(peer.id);
    this.peerIdBySocketId.delete(socketId);
    return peer;
  }

  removeById(peerId: string): Peer | undefined {
    const peer = this.peersById.get(peerId);
    if (!peer) return undefined;

    this.peersById.delete(peer.id);
    this.peerIdBySocketId.delete(peer.socketId);
    return peer;
  }
}
