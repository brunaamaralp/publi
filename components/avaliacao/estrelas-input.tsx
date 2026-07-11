"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { LABELS_NOTA } from "@/lib/avaliacao/utils";
import { cn } from "@/lib/utils";

type EstrelasInputProps = {
  value: number | null;
  onChange: (nota: number) => void;
  id?: string;
};

export function EstrelasInput({ value, onChange, id }: EstrelasInputProps) {
  const [hoverNota, setHoverNota] = useState<number | null>(null);
  const notaExibida = hoverNota ?? value;

  return (
    <div className="space-y-2">
      <div
        id={id}
        role="radiogroup"
        aria-label="Nota de avaliação de 1 a 5 estrelas"
        className="flex items-center gap-1"
        onMouseLeave={() => setHoverNota(null)}
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
              className="rounded-sm p-0.5 transition-transform outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring"
              onMouseEnter={() => setHoverNota(nota)}
              onFocus={() => setHoverNota(nota)}
              onBlur={() => setHoverNota(null)}
              onClick={() => onChange(nota)}
            >
              <Star
                className={cn(
                  "size-8",
                  ativa
                    ? "fill-[var(--avaliacao-estrela)] text-[var(--avaliacao-estrela)]"
                    : "text-muted-foreground/40",
                )}
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      <p
        className="text-muted-foreground min-h-5 text-sm"
        aria-live="polite"
        id={id ? `${id}-label` : undefined}
      >
        {notaExibida ? LABELS_NOTA[notaExibida] : "Selecione uma nota"}
      </p>
    </div>
  );
}
