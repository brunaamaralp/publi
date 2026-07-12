import { formatarPrazo } from "@/lib/demandas/utils";
import type { ContratoPagamentoContexto } from "@/lib/pagamento/pagamento-types";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ResumoContratoDepositoProps = {
  contexto: ContratoPagamentoContexto;
};

export function ResumoContratoDeposito({ contexto }: ResumoContratoDepositoProps) {
  const { contrato, influenciador, demandaTitulo } = contexto;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{demandaTitulo}</CardTitle>
        <CardDescription>Contrato assinado — pronto para depósito</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Influenciador(a)</span>
          <span className="font-medium">{influenciador.nome}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Valor</span>
          <span className="font-data font-semibold">
            {formatarMoeda(contrato.valor)}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Prazo de entrega</span>
          <span className="font-data">{formatarPrazo(contrato.prazoEntrega)}</span>
        </div>
        <p className="text-muted-foreground border-border border-t pt-3 text-xs leading-relaxed">
          {contrato.escopo}
        </p>
      </CardContent>
    </Card>
  );
}
