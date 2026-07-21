import type { Avaliacao } from "@/lib/types";

import {
  MIN_AVALIACOES_NOTA_PUBLICA,
  creatorExibeNota,
} from "@/lib/empresa/creator-catalogo-types";

export { MIN_AVALIACOES_NOTA_PUBLICA, creatorExibeNota };

export const LABELS_NOTA: Record<number, string> = {
  1: "Muito ruim",
  2: "Ruim",
  3: "Regular",
  4: "Bom",
  5: "Excelente",
};

export function calcularMediaAvaliacoes(avaliacoes: Avaliacao[]): number | null {
  if (avaliacoes.length === 0) return null;
  const soma = avaliacoes.reduce((acc, a) => acc + a.notaFornecedor, 0);
  return soma / avaliacoes.length;
}

/** Cold-start: m?dia p?blica s? com o m?nimo de avalia??es. */
export function mediaPublicaAvaliacoes(
  avaliacoes: Avaliacao[],
): number | null {
  if (avaliacoes.length < MIN_AVALIACOES_NOTA_PUBLICA) return null;
  return calcularMediaAvaliacoes(avaliacoes);
}

export function exibeNotaPublica(params: {
  totalAvaliacoes: number;
  notaMedia: number | null;
}): boolean {
  return creatorExibeNota({
    totalAvaliacoes: params.totalAvaliacoes,
    notaMediaAvaliacao: params.notaMedia,
  });
}

export function formatarMedia(media: number): string {
  return media.toFixed(1);
}

export function formatarDataRelativa(iso: string): string {
  const agora = Date.now();
  const data = new Date(iso).getTime();
  const diffMs = agora - data;

  if (diffMs < 0) return "agora";

  const minutos = Math.floor(diffMs / (1000 * 60));
  if (minutos < 60) {
    return minutos <= 1 ? "h? 1 minuto" : `h? ${minutos} minutos`;
  }

  const horas = Math.floor(minutos / 60);
  if (horas < 24) {
    return horas === 1 ? "h? 1 hora" : `h? ${horas} horas`;
  }

  const dias = Math.floor(horas / 24);
  if (dias < 7) {
    return dias === 1 ? "h? 1 dia" : `h? ${dias} dias`;
  }

  const semanas = Math.floor(dias / 7);
  if (semanas < 5) {
    return semanas === 1 ? "h? 1 semana" : `h? ${semanas} semanas`;
  }

  const meses = Math.floor(dias / 30);
  if (meses < 12) {
    return meses === 1 ? "h? 1 m?s" : `h? ${meses} meses`;
  }

  const anos = Math.floor(dias / 365);
  return anos === 1 ? "h? 1 ano" : `h? ${anos} anos`;
}

export function jaAvaliouContrato(
  avaliacoes: Avaliacao[],
  contratoId: string,
  avaliadorId: string,
): boolean {
  return avaliacoes.some(
    (a) => a.contratoId === contratoId && a.avaliadorId === avaliadorId,
  );
}

/** Avalia??o da contraparte s? ? p?blica quando ambos os lados j? avaliaram. */
export function avaliacaoMutuaRevelada(
  avaliacoes: Avaliacao[],
  contratoId: string,
  avaliadorIdA: string,
  avaliadorIdB: string,
): boolean {
  return (
    jaAvaliouContrato(avaliacoes, contratoId, avaliadorIdA) &&
    jaAvaliouContrato(avaliacoes, contratoId, avaliadorIdB)
  );
}

export function avaliacaoDaParte(
  avaliacoes: Avaliacao[],
  contratoId: string,
  avaliadorId: string,
): Avaliacao | undefined {
  return avaliacoes.find(
    (a) => a.contratoId === contratoId && a.avaliadorId === avaliadorId,
  );
}

const AVALIACOES_STORAGE_KEY = "avaliacoes-contrato-v1";

export function carregarAvaliacoesContrato(contratoId: string): Avaliacao[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(AVALIACOES_STORAGE_KEY);
    if (!raw) return [];
    const todas = JSON.parse(raw) as Avaliacao[];
    return todas.filter((a) => a.contratoId === contratoId);
  } catch {
    return [];
  }
}

export function salvarAvaliacaoContrato(avaliacao: Avaliacao): Avaliacao[] {
  if (typeof window === "undefined") return [avaliacao];
  let todas: Avaliacao[] = [];
  try {
    const raw = localStorage.getItem(AVALIACOES_STORAGE_KEY);
    if (raw) todas = JSON.parse(raw) as Avaliacao[];
  } catch {
    todas = [];
  }
  const semDuplicata = todas.filter(
    (a) =>
      !(
        a.contratoId === avaliacao.contratoId &&
        a.avaliadorId === avaliacao.avaliadorId
      ),
  );
  const next = [...semDuplicata, avaliacao];
  localStorage.setItem(AVALIACOES_STORAGE_KEY, JSON.stringify(next));
  return next.filter((a) => a.contratoId === avaliacao.contratoId);
}
