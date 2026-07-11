"use client";

import { cn } from "@/lib/utils";

export type MatchRingNivel = "alto" | "medio" | "baixo";

export function nivelMatchRing(score: number): MatchRingNivel {
  if (score > 80) return "alto";
  if (score >= 50) return "medio";
  return "baixo";
}

const RING_STYLES: Record<
  MatchRingNivel,
  { stroke: string; glow?: string; label: string }
> = {
  alto: {
    stroke: "var(--verde-neon)",
    glow: "drop-shadow(0 0 8px color-mix(in srgb, var(--verde-neon) 65%, transparent))",
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
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
  /** Fundo escuro realça o verde-neon em scores altos */
  darkBackdrop?: boolean;
};

const SIZE_MAP = {
  sm: { box: 56, r: 24, stroke: 4, text: "text-sm", sub: "text-[0.55rem]" },
  md: { box: 80, r: 36, stroke: 6, text: "text-xl", sub: "text-[0.6rem]" },
  lg: { box: 96, r: 42, stroke: 6, text: "text-2xl", sub: "text-[0.65rem]" },
} as const;

export function MatchRing({
  score,
  size = "md",
  showLabel = false,
  label = "match",
  className,
  darkBackdrop = true,
}: MatchRingProps) {
  const nivel = nivelMatchRing(score);
  const styles = RING_STYLES[nivel];
  const dim = SIZE_MAP[size];
  const circunferencia = 2 * Math.PI * dim.r;
  const offset = circunferencia - (score / 100) * circunferencia;
  const center = dim.box / 2;

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center gap-1",
        darkBackdrop && "rounded-card bg-preto px-3 py-2",
        className,
      )}
      aria-label={`${score}% de compatibilidade`}
    >
      <div className="relative" style={{ width: dim.box, height: dim.box }}>
        <svg
          className="size-full -rotate-90"
          viewBox={`0 0 ${dim.box} ${dim.box}`}
          aria-hidden
          style={styles.glow ? { filter: styles.glow } : undefined}
        >
          <circle
            cx={center}
            cy={center}
            r={dim.r}
            fill="none"
            stroke="var(--cinza-900)"
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
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "font-data leading-none font-bold",
              dim.text,
              darkBackdrop ? "text-branco" : "text-foreground",
            )}
          >
            {score}%
          </span>
          {showLabel ? (
            <span
              className={cn(
                "mt-0.5 font-medium tracking-wide uppercase",
                dim.sub,
                darkBackdrop ? "text-cinza-500" : styles.label,
              )}
            >
              {label}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
