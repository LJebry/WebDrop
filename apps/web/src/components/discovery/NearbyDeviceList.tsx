import type { PublicPeer } from "@webdrop/shared";
import { Search } from "lucide-react";
import { NearbyDeviceCard } from "./NearbyDeviceCard";

type NearbyDeviceListProps = {
  peers: PublicPeer[];
  selectedPeerId: string | null;
  onSelect: (peerId: string) => void;
};

export function NearbyDeviceList({ peers, selectedPeerId, onSelect }: NearbyDeviceListProps) {
  return (
    <div className="grid gap-3">
      {peers.length ? (
        peers.map((peer, index) => (
          <NearbyDeviceCard
            key={peer.id}
            peer={peer}
            index={index}
            selected={peer.id === selectedPeerId}
            onSelect={() => onSelect(peer.id)}
          />
        ))
      ) : (
        <div className="flex min-h-28 items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/25 p-5 text-center">
          <Search className="h-5 w-5 text-slate-500" />
          <p className="text-sm font-semibold text-slate-400">No nearby devices found yet.</p>
        </div>
      )}
    </div>
  );
}
