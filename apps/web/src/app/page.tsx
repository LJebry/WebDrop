"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SOCKET_EVENTS } from "@webdrop/shared";
import { CloudOff, Laptop, Radar, ShieldCheck, Smartphone } from "lucide-react";
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
  const [showWakeHint, setShowWakeHint] = useState(false);
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
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 sm:px-6">
      <Header />

      <section className="grid flex-1 content-start gap-4 pb-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <section className="surface-panel overflow-hidden rounded-[2.25rem] p-5 sm:p-7">
            <div className="flex h-full flex-col justify-between gap-7">
              <Badge variant="secondary" className="gap-2 bg-white/60">
                <Radar className="h-3.5 w-3.5" />
                Nearby sharing
              </Badge>
              <div className="grid gap-3">
                <h1 className="font-display max-w-2xl text-3xl font-bold leading-[0.95] tracking-tight text-[#453a2d] sm:text-5xl">
                  Drop a file. Pick a device. Stay peer-to-peer.
                </h1>
                <p className="max-w-2xl text-sm font-semibold leading-6 text-[#7a6750] sm:text-base">
                  WebDrop finds nearby browsers automatically, asks before receiving, then moves chunks directly
                  between devices.
                </p>
              </div>
              <div className="grid gap-2 text-sm font-semibold text-[#7a6750] sm:grid-cols-3">
                <FeaturePill icon={<Laptop className="h-4 w-4" />} label="Computers" />
                <FeaturePill icon={<Smartphone className="h-4 w-4" />} label="Phones" />
                <FeaturePill icon={<ShieldCheck className="h-4 w-4" />} label="No server uploads" />
              </div>
            </div>
          </section>

          <section className="surface-panel rounded-[2.25rem] p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-base font-bold tracking-tight text-[#453a2d]">This device</h2>
                <p className="mt-1 text-sm font-medium text-[#9a8268]">Shown to nearby browsers.</p>
              </div>
              <span className="organic-blob grid h-11 w-11 shrink-0 place-items-center bg-[#fbd9c4] text-[#d97545]">
                <Radar className="h-5 w-5" />
              </span>
            </div>
            <DeviceNameForm initialName={initialName} onSave={saveDeviceName} />
          </section>
        </div>

        <DiscoveryStatus
          status={connectionStatus}
          peerCount={nearbyPeers.length}
          errorMessage={discoveryError}
          showWakeHint={showWakeHint}
        />

        <div className="grid gap-4 lg:grid-cols-[410px_minmax(0,1fr)]">
          <Card className="h-fit overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>Nearby devices</CardTitle>
              <CardDescription>Tap a device to choose where the file should go.</CardDescription>
            </CardHeader>
            <CardContent>
              <NearbyDeviceList peers={nearbyPeers} selectedPeerId={selectedPeerId} onSelect={setSelectedPeerId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Send a file</CardTitle>
                <CardDescription>
                  {selectedPeer ? `Ready to ask ${selectedPeer.deviceName} to receive.` : "Select a nearby device first."}
                </CardDescription>
              </div>
              {selectedPeer ? <Badge>{selectedPeer.deviceName}</Badge> : <Badge variant="secondary">No device selected</Badge>}
            </CardHeader>
            <CardContent className="grid gap-5">
              <DropZone onFileSelected={chooseFile} />
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <FilePreview file={selectedFileMetadata} />
                <Button
                  type="button"
                  className="w-full md:w-auto"
                  disabled={!selectedPeer || !selectedFileMetadata}
                  onClick={sendTransferRequest}
                >
                  Send request
                </Button>
              </div>
              <Separator />
              <div className="flex items-start gap-2 rounded-3xl bg-[#fdeee4]/70 p-3 text-sm font-semibold text-[#9a8268]">
                <CloudOff className="mt-0.5 h-4 w-4 shrink-0 text-[#5f8550]" />
                <p>Receiver approval is required before WebRTC starts. File bytes do not go through the server.</p>
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

function FeaturePill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="soft-shell inline-flex items-center gap-2 rounded-2xl px-3 py-2">
      <span className="text-[#d97545]">{icon}</span>
      {label}
    </span>
  );
}
