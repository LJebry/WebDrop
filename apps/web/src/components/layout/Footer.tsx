import { Radar, Wifi } from "lucide-react";

type FooterProps = {
  peerCount: number;
};

export function Footer({ peerCount }: FooterProps) {
  return (
    <footer className="shrink-0 pb-8 pt-4">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/45 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#3f8f86]/15 text-[#62b7ad]">
            <Radar className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <span className="block truncate text-xs font-semibold text-slate-400">Looking for nearby devices</span>
            <div className="mt-1 flex items-center gap-1">
              <span className="bounce-1 h-1.5 w-1.5 rounded-full bg-[#62b7ad]" />
              <span className="bounce-2 h-1.5 w-1.5 rounded-full bg-[#62b7ad]" />
              <span className="bounce-3 h-1.5 w-1.5 rounded-full bg-[#62b7ad]" />
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-950/45 px-2.5 py-2">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#3f8f86]/15">
            <Wifi className="h-3 w-3 text-[#62b7ad]" />
          </span>
          <span className="text-xs font-semibold text-slate-300">{peerCount} nearby</span>
        </div>
      </div>
    </footer>
  );
}
