import { Laptop, Monitor, Smartphone, Tablet } from "lucide-react";
import type { PublicPeer } from "@webdrop/shared";
import { cn } from "@/lib/utils";

type NearbyDeviceCardProps = {
  peer: PublicPeer;
  selected: boolean;
  onSelect: () => void;
  index: number;
};

export function NearbyDeviceCard({ peer, selected, onSelect, index }: NearbyDeviceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-[background-color,border-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.99]",
        selected
          ? "border-[#62b7ad] bg-[#3f8f86] text-white shadow-lg shadow-[#3f8f86]/15"
          : "border-[#3f8f86]/45 bg-[#3d8179] text-white hover:bg-[#438d84]"
      )}
    >
      <span
        className={cn(
          "grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-[#3f8f86]",
          selected ? "ring-4 ring-white/15" : "group-hover:ring-4 group-hover:ring-white/10"
        )}
      >
        {deviceIcon(index)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-lg font-bold leading-tight">{peer.deviceName}</span>
        <span className="mt-1 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-black/18 px-2 py-0.5 text-xs font-semibold text-white/90">Browser</span>
          <span className="rounded-md bg-black/18 px-2 py-0.5 text-xs font-semibold text-white/90">WebRTC</span>
          {selected ? <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold text-white">Selected</span> : null}
        </span>
      </span>
    </button>
  );
}

function deviceIcon(index: number) {
  const className = "h-6 w-6";
  const icons = [
    <Smartphone key="phone" className={className} />,
    <Laptop key="laptop" className={className} />,
    <Monitor key="monitor" className={className} />,
    <Tablet key="tablet" className={className} />
  ];

  return icons[index % icons.length];
}
