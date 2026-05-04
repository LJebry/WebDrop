"use client";

import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import {
  SOCKET_EVENTS,
  type DiscoveryJoinResponse,
  type PublicPeer,
  type SocketErrorPayload,
  type TransferAcceptedPayload,
  type TransferRejectedPayload,
  type TransferRequest
} from "@webdrop/shared";
import { createSocket } from "@/lib/socket";
import { useDeviceStore } from "@/store/deviceStore";
import { useTransferStore } from "@/store/transferStore";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const deviceName = useDeviceStore((state) => state.deviceName);
  const setConnectionStatus = useDeviceStore((state) => state.setConnectionStatus);
  const setCurrentPeerId = useDeviceStore((state) => state.setCurrentPeerId);
  const setNearbyPeers = useDeviceStore((state) => state.setNearbyPeers);
  const setDeviceError = useDeviceStore((state) => state.setErrorMessage);
  const setIncomingRequest = useTransferStore((state) => state.setIncomingRequest);
  const setOutgoingRequest = useTransferStore((state) => state.setOutgoingRequest);
  const setActiveTransferId = useTransferStore((state) => state.setActiveTransferId);
  const setTransferPhase = useTransferStore((state) => state.setTransferPhase);
  const setTransferError = useTransferStore((state) => state.setErrorMessage);

  useEffect(() => {
    if (!deviceName) return;

    const socket = createSocket();
    socketRef.current = socket;
    setConnectionStatus("connecting");

    socket.on("connect", () => {
      socket.emit(SOCKET_EVENTS.DISCOVERY_JOIN, { deviceName }, (response: DiscoveryJoinResponse) => {
        setCurrentPeerId(response.peer.id);
        setNearbyPeers(filterSelf(response.peers, response.peer.id));
        setConnectionStatus("connected");
        setDeviceError(null);
      });
    });

    socket.on("connect_error", () => {
      setConnectionStatus("error");
      setDeviceError("Could not connect to the signaling server.");
    });

    socket.on(SOCKET_EVENTS.DISCOVERY_PEERS_UPDATED, (peers: PublicPeer[]) => {
      const currentPeerId = useDeviceStore.getState().currentPeerId;
      setNearbyPeers(currentPeerId ? filterSelf(peers, currentPeerId) : peers);
    });

    socket.on(SOCKET_EVENTS.TRANSFER_REQUEST, (request: TransferRequest) => {
      setIncomingRequest(request);
      setActiveTransferId(request.transferId);
      setTransferPhase("incoming");
    });

    socket.on(SOCKET_EVENTS.TRANSFER_ACCEPTED, (payload: TransferAcceptedPayload) => {
      setActiveTransferId(payload.transferId);
      setTransferPhase("connecting");
      setTransferError(null);
    });

    socket.on(SOCKET_EVENTS.TRANSFER_REJECTED, (payload: TransferRejectedPayload) => {
      setTransferPhase("rejected");
      setTransferError(payload.reason || "The receiver rejected the transfer request.");
      setOutgoingRequest(null);
    });

    socket.on(SOCKET_EVENTS.ERROR, (payload: SocketErrorPayload) => {
      setTransferError(payload.message);
    });

    socket.connect();

    return () => {
      socket.emit(SOCKET_EVENTS.DISCOVERY_LEAVE);
      socket.disconnect();
      socketRef.current = null;
      setConnectionStatus("idle");
      setCurrentPeerId(null);
      setNearbyPeers([]);
    };
  }, [
    deviceName,
    setActiveTransferId,
    setConnectionStatus,
    setCurrentPeerId,
    setDeviceError,
    setIncomingRequest,
    setNearbyPeers,
    setOutgoingRequest,
    setTransferError,
    setTransferPhase
  ]);

  return socketRef;
}

function filterSelf(peers: PublicPeer[], currentPeerId: string) {
  return peers.filter((peer) => peer.id !== currentPeerId);
}
