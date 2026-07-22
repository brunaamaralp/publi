import Link from "next/link";
import { Clock3, ExternalLink } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProximaLiberacao } from "@/lib/financeiro/types";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";

type ProximasLiberacoesProps = {
  liberacoes: ProximaLiberacao[];
};

export function ProximasLiberacoes({ liberacoes }: ProximasLiberacoesProps) {
  if (liberacoes.length === 0) return null;

  return (
    <Card className="border-cinza-200 bg-white ring-0">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-lg font-bold">
          <Clock3 className="size-4 text-lilas-escuro" aria-hidden />
          Próximas liberações
        </CardTitle>
        <CardDescription className="text-texto-secundario font-normal">
          Valores retidos com prazo de liberação automática em andamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {liberacoes.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 rounded-button border border-cinza-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.empresaNome}</p>
              <p className="text-texto-secundario truncate text-xs">
                {item.demandaTitulo}
              </p>
              <p className="text-texto-secundario mt-1 text-xs">
                {item.diasUteisRestantes === 0
                  ? "Liberação iminente"
                  : `${item.diasUteisRestantes} dia${item.diasUteisRestantes === 1 ? "" : "s"} útil${item.diasUteisRestantes === 1 ? "" : "eis"} restante${item.diasUteisRestantes === 1 ? "" : "s"}`}
              </p>
            </div>
            <div className="flex items-center gap-3 sm:shrink-0">
              <span className="font-data text-sm font-semibold tabular-nums">
                {formatarMoeda(item.valor)}
              </span>
              <Link
                href={`/contrato/${item.contratoId}/pagamento`}
                className="text-lilas-escuro inline-flex items-center gap-1 text-xs font-medium hover:underline"
              >
                Ver
                <ExternalLink className="size-3" aria-hidden />
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
