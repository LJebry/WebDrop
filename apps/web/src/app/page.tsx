"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_FILE_SIZE_BYTES, SOCKET_EVENTS } from "@webdrop/shared";
import { CloudOff, HardDrive, Pencil, Send, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DeviceNameForm } from "@/components/discovery/DeviceNameForm";
import { DiscoveryStatus } from "@/components/discovery/DiscoveryStatus";
import { NearbyDeviceList } from "@/components/discovery/NearbyDeviceList";
import { DropZone } from "@/components/transfer/DropZone";
import { FilePreview } from "@/components/transfer/FilePreview";
import { SendRequestDialog } from "@/components/transfer/SendRequestDialog";
import { ReceiveRequestDialog } from "@/components/transfer/ReceiveRequestDialog";
import { TransferProgress } from "@/components/transfer/TransferProgress";
import { createDefaultDeviceName } from "@/lib/device";
import { formatBytes } from "@/lib/transfer";
import { useNearbyDevices } from "@/hooks/useNearbyDevices";
import { useSocket } from "@/hooks/useSocket";
import { useFileSender } from "@/hooks/useFileSender";
import { useFileReceiver } from "@/hooks/useFileReceiver";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useDeviceStore } from "@/store/deviceStore";
import { useTransferStore } from "@/store/transferStore";

export default function HomePage() {
  const [initialName, setInitialName] = useState("Browser Device");
  const [showWakeHint, setShowWakeHint] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const startedTransferRef = useRef<string | null>(null);
  const socketRef = useSocket();

  const deviceName = useDeviceStore((state) => state.deviceName);
  const setDeviceName = useDeviceStore((state) => state.setDeviceName);
  const connectionStatus = useDeviceStore((state) => state.connectionStatus);
  const discoveryError = useDeviceStore((state) => state.errorMessage);
  const { nearbyPeers, selectedPeer, selectedPeerId, setSelectedPeerId } = useNearbyDevices();

  const selectedFileMetadata = useTransferStore((state) => state.selectedFileMetadata);
  const transferPhase = useTransferStore((state) => state.transferPhase);
  const progress = useTransferStore((state) => state.progress);
  const download = useTransferStore((state) => state.download);
  const incomingRequest = useTransferStore((state) => state.incomingRequest);
  const outgoingRequest = useTransferStore((state) => state.outgoingRequest);
  const activeTransferId = useTransferStore((state) => state.activeTransferId);
  const transferError = useTransferStore((state) => state.errorMessage);
  const setIncomingRequest = useTransferStore((state) => state.setIncomingRequest);
  const setTransferPhase = useTransferStore((state) => state.setTransferPhase);
  const resetTransfer = useTransferStore((state) => state.resetTransfer);

  const { chooseFile, sendTransferRequest, sendSelectedFile } = useFileSender(socketRef);
  const { bindReceiverChannel } = useFileReceiver();
  const { startSenderConnection } = useWebRTC(socketRef, {
    onSenderChannelOpen: (channel) => {
      void sendSelectedFile(channel);
    },
    onReceiverChannel: bindReceiverChannel
  });

  useEffect(() => {
    const savedName = localStorage.getItem("webdrop:device-name") || createDefaultDeviceName();
    setInitialName(savedName);
    setDeviceName(savedName);
  }, [setDeviceName]);

  useEffect(() => {
    if (transferPhase !== "connecting" || !outgoingRequest || !selectedPeerId || !activeTransferId) return;
    if (startedTransferRef.current === activeTransferId) return;

    startedTransferRef.current = activeTransferId;
    void startSenderConnection(selectedPeerId);
  }, [activeTransferId, outgoingRequest, selectedPeerId, startSenderConnection, transferPhase]);

  useEffect(() => {
    if (connectionStatus !== "connecting") {
      setShowWakeHint(false);
      return;
    }

    const timer = window.setTimeout(() => setShowWakeHint(true), 6000);
    return () => window.clearTimeout(timer);
  }, [connectionStatus]);

  function saveDeviceName(nextName: string) {
    localStorage.setItem("webdrop:device-name", nextName);
    setDeviceName(nextName);
    setIsRenaming(false);
  }

  function acceptIncomingRequest() {
    if (!incomingRequest || !socketRef.current) return;

    socketRef.current.emit(SOCKET_EVENTS.TRANSFER_ACCEPTED, {
      transferId: incomingRequest.transferId,
      fromPeerId: incomingRequest.fromPeerId,
      toPeerId: incomingRequest.toPeerId
    });
    setIncomingRequest(null);
    setTransferPhase("connecting");
  }

  function rejectIncomingRequest() {
    if (!incomingRequest || !socketRef.current) return;

    socketRef.current.emit(SOCKET_EVENTS.TRANSFER_REJECTED, {
      transferId: incomingRequest.transferId,
      fromPeerId: incomingRequest.fromPeerId,
      toPeerId: incomingRequest.toPeerId,
      reason: "The receiver rejected the transfer request."
    });
    resetTransfer();
  }

  return (
    <main className="min-h-screen bg-[#111827] text-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 sm:px-8">
        <Header />

        <section className="flex flex-1 flex-col items-center pb-6 pt-7 sm:pt-12">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/55 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.16)]">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#3f8f86]/15 text-[#62b7ad]">
                  <UserRound className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-500">You are</p>
                  <h1 className="truncate text-2xl font-bold tracking-tight text-white">{deviceName || initialName}</h1>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <div className="rounded-xl bg-slate-950/45 px-3 py-2 text-right">
                  <p className="text-[11px] font-semibold text-slate-500">File limit</p>
                  <p className="text-sm font-bold text-slate-100">{formatBytes(MAX_FILE_SIZE_BYTES)}</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsRenaming((value) => !value)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Rename
                </Button>
              </div>
            </div>

            {isRenaming ? (
              <div className="mt-4 border-t border-slate-800 pt-4">
                <DeviceNameForm initialName={initialName} onSave={saveDeviceName} />
              </div>
            ) : null}
          </div>

          <div className="mt-5 w-full">
            <DiscoveryStatus
              status={connectionStatus}
              peerCount={nearbyPeers.length}
              errorMessage={discoveryError}
              showWakeHint={showWakeHint}
            />
          </div>

          <section className="mt-8 w-full max-w-2xl">
            <NearbyDeviceList peers={nearbyPeers} selectedPeerId={selectedPeerId} onSelect={setSelectedPeerId} />
          </section>

          <section className="mt-6 grid w-full max-w-2xl gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">Send a file</h2>
                <p className="mt-1 text-sm font-semibold text-slate-400">
                  {selectedPeer ? `Ready to ask ${selectedPeer.deviceName} to receive.` : "Select a nearby device first."}
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-950/45 px-3 py-2 text-xs font-bold text-slate-300">
                <HardDrive className="h-3.5 w-3.5 text-[#62b7ad]" />
                Peer-to-peer
              </span>
            </div>

            <DropZone onFileSelected={chooseFile} />
            <FilePreview file={selectedFileMetadata} />

            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex items-start gap-2 rounded-xl bg-slate-950/35 p-3 text-sm font-semibold text-slate-400">
                <CloudOff className="mt-0.5 h-4 w-4 shrink-0 text-[#62b7ad]" />
                <p>Receiver approval is required. File bytes do not go through the server.</p>
              </div>
              <Button type="button" disabled={!selectedPeer || !selectedFileMetadata} onClick={sendTransferRequest}>
                <Send className="h-4 w-4" />
                Send request
              </Button>
            </div>

            <TransferProgress phase={transferPhase} progress={progress} download={download} errorMessage={transferError} />
          </section>
        </section>

        <SendRequestDialog
          open={transferPhase === "requesting"}
          deviceName={selectedPeer?.deviceName || "the receiver"}
          onCancel={resetTransfer}
        />
        <ReceiveRequestDialog
          open={transferPhase === "incoming"}
          request={incomingRequest}
          onAccept={acceptIncomingRequest}
          onReject={rejectIncomingRequest}
        />

        <Footer peerCount={nearbyPeers.length} />
      </div>
    </main>
  );
}
