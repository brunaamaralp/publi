"use client";

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

import {
  LABELS_FAIXA_MATCH,
  LABELS_FAIXA_MATCH_CURTA,
  nivelMatchRing,
  type MatchRingNivel,
} from "@/components/ui/match-ring";
import { cn } from "@/lib/utils";

type BadgeFormatoDemandaProps = {
  children: ReactNode;
  className?: string;
};

export function BadgeFormatoDemanda({
  children,
  className,
}: BadgeFormatoDemandaProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-4xl bg-lilas-claro px-2.5 py-0.5 text-xs font-medium text-lilas-escuro",
        className,
      )}
    >
      {children}
    </span>
  );
}

const BADGE_NIVEL: Record<MatchRingNivel, string> = {
  alto: "border-verde-neon/35 bg-[color-mix(in_srgb,var(--verde-neon)_14%,white)] text-verde-acao",
  medio: "border-verde-acao/25 bg-accent text-verde-acao",
  baixo: "border-cinza-200 bg-cinza-200/40 text-cinza-500",
};

type IndicadorMatchProps = {
  score: number;
  /** `compact` = só %; `completo` = % + faixa curta. */
  variante?: "compact" | "completo";
  className?: string;
};

/** Chip de compatibilidade — mesmo idioma visual do MatchRing em espaços densos. */
export function IndicadorMatch({
  score,
  variante = "completo",
  className,
}: IndicadorMatchProps) {
  const scoreArredondado = Math.round(Math.min(100, Math.max(0, score)));
  const nivel = nivelMatchRing(scoreArredondado);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        BADGE_NIVEL[nivel],
        className,
      )}
      title={LABELS_FAIXA_MATCH[nivel]}
      aria-label={`${scoreArredondado}% — ${LABELS_FAIXA_MATCH[nivel]}`}
    >
      {nivel === "alto" ? (
        <Sparkles className="size-3 shrink-0" aria-hidden />
      ) : null}
      <span className="font-data tabular-nums">{scoreArredondado}%</span>
      {variante === "completo" ? (
        <span className="font-normal opacity-80">
          · {LABELS_FAIXA_MATCH_CURTA[nivel]}
        </span>
      ) : null}
    </span>
  );
}
