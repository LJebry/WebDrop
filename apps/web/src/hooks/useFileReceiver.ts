"use client";

import { useRef } from "react";
import type { FileMetadata } from "@webdrop/shared";
import { rebuildFile } from "@/lib/file";
import { useTransferStore } from "@/store/transferStore";

export function useFileReceiver() {
  const chunksRef = useRef<ArrayBuffer[]>([]);
  const metadataRef = useRef<FileMetadata | null>(null);
  const receivedBytesRef = useRef(0);
  const setProgress = useTransferStore((state) => state.setProgress);
  const setDownload = useTransferStore((state) => state.setDownload);
  const setTransferPhase = useTransferStore((state) => state.setTransferPhase);
  const setTransferError = useTransferStore((state) => state.setErrorMessage);

  function bindReceiverChannel(channel: RTCDataChannel) {
    channel.binaryType = "arraybuffer";
    chunksRef.current = [];
    metadataRef.current = null;
    receivedBytesRef.current = 0;
    setProgress(0);

    channel.onopen = () => setTransferPhase("transferring");
    channel.onerror = () => {
      const { transferPhase, progress } = useTransferStore.getState();
      if (transferPhase === "complete" || progress >= 100) return;
      setTransferPhase("failed");
      setTransferError("The WebRTC data channel failed.");
    };
    channel.onmessage = (event: MessageEvent<string | ArrayBuffer>) => {
      if (typeof event.data === "string") {
        handleControlMessage(event.data);
        return;
      }

      const metadata = metadataRef.current;
      if (!metadata) return;

      chunksRef.current.push(event.data);
      receivedBytesRef.current += event.data.byteLength;
      setProgress(Math.min(100, Math.round((receivedBytesRef.current / metadata.size) * 100)));
    };
  }

  function handleControlMessage(rawMessage: string) {
    const message = JSON.parse(rawMessage) as
      | { kind: "metadata"; file: FileMetadata }
      | { kind: "complete"; chunks: number };

    if (message.kind === "metadata") {
      metadataRef.current = message.file;
      setTransferPhase("transferring");
      return;
    }

    const metadata = metadataRef.current;
    if (!metadata) return;

    const blob = rebuildFile(chunksRef.current, metadata);
    setDownload({
      fileName: metadata.name,
      fileType: metadata.type,
      size: metadata.size,
      url: URL.createObjectURL(blob)
    });
    setProgress(100);
    setTransferPhase("complete");
  }

  return {
    bindReceiverChannel
  };
}
