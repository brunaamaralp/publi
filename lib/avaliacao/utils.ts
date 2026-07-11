import type { Avaliacao } from "@/lib/types";

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
    return minutos <= 1 ? "há 1 minuto" : `há ${minutos} minutos`;
  }

  const horas = Math.floor(minutos / 60);
  if (horas < 24) {
    return horas === 1 ? "há 1 hora" : `há ${horas} horas`;
  }

  const dias = Math.floor(horas / 24);
  if (dias < 7) {
    return dias === 1 ? "há 1 dia" : `há ${dias} dias`;
  }

  const semanas = Math.floor(dias / 7);
  if (semanas < 5) {
    return semanas === 1 ? "há 1 semana" : `há ${semanas} semanas`;
  }

  const meses = Math.floor(dias / 30);
  if (meses < 12) {
    return meses === 1 ? "há 1 mês" : `há ${meses} meses`;
  }

  const anos = Math.floor(dias / 365);
  return anos === 1 ? "há 1 ano" : `há ${anos} anos`;
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
