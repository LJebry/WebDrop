"use client";

import { useDeviceStore } from "@/store/deviceStore";

export function useNearbyDevices() {
  const nearbyPeers = useDeviceStore((state) => state.nearbyPeers);
  const selectedPeerId = useDeviceStore((state) => state.selectedPeerId);
  const setSelectedPeerId = useDeviceStore((state) => state.setSelectedPeerId);
  const selectedPeer = nearbyPeers.find((peer) => peer.id === selectedPeerId) || null;

  return {
    nearbyPeers,
    selectedPeer,
    selectedPeerId,
    setSelectedPeerId
  };
}
