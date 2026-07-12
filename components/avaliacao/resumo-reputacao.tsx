"use client";

import { Sparkles, Star } from "lucide-react";

import { EstrelasNota } from "@/components/avaliacao/estrelas-nota";
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
      <div
        className={cn(
          "card-metrica-perfil relative space-y-1 pr-8",
          className,
        )}
      >
        <Sparkles
          className="absolute top-3 right-3 size-3.5 opacity-50"
          aria-hidden
        />
        <p className="text-[10px] font-medium tracking-wide uppercase opacity-70">
          Calculado pela plataforma
        </p>
        <p className="text-sm opacity-80">Sem avaliações ainda</p>
      </div>
    );
  }

  const mediaFormatada = formatarMedia(media);

  if (variante === "compacta") {
    return (
      <div
        className={cn(
          "card-metrica-perfil relative space-y-1 pr-8",
          className,
        )}
        aria-label={`Nota média ${mediaFormatada} de 5, baseada em ${total} avaliações`}
      >
        <Sparkles
          className="absolute top-3 right-3 size-3.5 opacity-50"
          aria-hidden
        />
        <p className="text-[10px] font-medium tracking-wide uppercase opacity-70">
          Calculado pela plataforma
        </p>
        <p className="inline-flex items-center gap-2 text-sm font-medium">
          <span
            className={cn(
              "font-display text-lg font-bold tabular-nums",
              media >= 4 ? "text-verde-neon" : "text-lilas-escuro",
            )}
          >
            {mediaFormatada}
          </span>
          <Star
            className="size-3.5 fill-verde-neon text-verde-neon"
            aria-hidden
          />
          <span className="font-normal opacity-80">
            ({total} {total === 1 ? "avaliação" : "avaliações"})
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className={cn("card-metrica-perfil relative space-y-2 pr-8", className)}>
      <Sparkles
        className="absolute top-3 right-3 size-3.5 opacity-50"
        aria-hidden
      />
      <p className="text-[10px] font-medium tracking-wide uppercase opacity-70">
        Calculado pela plataforma
      </p>
      <EstrelasNota nota={Math.round(media)} tamanho="lg" mostrarNumero />
      <p className="text-sm font-normal opacity-80">
        Média baseada em {total} {total === 1 ? "avaliação" : "avaliações"}
      </p>
    </div>
  );
}
