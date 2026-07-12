import Link from "next/link";
import { ExternalLink } from "lucide-react";

import {
  BadgeStatusEscrow,
  BORDA_LINHA_ESCROW,
} from "@/components/pagamento/escrow-ui";
import type { TransacaoFinanceira } from "@/lib/mock-data/financeiro";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ListaTransacoesRecentesProps = {
  transacoes: TransacaoFinanceira[];
};

export function ListaTransacoesRecentes({
  transacoes,
}: ListaTransacoesRecentesProps) {
  return (
    <Card className="border-cinza-200 bg-white ring-0">
      <CardHeader>
        <CardTitle className="font-display text-lg font-bold">
          Transações recentes
        </CardTitle>
        <CardDescription className="text-texto-secundario font-normal">
          Últimos pagamentos de campanhas
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-cinza-200 bg-fundo-pagina">
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Empresa</th>
                <th className="px-4 py-3 text-right font-medium">Valor</th>
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
                  className={cn(
                    "border-b border-cinza-200 last:border-0",
                    BORDA_LINHA_ESCROW[tx.statusPagamento],
                  )}
                >
                  <td className="text-texto-secundario px-4 py-3 font-data font-normal">
                    {formatarData(tx.data)}
                  </td>
                  <td className="px-4 py-3 font-medium">{tx.empresaNome}</td>
                  <td className="px-4 py-3 text-right font-data font-semibold tabular-nums">
                    {formatarMoeda(tx.valor)}
                  </td>
                  <td className="px-4 py-3">
                    <BadgeStatusEscrow status={tx.statusPagamento} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/contrato/${tx.contratoId}/pagamento`}
                      className="text-verde-acao inline-flex items-center gap-1 text-xs font-medium hover:underline"
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

        <ul className="divide-y divide-cinza-200 md:hidden">
          {transacoes.map((tx) => (
            <li
              key={tx.id}
              className={cn(
                "space-y-2 px-4 py-4",
                BORDA_LINHA_ESCROW[tx.statusPagamento],
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{tx.empresaNome}</p>
                  <p className="text-texto-secundario font-data text-xs font-normal">
                    {formatarData(tx.data)}
                  </p>
                </div>
                <p className="font-data text-right font-semibold tabular-nums">
                  {formatarMoeda(tx.valor)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <BadgeStatusEscrow status={tx.statusPagamento} />
                <Link
                  href={`/contrato/${tx.contratoId}/pagamento`}
                  className="text-verde-acao text-xs font-medium hover:underline"
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

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
