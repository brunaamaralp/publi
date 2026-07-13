import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ComentarioAvaliacaoCardProps = {
  children: ReactNode;
  className?: string;
};

/** Card neutro para comentários — sem coloração pela nota */
export function ComentarioAvaliacaoCard({
  children,
  className,
}: ComentarioAvaliacaoCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-cinza-200 bg-white p-3 text-sm leading-relaxed font-normal",
        className,
      )}
    >
      {children}
    </div>
  );
}
