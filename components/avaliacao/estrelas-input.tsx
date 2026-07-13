"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { LABELS_NOTA } from "@/lib/avaliacao/utils";
import { cn } from "@/lib/utils";

type EstrelasInputProps = {
  value: number | null;
  onChange: (nota: number) => void;
  id?: string;
  disabled?: boolean;
};

export function EstrelasInput({
  value,
  onChange,
  id,
  disabled = false,
}: EstrelasInputProps) {
  const [hoverNota, setHoverNota] = useState<number | null>(null);
  const notaExibida = hoverNota ?? value;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <div
          id={id}
          role="radiogroup"
          aria-label="Nota de avaliação de 1 a 5 estrelas"
          aria-disabled={disabled}
          className="flex items-center gap-1"
          onMouseLeave={() => !disabled && setHoverNota(null)}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const nota = i + 1;
            const ativa = notaExibida !== null && nota <= notaExibida;

            return (
              <button
                key={nota}
                type="button"
                role="radio"
                aria-checked={value === nota}
                aria-label={`${nota} estrela${nota > 1 ? "s" : ""} — ${LABELS_NOTA[nota]}`}
                disabled={disabled}
                className="rounded-sm p-0.5 transition-transform outline-none enabled:hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                onMouseEnter={() => !disabled && setHoverNota(nota)}
                onFocus={() => !disabled && setHoverNota(nota)}
                onBlur={() => setHoverNota(null)}
                onClick={() => !disabled && onChange(nota)}
              >
                <Star
                  className={cn(
                    "size-8",
                    ativa
                      ? "fill-verde-neon text-verde-neon"
                      : "text-cinza-200",
                  )}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>

        {value !== null ? (
          <span
            className={cn(
              "font-display text-2xl font-bold",
              value >= 4 ? "text-verde-neon" : "text-foreground",
            )}
            aria-hidden
          >
            <span className="font-data">{value}.0</span>
          </span>
        ) : null}
      </div>

      <p
        className="text-texto-secundario min-h-5 text-sm font-normal"
        aria-live="polite"
        id={id ? `${id}-label` : undefined}
      >
        {notaExibida ? LABELS_NOTA[notaExibida] : "Selecione uma nota"}
      </p>
    </div>
  );
}
