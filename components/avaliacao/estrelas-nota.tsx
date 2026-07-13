"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type EstrelasNotaProps = {
  nota: number;
  tamanho?: "sm" | "md" | "lg";
  className?: string;
  mostrarNumero?: boolean;
};

export function EstrelasNota({
  nota,
  tamanho = "sm",
  className,
  mostrarNumero = false,
}: EstrelasNotaProps) {
  const sizeClass =
    tamanho === "sm" ? "size-3.5" : tamanho === "md" ? "size-4" : "size-5";
  const notaAlta = nota >= 4;

  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      aria-label={`Nota ${nota} de 5`}
    >
      <span className="inline-flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const preenchida = i < nota;
          return (
            <Star
              key={i}
              className={cn(
                sizeClass,
                preenchida
                  ? "fill-verde-neon text-verde-neon"
                  : "text-cinza-200",
              )}
              aria-hidden
            />
          );
        })}
      </span>
      {mostrarNumero ? (
        <span
          className={cn(
            "font-display font-bold",
            tamanho === "lg" ? "text-3xl sm:text-4xl" : "text-lg",
            notaAlta ? "text-verde-neon" : "text-foreground",
          )}
        >
          <span className="font-data">{nota.toFixed(1)}</span>
        </span>
      ) : null}
    </span>
  );
}
