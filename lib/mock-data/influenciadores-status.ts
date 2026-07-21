import type { Usuario } from "@/lib/types/usuario";

import { INFLUENCIADOR_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import { CREATORS_CATALOGO_MOCK } from "@/lib/mock-data/creators-catalogo";

/** Perfil/usuário suspenso — só para validar exclusão das listagens. */
export const INFLUENCIADOR_SUSPENSO_MOCK_ID = "inf-suspenso-001";
export const INFLUENCIADOR_SUSPENSO_USUARIO_ID = "usr-influ-suspenso-001";

/** Perfil/usuário pendente — só para validar exclusão das listagens. */
export const INFLUENCIADOR_PENDENTE_MOCK_ID = "inf-pendente-001";
export const INFLUENCIADOR_PENDENTE_USUARIO_ID = "usr-influ-pendente-001";

const OVERRIDES_STORAGE_KEY = "status-conta-overrides-v1";

/**
 * Status de conta por id de perfil ou de usuário.
 * IDs ausentes não são tratados como ativos (fail-closed).
 */
const STATUS_CONTA_BASE: Record<string, Usuario["status"]> = {
  [INFLUENCIADOR_MOCK_ID]: "ativo",
  /** Mesmo id usado em lib/mock-data/negociacao.ts */
  "usr-influ-neg-001": "ativo",
  [INFLUENCIADOR_SUSPENSO_MOCK_ID]: "suspenso",
  [INFLUENCIADOR_SUSPENSO_USUARIO_ID]: "suspenso",
  [INFLUENCIADOR_PENDENTE_MOCK_ID]: "pendente_verificacao",
  [INFLUENCIADOR_PENDENTE_USUARIO_ID]: "pendente_verificacao",
};

for (const creator of CREATORS_CATALOGO_MOCK) {
  STATUS_CONTA_BASE[creator.id] = creator.status;
  STATUS_CONTA_BASE[creator.usuarioId] = creator.status;
}

let overridesHidratados = false;
const overridesMemoria: Record<string, Usuario["status"]> = {};

function hidratarOverrides(): void {
  if (overridesHidratados || typeof window === "undefined") return;
  overridesHidratados = true;
  try {
    const raw = localStorage.getItem(OVERRIDES_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, Usuario["status"]>;
    Object.assign(overridesMemoria, parsed);
  } catch {
    // ignore
  }
}

function persistirOverrides(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overridesMemoria));
}

export function statusContaInfluenciador(
  id: string,
): Usuario["status"] | undefined {
  hidratarOverrides();
  return overridesMemoria[id] ?? STATUS_CONTA_BASE[id];
}

/** Único critério de elegibilidade para busca/sugestão/feed de matches. */
export function influenciadorAtivoEmListagens(id: string): boolean {
  return statusContaInfluenciador(id) === "ativo";
}

/**
 * Atualiza o status consultado pelas listagens (busca, portfólio, matches).
 * Aceita um ou mais ids (perfil e/ou usuário) para o mesmo efeito.
 */
export function definirStatusConta(
  ids: string | string[],
  status: Usuario["status"],
): void {
  hidratarOverrides();
  const lista = Array.isArray(ids) ? ids : [ids];
  for (const id of lista) {
    if (!id) continue;
    overridesMemoria[id] = status;
  }
  persistirOverrides();
}
