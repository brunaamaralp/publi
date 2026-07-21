import type { CreatorCatalogo } from "@/lib/empresa/creator-catalogo-types";
import type { MinhaDemandaItem } from "@/lib/empresa/demandas-types";
import { nomeNicho } from "@/lib/empresa/orcamento-nicho";
import {
  EMPRESA_NEGOCIACAO_USUARIO_ID,
  TAXA_DESBLOQUEIO_PADRAO,
} from "@/lib/negociacao/negociacao-constantes";
import type { NegociacaoContexto } from "@/lib/negociacao/negociacao-types";
import type { Match } from "@/lib/types";

const STORAGE_KEY = "matches-convite-v1";

type MatchConviteRegistro = NegociacaoContexto;

const memoria: Record<string, MatchConviteRegistro> = {};
let hidratado = false;

function novoId(prefixo: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefixo}-${crypto.randomUUID()}`;
  }
  return `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function hidratar(): void {
  if (hidratado || typeof window === "undefined") return;
  hidratado = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, MatchConviteRegistro>;
    Object.assign(memoria, parsed);
  } catch {
    // ignore
  }
}

function persistir(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memoria));
}

/**
 * Score mock relativo à demanda — só deve aparecer após o convite
 * (tela de negociação / matches sugeridos), nunca na busca livre.
 */
function scoreMockParaConvite(
  creator: CreatorCatalogo,
  item: MinhaDemandaItem,
): number {
  let score = 68;
  if (item.demanda.nichoId && item.demanda.nichoId === creator.nichoId) {
    score += 22;
  } else {
    score += 8;
  }
  if (creator.engajamentoMedio >= 5) score += 6;
  else if (creator.engajamentoMedio >= 3) score += 3;
  if (creator.precoPacoteMin <= item.demanda.orcamento * 0.4) score += 4;
  return Math.min(98, Math.max(55, Math.round(score)));
}

export function listarMatchesConvite(): MatchConviteRegistro[] {
  hidratar();
  return Object.values(memoria);
}

export function obterMatchConvite(
  matchId: string,
): MatchConviteRegistro | null {
  hidratar();
  return memoria[matchId] ?? null;
}

export function listarMatchIdsConvitePorDemanda(demandaId: string): string[] {
  return listarMatchesConvite()
    .filter((ctx) => ctx.demanda.id === demandaId)
    .map((ctx) => ctx.match.id);
}

/**
 * Cria a mesma estrutura de match sugerido usada nas sugestões por demanda.
 * Retorna o matchId para navegar à negociação.
 */
export function criarMatchConvite(params: {
  creator: CreatorCatalogo;
  item: MinhaDemandaItem;
  empresaNome?: string;
}): string {
  hidratar();

  const matchId = novoId("match-convite");
  const score = scoreMockParaConvite(params.creator, params.item);

  const match: Match = {
    id: matchId,
    demandaId: params.item.demanda.id,
    influenciadorId: params.creator.id,
    score,
    status: "sugerido",
  };

  const contexto: NegociacaoContexto = {
    match,
    demanda: { ...params.item.demanda },
    influenciador: {
      id: params.creator.id,
      nome: params.creator.nome,
      nicho: nomeNicho(params.creator.nichoId),
      seguidores: params.creator.seguidores,
      engajamentoMedio: params.creator.engajamentoMedio,
      notaMedia: params.creator.notaMediaAvaliacao,
      totalAvaliacoes: params.creator.totalAvaliacoes,
    },
    empresa: {
      id: params.item.demanda.empresaId,
      nome: params.empresaNome ?? "Sua empresa",
      usuarioId: EMPRESA_NEGOCIACAO_USUARIO_ID,
    },
    influenciadorUsuarioId: params.creator.usuarioId,
    taxaDesbloqueio: TAXA_DESBLOQUEIO_PADRAO,
  };

  memoria[matchId] = contexto;
  persistir();
  return matchId;
}
