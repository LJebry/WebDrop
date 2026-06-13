import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("rounded-[2.25rem] border border-[#edd5a8]/60 bg-white/28 p-1.5 shadow-[0_22px_60px_rgba(94,78,60,0.08)]", className)}
      {...props}
    >
      <div className="min-h-full rounded-[calc(2.25rem-0.375rem)] bg-white/58 text-card-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
        {children}
      </div>
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("grid gap-1.5 p-5", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("font-display font-bold leading-none tracking-tight text-[#453a2d]", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-sm font-medium text-[#b09b82]", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("p-5 pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
