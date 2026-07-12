import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { BadgeStatusResultado } from "@/components/resultados/badge-status-resultado";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ResultadoCampanhaRegistro } from "@/lib/mock-data/resultados";
import { formatarNumeroGrande } from "@/lib/resultados/resultados-utils";

type DashboardResultadoCampanhaProps = {
  registro: ResultadoCampanhaRegistro;
};

export function DashboardResultadoCampanha({
  registro,
}: DashboardResultadoCampanhaProps) {
  const { resultado, meta } = registro;
  const r = resultado;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">
            {meta.campanhaTitulo}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {meta.influenciadorNome} · {meta.empresaNome}
          </p>
        </div>
        <BadgeStatusResultado status={resultado.status} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricaCard label="Impressões" valor={formatarNumeroGrande(r.impressoes ?? 0)} />
        <MetricaCard label="Alcance" valor={formatarNumeroGrande(r.alcance ?? 0)} />
        <MetricaCard label="Cliques" valor={formatarNumeroGrande(r.cliques ?? 0)} />
        <MetricaCard
          label="Engajamento total"
          valor={formatarNumeroGrande(r.engajamentoTotal ?? 0)}
        />
        <MetricaCard
          label="Taxa de engajamento"
          valor={`${(r.taxaEngajamento ?? 0).toFixed(2)}%`}
        />
      </div>

      {r.linkComprovante ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Comprovante</CardTitle>
          </CardHeader>
          <CardContent>
            {r.linkComprovante.startsWith("data:") ? (
              <p className="text-muted-foreground text-sm">
                Print comprobatório anexado pelo influenciador.
              </p>
            ) : (
              <Link
                href={r.linkComprovante}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              >
                Ver publicação
                <ExternalLink className="size-3.5" aria-hidden />
              </Link>
            )}
          </CardContent>
        </Card>
      ) : null}

      {r.observacoes ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Observações</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {r.observacoes}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {resultado.status === "validado" ? (
        <p className="text-muted-foreground text-xs">
          Status <strong>validado</strong> — conferência interna da plataforma
          (sem ação nesta fase).
        </p>
      ) : null}
    </div>
  );
}

function MetricaCard({ label, valor }: { label: string; valor: string }) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="font-data text-2xl font-bold">{valor}</CardTitle>
      </CardHeader>
    </Card>
  );
}
