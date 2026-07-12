import { Building2, Layers } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MetricasConsolidadas } from "@/lib/resultados/resultados-utils";
import { formatarNumeroGrande } from "@/lib/resultados/resultados-utils";

type VisaoConsolidadaAgenciaProps = {
  empresaNome: string;
  metricas: MetricasConsolidadas;
};

export function VisaoConsolidadaAgencia({
  empresaNome,
  metricas,
}: VisaoConsolidadaAgenciaProps) {
  return (
    <Card className="banner-informativo border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Layers className="text-primary size-4" aria-hidden />
          Visão consolidada — {empresaNome}
        </CardTitle>
        <CardDescription>
          Agregado de {metricas.totalCampanhas} campanha(s) com resultado
          preenchido, para reportar ao cliente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ConsolidadoItem
            label="Soma de impressões"
            valor={formatarNumeroGrande(metricas.somaImpressoes)}
          />
          <ConsolidadoItem
            label="Alcance médio"
            valor={formatarNumeroGrande(metricas.mediaAlcance)}
          />
          <ConsolidadoItem
            label="Soma de cliques"
            valor={formatarNumeroGrande(metricas.somaCliques)}
          />
          <ConsolidadoItem
            label="Taxa média de engajamento"
            valor={`${metricas.mediaTaxaEngajamento.toFixed(2)}%`}
          />
        </div>
        <p className="text-muted-foreground mt-4 flex items-center gap-1.5 text-xs">
          <Building2 className="size-3.5" aria-hidden />
          Consolidação simples (soma e média aritmética) — sem ponderação.
        </p>
      </CardContent>
    </Card>
  );
}

function ConsolidadoItem({
  label,
  valor,
}: {
  label: string;
  valor: string;
}) {
  return (
    <div className="border-border rounded-card border bg-background/60 p-3">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-data mt-1 text-lg font-bold">{valor}</p>
    </div>
  );
}
