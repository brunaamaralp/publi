import type { ProgressoTreinamento, Treinamento } from "@/lib/types";

import {
  INFLUENCIADOR_GAMIFICACAO_INICIAL,
  PROGRESSO_TREINAMENTOS_INICIAL,
  type InfluenciadorGamificacaoMock,
} from "@/lib/mock-data/treinamentos";

const STORAGE_KEY = "treinamentos-estado";

export const XP_POR_TREINAMENTO = 80;

/** XP acumulado necessário para atingir cada nível (nível 1 começa em 0). */
export const XP_POR_NIVEL: Record<number, number> = {
  1: 0,
  2: 300,
  3: 800,
};

export const NIVEL_MAXIMO = 3;

export const LABELS_NIVEL: Record<number, string> = {
  1: "Iniciante",
  2: "Pro",
  3: "Elite",
};

export type TreinamentosEstado = {
  influenciador: InfluenciadorGamificacaoMock;
  progressos: ProgressoTreinamento[];
};

export function carregarEstadoTreinamentos(): TreinamentosEstado {
  const inicial: TreinamentosEstado = {
    influenciador: { ...INFLUENCIADOR_GAMIFICACAO_INICIAL },
    progressos: [...PROGRESSO_TREINAMENTOS_INICIAL],
  };

  if (typeof window === "undefined") return inicial;

  const salvo = localStorage.getItem(STORAGE_KEY);
  if (!salvo) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inicial));
    return inicial;
  }

  try {
    return JSON.parse(salvo) as TreinamentosEstado;
  } catch {
    return inicial;
  }
}

export function salvarEstadoTreinamentos(estado: TreinamentosEstado) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
}

export function getProgressoTreinamento(
  progressos: ProgressoTreinamento[],
  treinamentoId: string,
  influenciadorId: string,
): ProgressoTreinamento["status"] {
  const p = progressos.find(
    (pr) =>
      pr.treinamentoId === treinamentoId &&
      pr.influenciadorId === influenciadorId,
  );
  return p?.status ?? "nao_iniciado";
}

export function calcularNivelPorXp(pontosXp: number): number {
  if (pontosXp >= XP_POR_NIVEL[3]!) return 3;
  if (pontosXp >= XP_POR_NIVEL[2]!) return 2;
  return 1;
}

export function xpProximoNivel(nivelAtual: number): number | null {
  if (nivelAtual >= NIVEL_MAXIMO) return null;
  return XP_POR_NIVEL[nivelAtual + 1]!;
}

export function xpNivelAtual(nivelAtual: number): number {
  return XP_POR_NIVEL[nivelAtual] ?? 0;
}

/** Percentual 0–100 de progresso de XP até o próximo nível. */
export function percentualXpProximoNivel(
  pontosXp: number,
  nivelAtual: number,
): number {
  const proximo = xpProximoNivel(nivelAtual);
  if (proximo === null) return 100;

  const base = xpNivelAtual(nivelAtual);
  const faixa = proximo - base;
  if (faixa <= 0) return 100;

  const progresso = pontosXp - base;
  return Math.min(100, Math.max(0, Math.round((progresso / faixa) * 100)));
}

export function treinamentoDisponivel(
  treinamento: Treinamento,
  nivelAtual: number,
): boolean {
  return nivelAtual >= treinamento.nivelRequerido;
}

export function concluirTreinamento(
  estado: TreinamentosEstado,
  treinamento: Treinamento,
): TreinamentosEstado {
  const { influenciador, progressos } = estado;
  const existente = progressos.find(
    (p) =>
      p.treinamentoId === treinamento.id &&
      p.influenciadorId === influenciador.id,
  );

  const novosProgressos = existente
    ? progressos.map((p) =>
        p.id === existente.id
          ? {
              ...p,
              status: "concluido" as const,
              dataConclusao: new Date().toISOString(),
            }
          : p,
      )
    : [
        ...progressos,
        {
          id: crypto.randomUUID(),
          influenciadorId: influenciador.id,
          treinamentoId: treinamento.id,
          status: "concluido" as const,
          dataConclusao: new Date().toISOString(),
        },
      ];

  const jaConcluido = existente?.status === "concluido";
  const novosXp = jaConcluido
    ? influenciador.pontosXp
    : influenciador.pontosXp + XP_POR_TREINAMENTO;
  const novoNivel = calcularNivelPorXp(novosXp);

  return {
    progressos: novosProgressos,
    influenciador: {
      ...influenciador,
      pontosXp: novosXp,
      nivelAtual: novoNivel,
    },
  };
}

export function agruparPorCategoria(
  treinamentos: Treinamento[],
): Record<string, Treinamento[]> {
  return treinamentos.reduce<Record<string, Treinamento[]>>((acc, t) => {
    if (!acc[t.categoria]) acc[t.categoria] = [];
    acc[t.categoria]!.push(t);
    return acc;
  }, {});
}

export const LABELS_STATUS_PROGRESSO: Record<
  ProgressoTreinamento["status"],
  string
> = {
  nao_iniciado: "Não iniciado",
  em_andamento: "Em andamento",
  concluido: "Concluído",
};
