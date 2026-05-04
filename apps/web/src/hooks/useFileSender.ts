"use client";

import type { MutableRefObject } from "react";
import type { Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "@webdrop/shared";
import { sendFileChunks } from "@/lib/file";
import { createFileMetadata } from "@/lib/transfer";
import { useDeviceStore } from "@/store/deviceStore";
import { useTransferStore } from "@/store/transferStore";

export function useFileSender(socketRef: MutableRefObject<Socket | null>) {
  const currentPeerId = useDeviceStore((state) => state.currentPeerId);
  const selectedPeerId = useDeviceStore((state) => state.selectedPeerId);
  const selectedFile = useTransferStore((state) => state.selectedFile);
  const selectedFileMetadata = useTransferStore((state) => state.selectedFileMetadata);
  const setSelectedFile = useTransferStore((state) => state.setSelectedFile);
  const setOutgoingRequest = useTransferStore((state) => state.setOutgoingRequest);
  const setTransferPhase = useTransferStore((state) => state.setTransferPhase);
  const setProgress = useTransferStore((state) => state.setProgress);
  const setTransferError = useTransferStore((state) => state.setErrorMessage);

  function chooseFile(file: File | null) {
    setSelectedFile(file, file ? createFileMetadata(file) : null);
    setProgress(0);
    setTransferError(null);
  }

  function sendTransferRequest() {
    if (!socketRef.current || !currentPeerId || !selectedPeerId || !selectedFileMetadata) return;

    setTransferPhase("requesting");
    socketRef.current.emit(SOCKET_EVENTS.TRANSFER_REQUEST, {
      toPeerId: selectedPeerId,
      file: selectedFileMetadata
    });

    setOutgoingRequest({
      transferId: "pending",
      fromPeerId: currentPeerId,
      toPeerId: selectedPeerId,
      file: selectedFileMetadata
    });
  }

  async function sendSelectedFile(channel: RTCDataChannel) {
    if (!selectedFile || !selectedFileMetadata) return;

    try {
      setTransferPhase("transferring");
      await sendFileChunks({
        file: selectedFile,
        fileMetadata: selectedFileMetadata,
        channel,
        onProgress: (sentBytes) => setProgress(Math.round((sentBytes / selectedFile.size) * 100))
      });
      setTransferPhase("complete");
    } catch (error) {
      setTransferPhase("failed");
      setTransferError(error instanceof Error ? error.message : "The file transfer failed.");
    }
  }

  return {
    chooseFile,
    sendTransferRequest,
    sendSelectedFile
  };
}
