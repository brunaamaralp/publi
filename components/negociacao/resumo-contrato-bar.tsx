import type { Contrato } from "@/lib/types";
import { LABELS_STATUS_CONTRATO } from "@/lib/negociacao/negociacao-utils";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { formatarPrazo } from "@/lib/demandas/utils";
import { cn } from "@/lib/utils";

type ResumoContratoBarProps = {
  contrato: Contrato;
  className?: string;
};

export function ResumoContratoBar({
  contrato,
  className,
}: ResumoContratoBarProps) {
  const assinado = contrato.status === "assinado" || !!contrato.dataAssinatura;

  return (
    <div
      className={cn(
        "border-border bg-card flex flex-wrap items-center justify-between gap-3 rounded-card border px-4 py-3 text-sm",
        assinado && "border-verde-acao/25 bg-verde-acao/5",
        className,
      )}
      role="status"
    >
      <div>
        <p className="font-medium">
          Contrato{" "}
          <span
            className={cn(
              assinado ? "text-verde-acao" : "text-muted-foreground",
            )}
          >
            {LABELS_STATUS_CONTRATO[contrato.status]}
          </span>
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Prazo: {formatarPrazo(contrato.prazoEntrega)}
        </p>
      </div>
      <p className="font-data text-base font-semibold">
        {formatarMoeda(contrato.valor)}
      </p>
    </div>
  );
}
