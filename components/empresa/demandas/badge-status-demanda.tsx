import type { Demanda } from "@/lib/types";
import { LABELS_STATUS_DEMANDA } from "@/lib/empresa/demandas-utils";
import { cn } from "@/lib/utils";

const STATUS_CLASSES: Record<Demanda["status"], string> = {
  rascunho: "border-cinza-500/30 bg-muted text-texto-secundario",
  aberta: "border-verde-carvao-escuro bg-verde-carvao-escuro text-verde-neon",
  em_negociacao: "border-lilas-claro bg-lilas-claro text-lilas-escuro",
  em_andamento: "border-primary/30 bg-primary/10 text-primary",
  fechada: "border-cinza-500/25 bg-cinza-500/10 text-cinza-500",
  cancelada: "border-destructive/25 bg-destructive/10 text-destructive",
};

/** Borda lateral de 3px nas linhas da tabela, por status */
export const BORDA_LINHA_DEMANDA: Record<Demanda["status"], string> = {
  rascunho: "border-l-[3px] border-l-cinza-500/50",
  aberta: "border-l-[3px] border-l-verde-neon",
  em_negociacao: "border-l-[3px] border-l-lilas",
  em_andamento: "border-l-[3px] border-l-primary",
  fechada: "",
  cancelada: "",
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
