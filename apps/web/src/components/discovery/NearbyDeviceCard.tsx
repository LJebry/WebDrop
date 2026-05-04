import { Laptop, Monitor, Smartphone, Tablet } from "lucide-react";
import type { PublicPeer } from "@webdrop/shared";
import { cn } from "@/lib/utils";

type NearbyDeviceCardProps = {
  peer: PublicPeer;
  selected: boolean;
  onSelect: () => void;
  index: number;
};

const positions = [
  "left-[8%] top-[12%]",
  "right-[9%] top-[18%]",
  "left-[12%] bottom-[13%]",
  "right-[13%] bottom-[11%]",
  "left-1/2 top-[5%] -translate-x-1/2"
];

const blobs = ["organic-blob-alt", "organic-blob", "organic-blob-soft"];

export function NearbyDeviceCard({ peer, selected, onSelect, index }: NearbyDeviceCardProps) {
  const position = positions[index % positions.length];
  const blob = blobs[index % blobs.length];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "device-btn absolute flex flex-col items-center transition active:scale-90",
        position,
        index % 2 === 0 ? "float-1" : "float-2"
      )}
    >
      <span
        className={cn(
          "grid h-14 w-14 place-items-center border-2 bg-white text-[#5f8550] shadow-md shadow-[#a8c09a]/30",
          selected ? "border-[#d97545] ring-4 ring-[#e8915e]/25" : "border-[#a8c09a]/70",
          blob
        )}
      >
        {deviceIcon(index)}
      </span>
      <span className="mt-1.5 max-w-[88px] text-center">
        <span className="block truncate text-xs font-semibold leading-tight text-[#5e4e3c]">{peer.deviceName}</span>
        <span className="text-[10px] text-[#b09b82]">{selected ? "Selected" : "Nearby"}</span>
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
