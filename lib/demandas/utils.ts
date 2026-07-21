import type { Demanda } from "@/lib/types";

import { LABELS_TIPO_SERVICO } from "@/lib/influenciador/cadastro-utils";

/** Statuses que entram no feed/busca de oportunidades (exclui rascunho). */
export const STATUS_DEMANDA_BUSCA = new Set<Demanda["status"]>([
  "aberta",
  "em_negociacao",
  "em_andamento",
]);

export function demandaVisivelNaBusca(status: Demanda["status"]): boolean {
  return STATUS_DEMANDA_BUSCA.has(status);
}

export function labelFormatoEntrega(
  formato: Demanda["formatoEntrega"],
): string {
  return LABELS_TIPO_SERVICO[formato];
}

export type OrdenacaoDemanda =
  | "melhor_match"
  | "maior_orcamento"
  | "mais_recente";

export const LABELS_ORDENACAO: Record<OrdenacaoDemanda, string> = {
  melhor_match: "Maior compatibilidade",
  maior_orcamento: "Maior orçamento",
  mais_recente: "Mais recente",
};

export function formatarPrazo(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
