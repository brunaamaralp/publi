"use client";

import type { ReactNode } from "react";
import { BadgeCheck } from "lucide-react";

import { cn } from "@/lib/utils";

type IndicadorMatchProps = {
  score: number;
  className?: string;
};

function nivelScore(score: number): "alto" | "medio" | "baixo" {
  if (score > 80) return "alto";
  if (score >= 50) return "medio";
  return "baixo";
}

export function IndicadorMatch({ score, className }: IndicadorMatchProps) {
  const nivel = nivelScore(score);

  return (
    <div
      className={cn("flex shrink-0 flex-col items-end gap-1", className)}
      aria-label={
        nivel === "baixo"
          ? `${score}% de match estimado — score inicial sem histórico na plataforma`
          : `${score}% de compatibilidade com seu perfil`
      }
    >
      <div
        className={cn(
          "flex min-w-[4.5rem] flex-col items-center rounded-card border px-3 py-2",
          nivel === "alto" &&
            "border-verde-neon bg-verde-carvao-escuro",
          nivel === "medio" &&
            "border-cinza-200 bg-verde-carvao-escuro",
          nivel === "baixo" &&
            "border-cinza-200 bg-cinza-200/30",
        )}
      >
        <span
          className={cn(
            "font-display text-3xl leading-none font-bold tabular-nums sm:text-4xl",
            nivel === "alto" && "text-verde-neon",
            nivel === "medio" && "text-white",
            nivel === "baixo" && "text-cinza-500",
          )}
        >
          {score}%
        </span>
        <span
          className={cn(
            "mt-1 text-[10px] font-medium tracking-widest uppercase",
            nivel === "alto" && "text-verde-neon/80",
            nivel === "medio" && "text-cinza-500",
            nivel === "baixo" && "text-cinza-500",
          )}
        >
          match
        </span>
      </div>
      {nivel === "baixo" ? (
        <p className="text-cinza-500 max-w-[7.5rem] text-right text-[10px] leading-snug font-normal">
          Estimativa inicial — sem histórico na plataforma ainda
        </p>
      ) : (
        <p className="text-texto-secundario text-right text-[10px] font-normal">
          Compatível com você
        </p>
      )}
    </div>
  );
}

type BadgeEmpresaProps = {
  nome: string;
  verificada?: boolean;
};

export function BadgeEmpresa({ nome, verificada }: BadgeEmpresaProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-texto-secundario text-xs font-medium">{nome}</span>
      {verificada ? (
        <BadgeCheck
          className="text-verde-neon size-3.5"
          aria-label="Empresa verificada"
        />
      ) : null}
    </div>
  );
}

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
        "inline-flex items-center rounded-4xl border border-lilas-claro bg-lilas-claro px-2 py-0.5 text-xs font-medium text-lilas-escuro",
        className,
      )}
    >
      {children}
    </span>
  );
}
