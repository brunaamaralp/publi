import { BarChart3 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FormatoDemandaIndicador } from "@/lib/mock-data/financeiro";
import { cn } from "@/lib/utils";

type IndicadoresDemandaProps = {
  indicadores: FormatoDemandaIndicador[];
  formatoDestaque?: string;
};

export function IndicadoresDemanda({
  indicadores,
  formatoDestaque,
}: IndicadoresDemandaProps) {
  const maxPercentual = Math.max(...indicadores.map((i) => i.percentual));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="text-primary size-4" aria-hidden />
          Indicadores de demanda
        </CardTitle>
        <CardDescription>
          Formatos de entrega mais requisitados no momento na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {indicadores.map((item) => {
          const destaque = item.rotulo === formatoDestaque || item.percentual === maxPercentual;
          return (
            <div key={item.formato} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className={cn(destaque && "font-medium")}>
                  {item.rotulo}
                  {destaque ? (
                    <span className="text-verde-acao ml-1.5 text-xs font-normal">
                      em alta
                    </span>
                  ) : null}
                </span>
                <span className="font-data text-muted-foreground">
                  {item.percentual}%
                </span>
              </div>
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    destaque ? "bg-verde-acao" : "bg-cinza-500/60",
                  )}
                  style={{ width: `${item.percentual}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
