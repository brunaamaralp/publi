"use client";

import { Star } from "lucide-react";

import { EstrelasNota } from "@/components/avaliacao/estrelas-nota";
import { IndicadorMetrica } from "@/components/influenciador/cadastro/indicador-metrica";
import type { Avaliacao } from "@/lib/types";
import {
  mediaPublicaAvaliacoes,
  formatarMedia,
  MIN_AVALIACOES_NOTA_PUBLICA,
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
  const media = mediaPublicaAvaliacoes(avaliacoes);
  const total = avaliacoes.length;

  if (media === null) {
    return (
      <div
        className={cn(
          "card-metrica-perfil relative space-y-1",
          className,
        )}
      >
        <IndicadorMetrica tipo="auto-calculado" />
        <p className="text-sm opacity-80">
          {total === 0
            ? "Sem avaliações ainda"
            : `Novo no Publi (faltam ${MIN_AVALIACOES_NOTA_PUBLICA - total} para nota pública)`}
        </p>
      </div>
    );
  }

  const mediaFormatada = formatarMedia(media);

  if (variante === "compacta") {
    return (
      <div
        className={cn(
          "card-metrica-perfil relative space-y-1",
          className,
        )}
        aria-label={`Nota média ${mediaFormatada} de 5, baseada em ${total} avaliações`}
      >
        <IndicadorMetrica tipo="auto-calculado" />
        <p className="inline-flex items-center gap-2 text-sm font-medium">
          <span
            className={cn(
              "font-display text-lg font-bold",
              media >= 4 ? "text-verde-neon" : "text-lilas-escuro",
            )}
          >
            <span className="font-data">{mediaFormatada}</span>
          </span>
          <Star
            className={cn(
              "size-3.5",
              media >= 4
                ? "fill-verde-neon text-verde-neon"
                : "text-cinza-200",
            )}
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
    <div className={cn("card-metrica-perfil relative space-y-2", className)}>
      <IndicadorMetrica tipo="auto-calculado" />
      <EstrelasNota nota={Math.round(media)} tamanho="lg" mostrarNumero />
      <p className="text-sm font-normal opacity-80">
        Média baseada em {total} {total === 1 ? "avaliação" : "avaliações"}
      </p>
    </div>
  );
}
