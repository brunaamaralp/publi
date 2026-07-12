import type { Contrato } from "@/lib/types";

import {
  criarMensagensIniciais,
  getNegociacaoContexto,
} from "@/lib/mock-data/negociacao";
import type {
  NegociacaoEstado,
  NegociacaoContexto,
} from "@/lib/negociacao/negociacao-types";

const STORAGE_PREFIX = "negociacao-estado-";

function storageKey(matchId: string) {
  return `${STORAGE_PREFIX}${matchId}`;
}

function criarEstadoInicial(matchId: string): NegociacaoEstado {
  const conversaId = `conv-${matchId}`;
  return {
    matchId,
    conversa: {
      id: conversaId,
      contratoId: "",
    },
    desbloqueado: false,
    mensagens: [],
    contrato: null,
    etapaContrato: "nenhuma",
    assinaturaEmpresa: false,
    assinaturaInfluenciador: false,
  };
}

export function carregarNegociacaoEstado(
  matchId: string,
): NegociacaoEstado | null {
  const ctx = getNegociacaoContexto(matchId);
  if (!ctx) return null;

  if (typeof window === "undefined") {
    return criarEstadoInicial(matchId);
  }

  const salvo = localStorage.getItem(storageKey(matchId));
  if (!salvo) {
    return criarEstadoInicial(matchId);
  }

  try {
    return JSON.parse(salvo) as NegociacaoEstado;
  } catch {
    return criarEstadoInicial(matchId);
  }
}

export function salvarNegociacaoEstado(estado: NegociacaoEstado) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(estado.matchId), JSON.stringify(estado));
}

export function desbloquearChat(
  estado: NegociacaoEstado,
  ctx: NegociacaoContexto,
): NegociacaoEstado {
  const mensagens =
    estado.mensagens.length > 0
      ? estado.mensagens
      : criarMensagensIniciais(estado.conversa.id, ctx);

  return {
    ...estado,
    desbloqueado: true,
    desbloqueadoEm: new Date().toISOString(),
    mensagens,
  };
}

export function gerarContratoRascunho(
  estado: NegociacaoEstado,
  dados: { escopo: string; valor: number; prazoEntrega: string },
): NegociacaoEstado {
  const contrato: Contrato = {
    id: crypto.randomUUID(),
    matchId: estado.matchId,
    escopo: dados.escopo.trim(),
    valor: dados.valor,
    prazoEntrega: dados.prazoEntrega,
    status: "rascunho",
  };

  return {
    ...estado,
    contrato,
    conversa: { ...estado.conversa, contratoId: contrato.id },
    etapaContrato: "documento",
    assinaturaEmpresa: false,
    assinaturaInfluenciador: false,
  };
}

export function assinarContratoEmpresa(estado: NegociacaoEstado): NegociacaoEstado {
  if (!estado.contrato) return estado;
  return { ...estado, assinaturaEmpresa: true };
}

export function assinarContratoInfluenciador(
  estado: NegociacaoEstado,
): NegociacaoEstado {
  if (!estado.contrato || !estado.assinaturaEmpresa) return estado;

  return {
    ...estado,
    assinaturaInfluenciador: true,
    etapaContrato: "nenhuma",
    contrato: {
      ...estado.contrato,
      status: "assinado",
      dataAssinatura: new Date().toISOString(),
    },
  };
}

export const LABELS_STATUS_CONTRATO: Record<Contrato["status"], string> = {
  rascunho: "Rascunho",
  assinado: "Assinado",
  em_execucao: "Em execução",
  cumprido: "Cumprido",
  cancelado: "Cancelado",
  em_disputa: "Em disputa",
};
