import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-2xl border border-[#edd5a8] bg-white/60 px-3 py-1 text-base font-semibold text-[#453a2d] shadow-xs outline-none transition-[color,box-shadow] placeholder:text-[#b09b82] selection:bg-primary selection:text-primary-foreground focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Input };
