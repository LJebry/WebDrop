"use client";

import { useEffect, useRef, useState } from "react";
import { SOCKET_EVENTS } from "@webdrop/shared";
import { Laptop, Leaf, Radar, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";
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
import { useNearbyDevices } from "@/hooks/useNearbyDevices";
import { useSocket } from "@/hooks/useSocket";
import { useFileSender } from "@/hooks/useFileSender";
import { useFileReceiver } from "@/hooks/useFileReceiver";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useDeviceStore } from "@/store/deviceStore";
import { useTransferStore } from "@/store/transferStore";

export default function HomePage() {
  const [initialName, setInitialName] = useState("Browser Device");
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

  function saveDeviceName(nextName: string) {
    localStorage.setItem("webdrop:device-name", nextName);
    setDeviceName(nextName);
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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5">
      <Header />

      <section className="grid flex-1 gap-3.5">
        <Card className="overflow-hidden">
          <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr_380px] lg:items-center">
            <div className="space-y-3">
              <Badge variant="secondary" className="gap-2">
                <Radar className="h-3.5 w-3.5" />
                Nearby sharing
              </Badge>
              <div className="space-y-2">
                <h2 className="font-display max-w-2xl text-xl font-bold tracking-tight text-[#453a2d] sm:text-3xl">
                  Send files to friends nearby.
                </h2>
                <p className="max-w-2xl text-sm font-semibold leading-6 text-[#9a8268]">
                  WebDrop finds nearby browsers, asks before receiving, then moves chunks directly from one
                  browser to another.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm font-semibold text-[#9a8268]">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-white/60 px-3 py-1.5 shadow-sm">
                  <Laptop className="h-4 w-4 text-[#d97545]" />
                  Computers
                </span>
                <span className="inline-flex items-center gap-2 rounded-2xl bg-white/60 px-3 py-1.5 shadow-sm">
                  <Smartphone className="h-4 w-4 text-[#5f8550]" />
                  Phones
                </span>
                <span className="inline-flex items-center gap-2 rounded-2xl bg-white/60 px-3 py-1.5 shadow-sm">
                  <Leaf className="h-4 w-4 text-[#7fa06c]" />
                  Direct transfer
                </span>
              </div>
            </div>
            <Card className="bg-white/50">
              <CardHeader>
                <CardTitle>This device</CardTitle>
                <CardDescription>Confirm the name other nearby devices will see.</CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceNameForm initialName={initialName} onSave={saveDeviceName} />
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <DiscoveryStatus status={connectionStatus} peerCount={nearbyPeers.length} errorMessage={discoveryError} />

        <div className="grid gap-3.5 lg:grid-cols-[390px_1fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Nearby devices</CardTitle>
              <CardDescription>Tap a floating friend to select where the file should go.</CardDescription>
            </CardHeader>
            <CardContent>
              <NearbyDeviceList peers={nearbyPeers} selectedPeerId={selectedPeerId} onSelect={setSelectedPeerId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Sharing menu</CardTitle>
                <CardDescription>
                  {selectedPeer ? `Ready to ask ${selectedPeer.deviceName} to receive.` : "Select a nearby device first."}
                </CardDescription>
              </div>
              {selectedPeer ? <Badge>{selectedPeer.deviceName}</Badge> : <Badge variant="secondary">No device selected</Badge>}
            </CardHeader>
            <CardContent className="grid gap-5">
              <DropZone onFileSelected={chooseFile} />
              <FilePreview file={selectedFileMetadata} />
              <Separator />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-[#b09b82]">
                  Receiver approval is required before WebRTC starts.
                </p>
                <Button type="button" disabled={!selectedPeer || !selectedFileMetadata} onClick={sendTransferRequest}>
                  Send transfer request
                </Button>
              </div>
              <TransferProgress phase={transferPhase} progress={progress} download={download} errorMessage={transferError} />
            </CardContent>
          </Card>
        </div>
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
    </main>
  );
}
