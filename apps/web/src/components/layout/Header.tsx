import { Bell, Ellipsis, Send } from "lucide-react";

export function Header() {
  return (
    <header className="relative z-10 flex shrink-0 items-center justify-between px-1 pb-2 pt-6 sm:pt-8">
      <div className="flex items-center gap-2.5">
        <span className="organic-blob-soft breathe grid h-10 w-10 place-items-center bg-primary text-primary-foreground shadow-md shadow-[#e8915e]/20">
          <Send className="h-5 w-5 -rotate-12" />
        </span>
        <span className="font-display text-xl font-bold tracking-tight text-[#453a2d]">WebDrop</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-2xl bg-[#fbd9c4] text-[#b09b82] transition-colors hover:bg-[#edd5a8]"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
        </button>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-2xl bg-[#fbd9c4] text-[#b09b82] transition-colors hover:bg-[#edd5a8]"
          aria-label="More options"
        >
          <Ellipsis className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
