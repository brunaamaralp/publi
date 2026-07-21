import { CATEGORIAS_CATALOGO } from "@/lib/mock-data/categorias";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";

/** Faixa mínima de orçamento (R$) por nicho/categoria — mock de precificação. */
export const ORCAMENTO_MINIMO_POR_NICHO: Record<string, number> = {
  "cat-beleza": 3500,
  "cat-games": 2800,
  "cat-financas": 4000,
  "cat-maternidade": 3000,
  "cat-fitness": 3200,
  "cat-culinaria": 2500,
  "cat-viagem": 4500,
  "cat-moda": 3800,
  "cat-tecnologia": 4000,
  "cat-humor": 2200,
  "cat-pets": 2400,
  "cat-educacao": 3000,
  "cat-saude": 3500,
  "cat-decoracao": 2800,
  "cat-automotivo": 5000,
  "cat-esportes": 3200,
  "cat-musica": 3000,
  "cat-cinema": 2800,
  "cat-sustentabilidade": 3000,
  "cat-empreendedorismo": 4000,
};

export const ORCAMENTO_MINIMO_PADRAO = 2000;

export const NICHOS_DEMANDA = CATEGORIAS_CATALOGO.map((c) => ({
  id: c.id,
  nome: c.nome,
  orcamentoMinimo: ORCAMENTO_MINIMO_POR_NICHO[c.id] ?? ORCAMENTO_MINIMO_PADRAO,
}));

export function nomeNicho(nichoId: string): string {
  return NICHOS_DEMANDA.find((n) => n.id === nichoId)?.nome ?? nichoId;
}

export function orcamentoMinimoNicho(nichoId: string | ""): number {
  if (!nichoId) return ORCAMENTO_MINIMO_PADRAO;
  return ORCAMENTO_MINIMO_POR_NICHO[nichoId] ?? ORCAMENTO_MINIMO_PADRAO;
}

export function mensagemOrcamentoAbaixoDoNicho(
  _nichoId: string,
  minimo: number,
): string {
  return `Orçamento abaixo do mínimo para o nicho selecionado (${formatarMoeda(minimo)})`;
}

/** Valida orçamento contra o mínimo do nicho. Retorna mensagem de erro ou null. */
export function validarOrcamentoNicho(
  nichoId: string | "",
  orcamento: number | "",
): string | null {
  if (!nichoId) return null;
  if (orcamento === "") return null;
  const minimo = orcamentoMinimoNicho(nichoId);
  if (Number(orcamento) < minimo) {
    return mensagemOrcamentoAbaixoDoNicho(nichoId, minimo);
  }
  return null;
}
