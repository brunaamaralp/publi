import type { Demanda } from "@/lib/types";
import { LABELS_STATUS_DEMANDA } from "@/lib/empresa/demandas-utils";
import { cn } from "@/lib/utils";

const STATUS_CLASSES: Record<Demanda["status"], string> = {
  aberta:
    "border-verde-acao/25 bg-verde-acao/10 text-verde-acao",
  em_negociacao:
    "border-status-negociacao/30 bg-status-negociacao/10 text-status-negociacao",
  fechada: "border-cinza-500/25 bg-cinza-500/10 text-cinza-500",
  cancelada:
    "border-destructive/25 bg-destructive/10 text-destructive",
};

type BadgeStatusDemandaProps = {
  status: Demanda["status"];
  className?: string;
};

export function BadgeStatusDemanda({
  status,
  className,
}: BadgeStatusDemandaProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-4xl border px-2 py-0.5 text-xs font-medium",
        STATUS_CLASSES[status],
        className,
      )}
    >
      {LABELS_STATUS_DEMANDA[status]}
    </span>
  );
}
