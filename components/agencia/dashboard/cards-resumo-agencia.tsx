import {
  Building2,
  FileText,
  Layers,
  Wallet,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ResumoConsolidadoAgencia } from "@/lib/agencia/dashboard-utils";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";

type CardsResumoAgenciaProps = {
  resumo: ResumoConsolidadoAgencia;
  /** Quando "cliente", os cards refletem a empresa ativa. */
  escopo?: "consolidado" | "cliente";
};

const ITENS = [
  {
    key: "demandas" as const,
    label: "Demandas ativas",
    icon: FileText,
  },
  {
    key: "contratos" as const,
    label: "Contratos em andamento",
    icon: Layers,
  },
  {
    key: "investido" as const,
    label: "Investido no mês",
    icon: Wallet,
  },
  {
    key: "empresas" as const,
    label: "Empresas-clientes",
    icon: Building2,
  },
];

export function CardsResumoAgencia({
  resumo,
  escopo = "consolidado",
}: CardsResumoAgenciaProps) {
  const valores = {
    demandas: resumo.totalDemandasAtivas,
    contratos: resumo.totalContratosAndamento,
    investido: formatarMoeda(resumo.totalInvestidoMes),
    empresas: resumo.totalEmpresasClientes,
  };

  return (
    <div className="space-y-2">
      {escopo === "cliente" ? (
        <p className="text-muted-foreground text-xs font-medium">
          Resumo financeiro do cliente ativo
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ITENS.map((item) => (
          <Card key={item.key} size="sm">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-muted-foreground text-xs font-medium">
                {item.label}
              </CardTitle>
              <item.icon className="text-primary size-4 opacity-80" aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="font-data text-2xl font-semibold tracking-tight">
                {valores[item.key]}
              </p>
              {item.key === "demandas" ? (
                <p className="text-muted-foreground mt-1 text-xs">
                  Abertas + em negociação
                </p>
              ) : null}
              {item.key === "investido" ? (
                <p className="text-muted-foreground mt-1 text-xs">
                  Contratos assinados neste mês
                </p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
