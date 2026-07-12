import type { ResultadoCampanha } from "@/lib/types";

import { RESULTADOS_CAMPANHA_MOCK } from "@/lib/mock-data/resultados";
import type { ResultadoCampanhaRegistro } from "@/lib/mock-data/resultados";
import type { ResultadoFormInput } from "@/lib/schemas/resultado-form";

const STORAGE_KEY = "resultados-campanha";

export const LABELS_STATUS_RESULTADO: Record<
  ResultadoCampanha["status"],
  string
> = {
  nao_solicitado: "Não solicitado",
  solicitado: "Solicitado",
  preenchido: "Preenchido",
  validado: "Validado",
};

export function calcularTaxaEngajamento(
  engajamentoTotal: number,
  alcance: number,
): number {
  if (alcance <= 0) return 0;
  return Math.round((engajamentoTotal / alcance) * 10000) / 100;
}

export function carregarResultados(): ResultadoCampanhaRegistro[] {
  if (typeof window === "undefined") return RESULTADOS_CAMPANHA_MOCK;

  const salvo = localStorage.getItem(STORAGE_KEY);
  if (!salvo) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(RESULTADOS_CAMPANHA_MOCK));
    return RESULTADOS_CAMPANHA_MOCK;
  }

  try {
    return JSON.parse(salvo) as ResultadoCampanhaRegistro[];
  } catch {
    return RESULTADOS_CAMPANHA_MOCK;
  }
}

export function salvarResultados(registros: ResultadoCampanhaRegistro[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
}

export function listarPendentesInfluenciador(
  registros: ResultadoCampanhaRegistro[],
  influenciadorId: string,
): ResultadoCampanhaRegistro[] {
  return registros.filter(
    (r) =>
      r.meta.influenciadorId === influenciadorId &&
      (r.resultado.status === "nao_solicitado" ||
        r.resultado.status === "solicitado"),
  );
}

export function solicitarResultado(
  registros: ResultadoCampanhaRegistro[],
  contratoId: string,
  solicitadoPorUsuarioId: string,
): ResultadoCampanhaRegistro[] {
  return registros.map((r) =>
    r.resultado.contratoId === contratoId
      ? {
          ...r,
          resultado: {
            ...r.resultado,
            status: "solicitado",
            solicitadoPorUsuarioId,
          },
        }
      : r,
  );
}

export function preencherResultado(
  registros: ResultadoCampanhaRegistro[],
  resultadoId: string,
  dados: ResultadoFormInput,
): ResultadoCampanhaRegistro[] {
  return registros.map((r) =>
    r.resultado.id === resultadoId
      ? {
          ...r,
          resultado: {
            ...r.resultado,
            ...dados,
            status: "preenchido",
            linkComprovante: dados.linkComprovante || undefined,
            observacoes: dados.observacoes?.trim() || undefined,
          },
        }
      : r,
  );
}

export type MetricasConsolidadas = {
  totalCampanhas: number;
  somaImpressoes: number;
  mediaAlcance: number;
  somaCliques: number;
  mediaTaxaEngajamento: number;
};

export function consolidarResultadosEmpresa(
  registros: ResultadoCampanhaRegistro[],
  empresaId: string,
): MetricasConsolidadas | null {
  const preenchidos = registros.filter(
    (r) =>
      r.meta.empresaId === empresaId &&
      (r.resultado.status === "preenchido" ||
        r.resultado.status === "validado") &&
      r.resultado.impressoes !== undefined,
  );

  if (preenchidos.length === 0) return null;

  const somaImpressoes = preenchidos.reduce(
    (acc, r) => acc + (r.resultado.impressoes ?? 0),
    0,
  );
  const somaAlcance = preenchidos.reduce(
    (acc, r) => acc + (r.resultado.alcance ?? 0),
    0,
  );
  const somaCliques = preenchidos.reduce(
    (acc, r) => acc + (r.resultado.cliques ?? 0),
    0,
  );
  const somaTaxa = preenchidos.reduce(
    (acc, r) => acc + (r.resultado.taxaEngajamento ?? 0),
    0,
  );

  return {
    totalCampanhas: preenchidos.length,
    somaImpressoes,
    mediaAlcance: Math.round(somaAlcance / preenchidos.length),
    somaCliques,
    mediaTaxaEngajamento:
      Math.round((somaTaxa / preenchidos.length) * 100) / 100,
  };
}

export function formatarNumeroGrande(valor: number): string {
  if (valor >= 1_000_000) {
    return `${(valor / 1_000_000).toFixed(1)}M`;
  }
  if (valor >= 1_000) {
    return `${(valor / 1_000).toFixed(1)}k`;
  }
  return valor.toLocaleString("pt-BR");
}
