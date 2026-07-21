import { listarMatchesConvite } from "@/lib/empresa/convite-match";
import { NEGOCIACAO_CONTEXTOS } from "@/lib/mock-data/negociacao";
import { influenciadorAtivoEmListagens } from "@/lib/mock-data/influenciadores-status";
import type { NegociacaoContexto } from "@/lib/negociacao/negociacao-types";

export type MatchDemandaResumo = {
  matchId: string;
  influenciadorNome: string;
  score: number;
};

/** Vínculos demo entre demandas da empresa e negociações disponíveis. */
const DEMANDA_MATCH_OVERRIDES: Record<string, string[]> = {
  "minha-dem-001": ["match-001", "match-002"],
  "minha-dem-002": ["match-001"],
  "minha-dem-003": ["match-001"],
  "minha-dem-005": ["match-002"],
};

function contextoElegivel(ctx: NegociacaoContexto): boolean {
  return (
    influenciadorAtivoEmListagens(ctx.influenciadorUsuarioId) &&
    influenciadorAtivoEmListagens(ctx.influenciador.id)
  );
}

function resumoDeContexto(ctx: NegociacaoContexto): MatchDemandaResumo | null {
  if (!contextoElegivel(ctx)) return null;
  return {
    matchId: ctx.match.id,
    influenciadorNome: ctx.influenciador.nome,
    score: ctx.match.score,
  };
}

function resumoMatch(matchId: string): MatchDemandaResumo | null {
  const ctx = NEGOCIACAO_CONTEXTOS[matchId];
  if (!ctx) return null;
  return resumoDeContexto(ctx);
}

/** Retorna negociações vinculadas a uma demanda (apenas influenciadores ativos). */
export function listarMatchesPorDemanda(demandaId: string): MatchDemandaResumo[] {
  const porDemanda = Object.values(NEGOCIACAO_CONTEXTOS)
    .filter((ctx) => ctx.demanda.id === demandaId)
    .map(resumoDeContexto)
    .filter((m): m is MatchDemandaResumo => m !== null);

  const convites = listarMatchesConvite()
    .filter((ctx) => ctx.demanda.id === demandaId)
    .map(resumoDeContexto)
    .filter((m): m is MatchDemandaResumo => m !== null);

  const unidos = [...porDemanda, ...convites];
  if (unidos.length > 0) {
    const vistos = new Set<string>();
    return unidos.filter((m) => {
      if (vistos.has(m.matchId)) return false;
      vistos.add(m.matchId);
      return true;
    });
  }

  const overrides = DEMANDA_MATCH_OVERRIDES[demandaId] ?? [];
  return overrides
    .map((matchId) => resumoMatch(matchId))
    .filter((m): m is MatchDemandaResumo => m !== null);
}
