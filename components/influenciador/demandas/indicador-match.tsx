"use client";

import type { ReactNode } from "react";
import { BadgeCheck } from "lucide-react";

import { cn } from "@/lib/utils";

type IndicadorMatchProps = {
  score: number;
  className?: string;
  /** Posição do badge no card — início (esquerda) para destaque no feed */
  alinhamento?: "inicio" | "fim";
};

function nivelScore(score: number): "alto" | "medio" | "baixo" {
  if (score > 80) return "alto";
  if (score >= 50) return "medio";
  return "baixo";
}

export function IndicadorMatch({
  score,
  className,
  alinhamento = "fim",
}: IndicadorMatchProps) {
  const nivel = nivelScore(score);
  const alinhaInicio = alinhamento === "inicio";

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col gap-1.5",
        alinhaInicio ? "items-start" : "items-end",
        className,
      )}
      aria-label={
        nivel === "baixo"
          ? `${score}% de compatibilidade estimada — ainda sem histórico na plataforma`
          : `${score}% de compatibilidade com seu perfil`
      }
    >
      <div
        className={cn(
          "flex min-w-[5rem] flex-col rounded-card border px-3 py-2.5",
          nivel === "alto" &&
            "border-verde-neon bg-verde-carvao-escuro",
          nivel === "medio" &&
            "border-cinza-200 bg-verde-carvao-escuro",
          nivel === "baixo" && "border-cinza-200 bg-white",
        )}
      >
        <span
          className={cn(
            "font-display text-4xl leading-none font-bold sm:text-[2.75rem]",
            nivel === "alto" && "text-verde-neon font-data",
            nivel === "medio" && "font-data text-white",
            nivel === "baixo" && "font-data text-cinza-500",
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
          compatível
        </span>
      </div>
      {nivel === "baixo" ? (
        <p
          className={cn(
            "max-w-[8.5rem] text-[11px] leading-snug font-normal text-cinza-500",
            alinhaInicio ? "text-left" : "text-right",
          )}
        >
          Estimativa inicial — ainda sem histórico na plataforma
        </p>
      ) : (
        <p
          className={cn(
            "text-texto-secundario text-[11px] font-normal",
            alinhaInicio ? "text-left" : "text-right",
          )}
        >
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
        "inline-flex items-center rounded-4xl bg-lilas-claro px-2.5 py-0.5 text-xs font-medium text-lilas-escuro",
        className,
      )}
    >
      {children}
    </span>
  );
}
