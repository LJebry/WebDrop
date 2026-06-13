import { Radar, Wifi } from "lucide-react";

type FooterProps = {
  peerCount: number;
};

export function Footer({ peerCount }: FooterProps) {
  return (
    <footer className="shrink-0 px-1 pb-8 pt-4">
      <div className="surface-panel mx-auto flex w-full max-w-xl items-center justify-between gap-3 rounded-[2rem] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="organic-blob grid h-9 w-9 shrink-0 place-items-center bg-[#a8c09a]/35 text-[#5f8550]">
            <Radar className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <span className="block truncate text-xs font-semibold text-[#9a8268]">Looking for friends nearby</span>
            <div className="mt-1 flex items-center gap-1">
              <span className="bounce-1 h-1.5 w-1.5 rounded-full bg-[#7fa06c]" />
              <span className="bounce-2 h-1.5 w-1.5 rounded-full bg-[#7fa06c]" />
              <span className="bounce-3 h-1.5 w-1.5 rounded-full bg-[#7fa06c]" />
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-[20px] bg-[#fdeee4]/80 px-2.5 py-2">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#a8c09a]/35">
            <Wifi className="h-3 w-3 text-[#5f8550]" />
          </span>
          <span className="text-xs font-semibold text-[#9a8268]">{peerCount} nearby</span>
        </div>
      </div>
      <a
        href="https://www.buymeacoffee.com/jerry.robayo"
        target="_blank"
        rel="noreferrer"
        className="mx-auto mt-3 flex w-fit rounded-2xl transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#d97545] focus:ring-offset-2 focus:ring-offset-[#fdeee4]"
        aria-label="Buy me a coffee"
      >
        <img
          src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee%20%3A)&emoji=%E2%98%95&slug=jerry.robayo&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
          alt="Buy me a coffee"
          className="h-10 w-auto"
        />
      </a>
    </footer>
  );
}
