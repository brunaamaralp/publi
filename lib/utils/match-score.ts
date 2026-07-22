import { disponibilidadeCobrePrazo } from "@/lib/influenciador/atuacao-utils";
import type { DisponibilidadeInfluenciador } from "@/lib/types/influenciador";

/** Entrada mínima da demanda para o score de modelo (sem engajamento). */
export type DemandaParaScoreModelo = {
  nichoId?: string;
  prazo: string;
  /** Localidades do público-alvo (cidade, UF ou região). */
  localidades?: string[];
};

/** Perfil mínimo do creator para o score de modelo. */
export type PerfilParaScoreModelo = {
  nichoId: string;
  cidade: string;
  estado: string;
  disponibilidade?: DisponibilidadeInfluenciador;
};

function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function scoreNicho(
  demandaNichoId: string | undefined,
  perfilNichoId: string,
): number {
  if (!demandaNichoId) return 22;
  if (demandaNichoId === perfilNichoId) return 40;
  return 12;
}

function scoreRegiao(
  localidades: string[] | undefined,
  cidade: string,
  estado: string,
): number {
  if (!localidades || localidades.length === 0) return 18;

  const cidadeN = normalizarTexto(cidade);
  const estadoN = normalizarTexto(estado);
  let melhor = 8;

  for (const loc of localidades) {
    const locN = normalizarTexto(loc);
    if (!locN) continue;
    if (locN === "brasil" || locN === "todo o brasil") {
      melhor = Math.max(melhor, 28);
      continue;
    }
    if (cidadeN && (cidadeN.includes(locN) || locN.includes(cidadeN))) {
      melhor = Math.max(melhor, 35);
      continue;
    }
    if (estadoN && (estadoN === locN || locN.includes(estadoN))) {
      melhor = Math.max(melhor, 28);
    }
  }

  return melhor;
}

function scoreDisponibilidade(
  disponibilidade: DisponibilidadeInfluenciador | undefined,
  prazo: string,
): number {
  const cobre = disponibilidadeCobrePrazo(disponibilidade, prazo);
  if (cobre === true) return 25;
  if (cobre === false) return 4;
  // Sem disponibilidade informada — neutro (não pune o MVP).
  return 14;
}

/**
 * Bônus de nível/treinamento no score de match (0–8 pts).
 * Nível 1 = 0; nível 2 = 4; nível 3+ = 8.
 */
export function bonusScorePorNivel(nivelAtual: number | undefined): number {
  if (!nivelAtual || nivelAtual <= 1) return 0;
  if (nivelAtual === 2) return 4;
  return 8;
}

/**
 * Compatibilidade para atuação como modelo: nicho + região + disponibilidade.
 * Não usa seguidores/engajamento — função separada do score de influenciador.
 * Aceita `nivelAtual` opcional (mesmo bônus do score de influenciador).
 */
export function calcularScoreModelo(
  demanda: DemandaParaScoreModelo,
  perfil: PerfilParaScoreModelo & { nivelAtual?: number },
): number {
  const total =
    scoreNicho(demanda.nichoId, perfil.nichoId) +
    scoreRegiao(demanda.localidades, perfil.cidade, perfil.estado) +
    scoreDisponibilidade(perfil.disponibilidade, demanda.prazo) +
    bonusScorePorNivel(perfil.nivelAtual);

  return Math.min(98, Math.max(40, Math.round(total)));
}
