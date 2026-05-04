"use client";

import { create } from "zustand";
import type { PublicPeer } from "@webdrop/shared";
import type { ConnectionStatus } from "@/types/device";

type DeviceState = {
  currentPeerId: string | null;
  deviceName: string;
  nearbyPeers: PublicPeer[];
  selectedPeerId: string | null;
  connectionStatus: ConnectionStatus;
  errorMessage: string | null;
  setCurrentPeerId: (peerId: string | null) => void;
  setDeviceName: (deviceName: string) => void;
  setNearbyPeers: (peers: PublicPeer[]) => void;
  setSelectedPeerId: (peerId: string | null) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setErrorMessage: (message: string | null) => void;
};

export const useDeviceStore = create<DeviceState>((set) => ({
  currentPeerId: null,
  deviceName: "",
  nearbyPeers: [],
  selectedPeerId: null,
  connectionStatus: "idle",
  errorMessage: null,
  setCurrentPeerId: (currentPeerId) => set({ currentPeerId }),
  setDeviceName: (deviceName) => set({ deviceName }),
  setNearbyPeers: (nearbyPeers) =>
    set((state) => ({
      nearbyPeers,
      selectedPeerId: nearbyPeers.some((peer) => peer.id === state.selectedPeerId) ? state.selectedPeerId : null
    })),
  setSelectedPeerId: (selectedPeerId) => set({ selectedPeerId }),
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  setErrorMessage: (errorMessage) => set({ errorMessage })
}));
