import type { PublicPeer } from "@webdrop/shared";
import { UserRound } from "lucide-react";
import { NearbyDeviceCard } from "./NearbyDeviceCard";

type NearbyDeviceListProps = {
  peers: PublicPeer[];
  selectedPeerId: string | null;
  onSelect: (peerId: string) => void;
};

export function NearbyDeviceList({ peers, selectedPeerId, onSelect }: NearbyDeviceListProps) {
  return (
    <div className="relative h-[310px] overflow-hidden rounded-3xl bg-white/45 shadow-inner">
      <span className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#edd5a8]/70" />
      <span className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#edd5a8]/50" />
      <span className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e8915e]/20 organic-pulse" />
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <div className="organic-blob-soft breathe grid h-20 w-20 place-items-center bg-[#e8915e] text-white shadow-lg shadow-[#e8915e]/25">
          <UserRound className="h-8 w-8" />
        </div>
        <span className="mt-2 text-xs font-semibold text-[#5e4e3c]">You</span>
      </div>

      {peers.length ? (
        peers.slice(0, 5).map((peer, index) => (
          <NearbyDeviceCard
            key={peer.id}
            peer={peer}
            index={index}
            selected={peer.id === selectedPeerId}
            onSelect={() => onSelect(peer.id)}
          />
        ))
      ) : (
        <div className="absolute inset-x-8 bottom-7 rounded-2xl bg-white/60 p-3 text-center text-xs font-semibold text-[#b09b82]">
          No nearby devices found yet.
        </div>
      )}
    </div>
  );
}
