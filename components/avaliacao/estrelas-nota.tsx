"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type EstrelasNotaProps = {
  nota: number;
  tamanho?: "sm" | "md";
  className?: string;
};

export function EstrelasNota({
  nota,
  tamanho = "sm",
  className,
}: EstrelasNotaProps) {
  const sizeClass = tamanho === "sm" ? "size-3.5" : "size-4";

  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={`Nota ${nota} de 5`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const preenchida = i < nota;
        return (
          <Star
            key={i}
            className={cn(
              sizeClass,
              preenchida
                ? "fill-[var(--avaliacao-estrela)] text-[var(--avaliacao-estrela)]"
                : "text-muted-foreground/40",
            )}
            aria-hidden
          />
        );
      })}
    </span>
  );
}
