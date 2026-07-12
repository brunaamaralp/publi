import { Link2 } from "lucide-react";

import type { Pagamento } from "@/lib/types";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { cn } from "@/lib/utils";

export type StatusEscrowExibicao =
  | Pagamento["status"]
  | "em_disputa"
  | "aguardando_deposito";

const LABELS: Record<StatusEscrowExibicao, string> = {
  retido: "Retido até entrega",
  liberado: "Liberado",
  estornado: "Estornado",
  em_disputa: "Em disputa",
  aguardando_deposito: "Aguardando depósito",
};

const BADGE_CLASSES: Record<StatusEscrowExibicao, string> = {
  retido: "border-lilas-claro bg-lilas-claro text-lilas-escuro",
  liberado: "border-verde-carvao-escuro bg-verde-carvao-escuro text-verde-neon",
  estornado: "border-cinza-200 bg-cinza-200/40 text-cinza-500",
  em_disputa: "border-ambar-claro bg-ambar-claro text-ambar-escuro",
  aguardando_deposito: "border-lilas-claro bg-lilas-claro text-lilas-escuro",
};

/** Borda lateral de 3px em listas de pagamento */
export const BORDA_LINHA_ESCROW: Record<StatusEscrowExibicao, string> = {
  retido: "border-l-[3px] border-l-lilas",
  liberado: "border-l-[3px] border-l-verde-neon",
  estornado: "",
  em_disputa: "border-l-[3px] border-l-ambar",
  aguardando_deposito: "border-l-[3px] border-l-lilas",
};

type BadgeStatusEscrowProps = {
  status: StatusEscrowExibicao;
  className?: string;
};

export function BadgeStatusEscrow({ status, className }: BadgeStatusEscrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-4xl border px-2 py-0.5 text-xs font-medium",
        BADGE_CLASSES[status],
        className,
      )}
    >
      {LABELS[status]}
    </span>
  );
}

type ValorEscrowDestaqueProps = {
  valor: number;
  status: StatusEscrowExibicao;
  className?: string;
  tamanho?: "md" | "lg";
};

export function ValorEscrowDestaque({
  valor,
  status,
  className,
  tamanho = "lg",
}: ValorEscrowDestaqueProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2",
        className,
      )}
    >
      <p
        className={cn(
          "font-display font-bold tabular-nums",
          tamanho === "lg" ? "text-3xl sm:text-4xl" : "text-2xl",
        )}
      >
        {formatarMoeda(valor)}
      </p>
      <BadgeStatusEscrow status={status} />
    </div>
  );
}

type IndicadorProvedorEscrowProps = {
  className?: string;
};

export function IndicadorProvedorEscrow({
  className,
}: IndicadorProvedorEscrowProps) {
  return (
    <p
      className={cn(
        "text-cinza-500 inline-flex items-center gap-1.5 text-xs font-normal",
        className,
      )}
    >
      <Link2 className="size-3.5 shrink-0" aria-hidden />
      Custódia via provedor de escrow parceiro — a Publi não retém o valor
      diretamente
    </p>
  );
}

export function statusEscrowDePagamento(
  pagamento: Pagamento | null,
  contratoStatus?: string,
  entregaContestada?: boolean,
): StatusEscrowExibicao {
  if (entregaContestada || contratoStatus === "em_disputa") {
    return "em_disputa";
  }
  if (!pagamento) return "aguardando_deposito";
  if (pagamento.status === "estornado") return "estornado";
  if (pagamento.status === "liberado") return "liberado";
  return "retido";
}
