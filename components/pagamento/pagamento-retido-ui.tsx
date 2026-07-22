import type { ReactNode } from "react";
import { Link2 } from "lucide-react";

import type { Pagamento } from "@/lib/types";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { cn } from "@/lib/utils";

export type StatusPagamentoRetidoExibicao =
  | Pagamento["status"]
  | "em_disputa"
  | "aguardando_deposito";

const LABELS: Record<StatusPagamentoRetidoExibicao, string> = {
  retido: "Retido até entrega",
  liberado: "Liberado",
  estornado: "Estornado",
  reembolsado: "Reembolsado à empresa",
  em_disputa: "Em disputa",
  aguardando_deposito: "Aguardando depósito",
};

const BADGE_CLASSES: Record<StatusPagamentoRetidoExibicao, string> = {
  retido: "border-lilas/50 bg-lilas-claro text-lilas-escuro",
  liberado:
    "border-verde-carvao-claro bg-verde-carvao-escuro text-verde-neon",
  estornado: "border-cinza-200 bg-cinza-200/40 text-cinza-500",
  reembolsado: "border-cinza-200 bg-cinza-200/40 text-cinza-500",
  em_disputa: "border-ambar/40 bg-ambar-claro text-ambar-escuro",
  aguardando_deposito: "border-lilas/50 bg-lilas-claro text-lilas-escuro",
};

/** Borda lateral de 3px em listas e cards de pagamento */
export const BORDA_LINHA_PAGAMENTO_RETIDO: Record<
  StatusPagamentoRetidoExibicao,
  string
> = {
  retido: "border-l-[3px] border-l-lilas",
  liberado: "border-l-[3px] border-l-verde-neon",
  estornado: "",
  reembolsado: "border-l-[3px] border-l-cinza-500",
  em_disputa: "border-l-[3px] border-l-ambar",
  aguardando_deposito: "border-l-[3px] border-l-lilas",
};

type BadgeStatusPagamentoRetidoProps = {
  status: StatusPagamentoRetidoExibicao;
  className?: string;
};

export function BadgeStatusPagamentoRetido({
  status,
  className,
}: BadgeStatusPagamentoRetidoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-4xl border px-2.5 py-0.5 text-xs font-semibold",
        BADGE_CLASSES[status],
        className,
      )}
    >
      {LABELS[status]}
    </span>
  );
}

type ValorPagamentoRetidoDestaqueProps = {
  valor: number;
  status: StatusPagamentoRetidoExibicao;
  className?: string;
  tamanho?: "md" | "lg";
};

export function ValorPagamentoRetidoDestaque({
  valor,
  status,
  className,
  tamanho = "lg",
}: ValorPagamentoRetidoDestaqueProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-x-3 gap-y-2",
        className,
      )}
    >
      <p
        className={cn(
          "font-display font-bold leading-none",
          tamanho === "lg" ? "text-3xl sm:text-4xl" : "text-2xl",
        )}
      >
        <span className="font-data">{formatarMoeda(valor)}</span>
      </p>
      <BadgeStatusPagamentoRetido status={status} />
    </div>
  );
}

type CardPagamentoRetidoProps = {
  status: StatusPagamentoRetidoExibicao;
  children: ReactNode;
  className?: string;
};

/** Card com borda lateral colorida por status de pagamento retido */
export function CardPagamentoRetido({
  status,
  children,
  className,
}: CardPagamentoRetidoProps) {
  return (
    <div
      className={cn(
        "secao-editavel overflow-hidden ring-0",
        BORDA_LINHA_PAGAMENTO_RETIDO[status],
        className,
      )}
    >
      {children}
    </div>
  );
}

type LinhaHistoricoPagamentoProps = {
  data: string;
  titulo: string;
  valor: number;
  status: StatusPagamentoRetidoExibicao;
  acao?: ReactNode;
  className?: string;
};

/** Linha de histórico com borda lateral e valores alinhados tabularmente */
export function LinhaHistoricoPagamento({
  data,
  titulo,
  valor,
  status,
  acao,
  className,
}: LinhaHistoricoPagamentoProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-b border-cinza-200 bg-white px-4 py-3 last:border-0",
        BORDA_LINHA_PAGAMENTO_RETIDO[status],
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{titulo}</p>
        <p className="text-texto-secundario text-xs font-normal">{data}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center">
        <p className="font-data text-right font-semibold tabular-nums">
          {formatarMoeda(valor)}
        </p>
        <BadgeStatusPagamentoRetido status={status} />
        {acao}
      </div>
    </div>
  );
}

type IndicadorProvedorPagamentoRetidoProps = {
  className?: string;
};

export function IndicadorProvedorPagamentoRetido({
  className,
}: IndicadorProvedorPagamentoRetidoProps) {
  return (
    <p
      className={cn(
        "text-cinza-500 inline-flex items-start gap-1.5 text-xs leading-relaxed font-normal",
        className,
      )}
    >
      <Link2 className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      Custódia via parceiro de pagamento seguro — a Publi não retém o valor
      diretamente
    </p>
  );
}

export function statusPagamentoRetidoDePagamento(
  pagamento: Pagamento | null,
  contratoStatus?: string,
  entregaContestada?: boolean,
): StatusPagamentoRetidoExibicao {
  if (entregaContestada || contratoStatus === "em_disputa") {
    return "em_disputa";
  }
  if (!pagamento) return "aguardando_deposito";
  if (pagamento.status === "estornado") return "estornado";
  if (pagamento.status === "liberado") return "liberado";
  return "retido";
}
