import type { ResultadoCampanha } from "@/lib/types";

import { Badge } from "@/components/ui/badge";
import { LABELS_STATUS_RESULTADO } from "@/lib/resultados/resultados-utils";
import { cn } from "@/lib/utils";

type BadgeStatusResultadoProps = {
  status: ResultadoCampanha["status"];
  className?: string;
};

const STATUS_CLASSES: Record<ResultadoCampanha["status"], string> = {
  nao_solicitado: "border-cinza-500/25 bg-cinza-500/10 text-cinza-500",
  solicitado: "border-status-negociacao/30 bg-status-negociacao/10 text-status-negociacao",
  preenchido: "border-verde-acao/25 bg-verde-acao/10 text-verde-acao",
  validado: "border-verde-acao/25 bg-verde-acao/10 text-verde-acao",
};

export function BadgeStatusResultado({
  status,
  className,
}: BadgeStatusResultadoProps) {
  return (
    <Badge
      variant="outline"
      className={cn(STATUS_CLASSES[status], className)}
    >
      {LABELS_STATUS_RESULTADO[status]}
    </Badge>
  );
}
