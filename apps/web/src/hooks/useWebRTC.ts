"use client";

import { useCallback, useEffect, useRef, type MutableRefObject } from "react";
import type { Socket } from "socket.io-client";
import { SOCKET_EVENTS, type SignalPayload } from "@webdrop/shared";
import { createFileDataChannel, createPeerConnection } from "@/lib/webrtc";
import { useDeviceStore } from "@/store/deviceStore";
import { useTransferStore } from "@/store/transferStore";

type UseWebRTCOptions = {
  onSenderChannelOpen: (channel: RTCDataChannel) => void;
  onReceiverChannel: (channel: RTCDataChannel) => void;
};

export function useWebRTC(socketRef: MutableRefObject<Socket | null>, options: UseWebRTCOptions) {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const optionsRef = useRef(options);
  const currentPeerId = useDeviceStore((state) => state.currentPeerId);
  const connectionStatus = useDeviceStore((state) => state.connectionStatus);
  const setTransferPhase = useTransferStore((state) => state.setTransferPhase);
  const setTransferError = useTransferStore((state) => state.setErrorMessage);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const cleanup = useCallback(() => {
    dataChannelRef.current?.close();
    peerConnectionRef.current?.close();
    dataChannelRef.current = null;
    peerConnectionRef.current = null;
  }, []);

  const createConnection = useCallback(
    (targetPeerId: string) => {
      if (!socketRef.current || !currentPeerId) return null;

      cleanup();
      const peerConnection = createPeerConnection();
      peerConnectionRef.current = peerConnection;

      peerConnection.onicecandidate = (event) => {
        if (!event.candidate || !socketRef.current) return;
        socketRef.current.emit(SOCKET_EVENTS.WEBRTC_ICE_CANDIDATE, {
          fromPeerId: currentPeerId,
          toPeerId: targetPeerId,
          signal: event.candidate
        });
      };

      peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === "failed" || peerConnection.connectionState === "disconnected") {
          if (!shouldReportTransferFailure()) return;
          setTransferPhase("failed");
          setTransferError("The WebRTC connection failed.");
        }
      };

      return peerConnection;
    },
    [cleanup, currentPeerId, setTransferError, setTransferPhase, socketRef]
  );

  const startSenderConnection = useCallback(
    async (targetPeerId: string) => {
      if (!socketRef.current || !currentPeerId) return;

      const peerConnection = createConnection(targetPeerId);
      if (!peerConnection) return;

      const channel = createFileDataChannel(peerConnection);
      dataChannelRef.current = channel;
      channel.onopen = () => optionsRef.current.onSenderChannelOpen(channel);
      channel.onerror = () => {
        if (!shouldReportTransferFailure()) return;
        setTransferPhase("failed");
        setTransferError("The data channel failed before the transfer completed.");
      };
      channel.onclose = () => {
        if (shouldReportTransferFailure()) {
          setTransferPhase("failed");
          setTransferError("The data channel closed before the transfer completed.");
        }
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socketRef.current.emit(SOCKET_EVENTS.WEBRTC_OFFER, {
        fromPeerId: currentPeerId,
        toPeerId: targetPeerId,
        signal: offer
      });
    },
    [createConnection, currentPeerId, setTransferError, setTransferPhase, socketRef]
  );

  const handleOffer = useCallback(
    async (payload: SignalPayload) => {
      if (!socketRef.current || !currentPeerId) return;

      const peerConnection = createConnection(payload.fromPeerId);
      if (!peerConnection) return;

      peerConnection.ondatachannel = (event) => {
        dataChannelRef.current = event.channel;
        optionsRef.current.onReceiverChannel(event.channel);
      };

      await peerConnection.setRemoteDescription(payload.signal as RTCSessionDescriptionInit);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socketRef.current.emit(SOCKET_EVENTS.WEBRTC_ANSWER, {
        fromPeerId: currentPeerId,
        toPeerId: payload.fromPeerId,
        signal: answer
      });
    },
    [createConnection, currentPeerId, socketRef]
  );

  const handleAnswer = useCallback(async (payload: SignalPayload) => {
    const peerConnection = peerConnectionRef.current;
    if (!peerConnection) return;
    await peerConnection.setRemoteDescription(payload.signal as RTCSessionDescriptionInit);
  }, []);

  const handleIceCandidate = useCallback(async (payload: SignalPayload) => {
    const peerConnection = peerConnectionRef.current;
    if (!peerConnection) return;
    await peerConnection.addIceCandidate(payload.signal as RTCIceCandidateInit);
  }, []);

  useEffect(() => {
    if (connectionStatus !== "connected") return;

    const socket = socketRef.current;
    if (!socket) return;

    socket.on(SOCKET_EVENTS.WEBRTC_OFFER, handleOffer);
    socket.on(SOCKET_EVENTS.WEBRTC_ANSWER, handleAnswer);
    socket.on(SOCKET_EVENTS.WEBRTC_ICE_CANDIDATE, handleIceCandidate);

    return () => {
      socket.off(SOCKET_EVENTS.WEBRTC_OFFER, handleOffer);
      socket.off(SOCKET_EVENTS.WEBRTC_ANSWER, handleAnswer);
      socket.off(SOCKET_EVENTS.WEBRTC_ICE_CANDIDATE, handleIceCandidate);
      cleanup();
    };
  }, [cleanup, connectionStatus, handleAnswer, handleIceCandidate, handleOffer, socketRef]);

  return {
    startSenderConnection,
    cleanup
  };
}

function shouldReportTransferFailure() {
  const { transferPhase, progress } = useTransferStore.getState();
  return (transferPhase === "connecting" || transferPhase === "transferring") && progress < 100;
}
