"use client";

import { cn } from "@/lib/utils";

export type MatchRingNivel = "alto" | "medio" | "baixo";

/** Faixas de compatibilidade: ≥80 alto, ≥50 médio, abaixo baixo. */
export function nivelMatchRing(score: number): MatchRingNivel {
  if (score >= 80) return "alto";
  if (score >= 50) return "medio";
  return "baixo";
}

/** Rótulos longos para badges e listagens. */
export const LABELS_FAIXA_MATCH: Record<MatchRingNivel, string> = {
  alto: "Alta compatibilidade",
  medio: "Compatibilidade média",
  baixo: "Compatibilidade a explorar",
};

/** Rótulos curtos para legendas. */
export const LABELS_FAIXA_MATCH_CURTA: Record<MatchRingNivel, string> = {
  alto: "Alta",
  medio: "Média",
  baixo: "Baixa",
};

const RING_STYLES: Record<
  MatchRingNivel,
  { stroke: string; label: string }
> = {
  alto: {
    stroke: "var(--verde-neon)",
    label: "text-verde-neon",
  },
  medio: {
    stroke: "var(--verde-acao)",
    label: "text-verde-acao",
  },
  baixo: {
    stroke: "var(--cinza-500)",
    label: "text-cinza-500",
  },
};

type MatchRingProps = {
  score: number;
  size?: "xs" | "sm" | "md" | "lg";
  /** Mostra legenda abaixo do anel (faixa curta ou `label`). */
  showLabel?: boolean;
  /** Legenda customizada; padrão = faixa curta (Alta / Média / Baixa). */
  label?: string;
  className?: string;
  /** Substitui o percentual no centro (ex.: XP). */
  centerValue?: string;
  /** Texto do aria-label; padrão descreve score + faixa. */
  ariaLabel?: string;
  /** Fundo verde-carvão realça o traço do anel. */
  darkBackdrop?: boolean;
};

const SIZE_MAP = {
  xs: { box: 44, r: 18, stroke: 3.5, text: "text-[0.65rem]", sub: "text-[0.5rem]" },
  sm: { box: 56, r: 24, stroke: 4, text: "text-sm", sub: "text-[0.55rem]" },
  md: { box: 80, r: 36, stroke: 6, text: "text-xl", sub: "text-[0.6rem]" },
  lg: { box: 96, r: 42, stroke: 6, text: "text-2xl", sub: "text-[0.65rem]" },
} as const;

export function MatchRing({
  score,
  size = "md",
  showLabel = false,
  label,
  className,
  centerValue,
  ariaLabel,
  darkBackdrop = true,
}: MatchRingProps) {
  const scoreArredondado = Math.round(Math.min(100, Math.max(0, score)));
  const nivel = nivelMatchRing(scoreArredondado);
  const styles = RING_STYLES[nivel];
  const dim = SIZE_MAP[size];
  const circunferencia = 2 * Math.PI * dim.r;
  const offset = circunferencia - (scoreArredondado / 100) * circunferencia;
  const center = dim.box / 2;
  const faixaCurta = LABELS_FAIXA_MATCH_CURTA[nivel];
  const legenda = label ?? faixaCurta;
  const valorCentro = centerValue ?? `${scoreArredondado}%`;

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center gap-1",
        darkBackdrop && "rounded-card bg-verde-carvao-escuro px-3 py-2",
        className,
      )}
      aria-label={
        ariaLabel ??
        `${scoreArredondado}% de compatibilidade — ${LABELS_FAIXA_MATCH[nivel]}`
      }
    >
      <div className="relative" style={{ width: dim.box, height: dim.box }}>
        <svg
          className="size-full -rotate-90"
          viewBox={`0 0 ${dim.box} ${dim.box}`}
          aria-hidden
        >
          <circle
            cx={center}
            cy={center}
            r={dim.r}
            fill="none"
            stroke="var(--verde-carvao-claro)"
            strokeWidth={dim.stroke}
          />
          <circle
            cx={center}
            cy={center}
            r={dim.r}
            fill="none"
            stroke={styles.stroke}
            strokeWidth={dim.stroke}
            strokeLinecap="round"
            strokeDasharray={circunferencia}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "font-data leading-none font-bold tabular-nums",
              dim.text,
              darkBackdrop ? "text-branco" : "text-foreground",
            )}
          >
            {valorCentro}
          </span>
        </div>
      </div>
      {showLabel ? (
        <span
          className={cn(
            "font-medium tracking-wide uppercase",
            dim.sub,
            darkBackdrop ? "text-cinza-500" : styles.label,
          )}
        >
          {legenda}
        </span>
      ) : null}
    </div>
  );
}
