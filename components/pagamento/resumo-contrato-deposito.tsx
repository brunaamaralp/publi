import { formatarPrazo } from "@/lib/demandas/utils";
import {
  CardEscrow,
  IndicadorProvedorEscrow,
  ValorEscrowDestaque,
} from "@/components/pagamento/escrow-ui";
import type { ContratoPagamentoContexto } from "@/lib/pagamento/pagamento-types";

type ResumoContratoDepositoProps = {
  contexto: ContratoPagamentoContexto;
};

export function ResumoContratoDeposito({ contexto }: ResumoContratoDepositoProps) {
  const { contrato, influenciador, demandaTitulo } = contexto;

  return (
    <CardEscrow status="aguardando_deposito" className="space-y-4 p-4">
      <div>
        <h2 className="font-display text-lg font-bold">{demandaTitulo}</h2>
        <p className="text-texto-secundario text-sm font-normal">
          Contrato assinado — pronto para depósito protegido
        </p>
      </div>

      <ValorEscrowDestaque
        valor={contrato.valor}
        status="aguardando_deposito"
        tamanho="md"
      />

      <IndicadorProvedorEscrow />

      <dl className="space-y-2 border-t border-cinza-200 pt-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-texto-secundario font-normal">Influenciador(a)</dt>
          <dd className="text-right font-medium">{influenciador.nome}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-texto-secundario font-normal">Prazo de entrega</dt>
          <dd className="font-data text-right font-medium">
            {formatarPrazo(contrato.prazoEntrega)}
          </dd>
        </div>
      </dl>

      <p className="text-texto-secundario border-t border-cinza-200 pt-3 text-xs leading-relaxed font-normal">
        {contrato.escopo}
      </p>
    </CardEscrow>
  );
}
