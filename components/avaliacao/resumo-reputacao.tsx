"use client";

import { Star } from "lucide-react";

import type { Avaliacao } from "@/lib/types";
import {
  calcularMediaAvaliacoes,
  formatarMedia,
} from "@/lib/avaliacao/utils";
import { cn } from "@/lib/utils";

type ResumoReputacaoProps = {
  avaliacoes: Avaliacao[];
  variante?: "compacta" | "expandida";
  className?: string;
};

export function ResumoReputacao({
  avaliacoes,
  variante = "compacta",
  className,
}: ResumoReputacaoProps) {
  const media = calcularMediaAvaliacoes(avaliacoes);
  const total = avaliacoes.length;

  if (media === null) {
    return (
      <p className={cn("text-muted-foreground text-sm", className)}>
        Sem avaliações ainda
      </p>
    );
  }

  const mediaFormatada = formatarMedia(media);

  if (variante === "compacta") {
    return (
      <p
        className={cn(
          "inline-flex items-center gap-1 text-sm font-medium",
          className,
        )}
        aria-label={`Nota média ${mediaFormatada} de 5, baseada em ${total} avaliações`}
      >
        <span className="font-data">{mediaFormatada}</span>
        <Star
          className="size-3.5 fill-[var(--avaliacao-estrela)] text-[var(--avaliacao-estrela)]"
          aria-hidden
        />
        <span className="text-muted-foreground font-normal">
          ({total} {total === 1 ? "avaliação" : "avaliações"})
        </span>
      </p>
    );
  }

  return (
    <div className={cn("space-y-0.5", className)}>
      <p className="inline-flex items-center gap-1.5 font-display text-lg font-semibold">
        <span className="font-data">{mediaFormatada}</span>
        <Star
          className="size-4 fill-[var(--avaliacao-estrela)] text-[var(--avaliacao-estrela)]"
          aria-hidden
        />
      </p>
      <p className="text-muted-foreground text-sm">
        baseado em {total} {total === 1 ? "avaliação" : "avaliações"}
      </p>
    </div>
  );
}
