import { Clock } from "lucide-react";

import {
  CardEscrow,
  IndicadorProvedorEscrow,
  ValorEscrowDestaque,
} from "@/components/pagamento/escrow-ui";
import { cn } from "@/lib/utils";

type PagamentoGarantidoCardProps = {
  valor: number;
  className?: string;
};

export function PagamentoGarantidoCard({
  valor,
  className,
}: PagamentoGarantidoCardProps) {
  return (
    <CardEscrow status="retido" className={cn("space-y-4 p-4", className)}>
      <div className="flex items-start gap-3">
        <div className="bg-lilas-claro flex size-9 shrink-0 items-center justify-center rounded-full">
          <Clock className="text-lilas-escuro size-4" aria-hidden />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-lilas-escuro text-sm font-semibold">
            Pagamento garantido
          </p>
          <p className="text-texto-secundario text-sm font-normal">
            Valor reservado em garantia até a entrega ser confirmada
          </p>
        </div>
      </div>

      <ValorEscrowDestaque valor={valor} status="retido" />

      <IndicadorProvedorEscrow />

      <p className="text-texto-secundario text-sm leading-relaxed font-normal">
        O valor já está reservado e será liberado para você após a empresa
        confirmar a entrega do conteúdo.
      </p>
    </CardEscrow>
  );
}
