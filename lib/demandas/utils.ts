import type { Demanda } from "@/lib/types";

import { nomeNicho } from "@/lib/empresa/orcamento-nicho";
import { LABELS_TIPO_SERVICO } from "@/lib/influenciador/cadastro-utils";

/** Alinhado a `ORCAMENTO_MIN_MOCK` em mock-data/demandas (evita import circular). */
const ORCAMENTO_MIN_PADRAO_FILTRO = 1500;

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

/** Nicho inferido quando o mock da demanda ainda não traz `nichoId`. */
const NICHO_POR_DEMANDA: Record<string, string> = {
  "dem-001": "cat-beleza",
  "dem-002": "cat-tecnologia",
  "dem-003": "cat-culinaria",
  "dem-004": "cat-fitness",
  "dem-005": "cat-moda",
  "dem-006": "cat-pets",
  "dem-007": "cat-financas",
  "dem-008": "cat-games",
  "dem-009": "cat-sustentabilidade",
  "dem-010": "cat-educacao",
  "dem-011": "cat-empreendedorismo",
  "dem-012": "cat-moda",
};

export function nichoIdDemanda(demanda: Demanda): string | undefined {
  return demanda.nichoId ?? NICHO_POR_DEMANDA[demanda.id];
}

export function labelNichoDemanda(demanda: Demanda): string | undefined {
  const id = nichoIdDemanda(demanda);
  return id ? nomeNicho(id) : undefined;
}

/** Tags compactas para o card (formato + nicho, máx. 3). */
export function tagsDemandaCard(demanda: Demanda): string[] {
  const tags = [labelFormatoEntrega(demanda.formatoEntrega)];
  const nicho = labelNichoDemanda(demanda);
  if (nicho) tags.push(nicho);
  return tags.slice(0, 3);
}

/** Requisitos principais derivados dos campos da demanda. */
export function requisitosDemanda(demanda: Demanda): string[] {
  const itens = [
    `Entregar em ${labelFormatoEntrega(demanda.formatoEntrega)}`,
    `Prazo até ${formatarPrazo(demanda.prazo)}`,
  ];
  const nicho = labelNichoDemanda(demanda);
  if (nicho) {
    itens.push(`Alinhamento com o nicho ${nicho}`);
  }
  return itens;
}

export type FiltrosDemandaUrl = {
  formato: Demanda["formatoEntrega"] | "todos";
  orcamentoMinimo: number;
  ordenacao: OrdenacaoDemanda;
  aba: string;
};

export function serializarQueryDemandas(params: {
  formato: Demanda["formatoEntrega"] | "todos";
  orcamentoMinimo: number;
  ordenacao: OrdenacaoDemanda;
  aba?: string;
}): string {
  const sp = new URLSearchParams();
  if (params.formato !== "todos") sp.set("formato", params.formato);
  if (params.orcamentoMinimo !== ORCAMENTO_MIN_PADRAO_FILTRO) {
    sp.set("orcMin", String(params.orcamentoMinimo));
  }
  if (params.ordenacao !== "melhor_match") sp.set("ord", params.ordenacao);
  if (params.aba && params.aba !== "para-voce") sp.set("aba", params.aba);
  return sp.toString();
}

export function parseQueryDemandas(
  sp: URLSearchParams,
): FiltrosDemandaUrl {
  const formatoRaw = sp.get("formato");
  const formatosValidos = new Set(Object.keys(LABELS_TIPO_SERVICO));
  const formato =
    formatoRaw && formatosValidos.has(formatoRaw)
      ? (formatoRaw as Demanda["formatoEntrega"])
      : "todos";

  const orcRaw = Number(sp.get("orcMin"));
  const orcamentoMinimo =
    Number.isFinite(orcRaw) && orcRaw > 0
      ? orcRaw
      : ORCAMENTO_MIN_PADRAO_FILTRO;

  const ordRaw = sp.get("ord");
  const ordenacao =
    ordRaw === "maior_orcamento" || ordRaw === "mais_recente"
      ? ordRaw
      : "melhor_match";

  const aba = sp.get("aba") === "enviados" ? "enviados" : "para-voce";

  return { formato, orcamentoMinimo, ordenacao, aba };
}

export function hrefDetalheDemanda(
  demandaId: string,
  query: string,
): string {
  const base = `/influenciador/demandas/${demandaId}`;
  return query ? `${base}?${query}` : base;
}

export function hrefFeedDemandas(query: string): string {
  return query ? `/influenciador/demandas?${query}` : "/influenciador/demandas";
}
