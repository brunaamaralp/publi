import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { TransacaoFinanceira } from "@/lib/mock-data/financeiro";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ListaTransacoesRecentesProps = {
  transacoes: TransacaoFinanceira[];
};

const STATUS_LABELS: Record<TransacaoFinanceira["statusPagamento"], string> = {
  retido: "Retido",
  liberado: "Liberado",
};

export function ListaTransacoesRecentes({
  transacoes,
}: ListaTransacoesRecentesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Transações recentes</CardTitle>
        <CardDescription>Últimos pagamentos de campanhas</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-border bg-muted/40 border-b">
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Empresa</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Contrato</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-border border-b last:border-0"
                >
                  <td className="text-muted-foreground px-4 py-3 font-data">
                    {formatarData(tx.data)}
                  </td>
                  <td className="px-4 py-3 font-medium">{tx.empresaNome}</td>
                  <td className="px-4 py-3 font-data font-semibold">
                    {formatarMoeda(tx.valor)}
                  </td>
                  <td className="px-4 py-3">
                    <BadgeStatusPagamento status={tx.statusPagamento} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/contrato/${tx.contratoId}/pagamento`}
                      className="text-primary inline-flex items-center gap-1 text-xs font-medium hover:underline"
                    >
                      Ver contrato
                      <ExternalLink className="size-3" aria-hidden />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="divide-border divide-y md:hidden">
          {transacoes.map((tx) => (
            <li key={tx.id} className="space-y-2 px-4 py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{tx.empresaNome}</p>
                  <p className="text-muted-foreground font-data text-xs">
                    {formatarData(tx.data)}
                  </p>
                </div>
                <p className="font-data font-semibold">
                  {formatarMoeda(tx.valor)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <BadgeStatusPagamento status={tx.statusPagamento} />
                <Link
                  href={`/contrato/${tx.contratoId}/pagamento`}
                  className="text-primary text-xs font-medium hover:underline"
                >
                  Ver contrato →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function BadgeStatusPagamento({
  status,
}: {
  status: TransacaoFinanceira["statusPagamento"];
}) {
  return (
    <Badge
      variant="outline"
      className={
        status === "liberado"
          ? "border-verde-acao/30 bg-verde-acao/10 text-verde-acao"
          : "border-status-negociacao/30 bg-status-negociacao/10 text-status-negociacao"
      }
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
