"use client";

import { BadgeCheck } from "lucide-react";

import { MatchRing } from "@/components/ui/match-ring";
import { cn } from "@/lib/utils";

type IndicadorMatchProps = {
  score: number;
  className?: string;
};

export function IndicadorMatch({ score, className }: IndicadorMatchProps) {
  return (
    <div className={cn("flex shrink-0 flex-col items-center gap-1", className)}>
      <MatchRing score={score} size="md" showLabel label="match" />
      <p className="text-cinza-500 max-w-[5.5rem] text-center text-xs font-medium">
        Compatível com você
      </p>
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
      <span className="text-cinza-500 text-xs font-medium">{nome}</span>
      {verificada ? (
        <BadgeCheck
          className="text-verde-acao size-3.5"
          aria-label="Empresa verificada"
        />
      ) : null}
    </div>
  );
}
