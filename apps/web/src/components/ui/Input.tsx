import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-xl border border-[hsl(var(--panel-border))] bg-[hsl(var(--panel-strong))] px-3 py-1 text-base font-semibold text-foreground shadow-xs outline-none transition-[border-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] placeholder:text-[hsl(var(--subtle-text))] selection:bg-primary selection:text-primary-foreground focus-visible:border-[#3f8f86] focus-visible:ring-[3px] focus-visible:ring-[#3f8f86]/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Input };
