import type { Demanda } from "@/lib/types";

import { LABELS_TIPO_SERVICO } from "@/lib/influenciador/cadastro-utils";

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
  melhor_match: "Melhor match",
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
