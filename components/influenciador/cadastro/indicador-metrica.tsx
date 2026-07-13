import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type IndicadorMetricaProps = {
  tipo: "auto-calculado" | "informativo";
  className?: string;
};

export function IndicadorMetrica({ tipo, className }: IndicadorMetricaProps) {
  if (tipo === "auto-calculado") {
    return (
      <p className={cn("indicador-auto-calculado", className)}>
        <Sparkles className="size-3 shrink-0" aria-hidden />
        Calculado pela plataforma
      </p>
    );
  }

  return (
    <p className={cn("indicador-auto-calculado", className)}>
      Informado por você
    </p>
  );
}
