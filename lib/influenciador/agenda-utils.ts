import { diaSemanaDeDataIso } from "@/lib/influenciador/atuacao-utils";
import type { DisponibilidadeInfluenciador } from "@/lib/types/influenciador";

export const DIAS_AGENDA_PADRAO = 45;

/** Normaliza para `YYYY-MM-DD` (dia civil local). */
export function dataParaIsoLocal(data: Date): string {
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, "0");
  const d = String(data.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function hojeIsoLocal(): string {
  return dataParaIsoLocal(new Date());
}

/** Gera os próximos `quantidade` dias a partir de hoje (inclusive). */
export function listarProximosDiasIso(quantidade = DIAS_AGENDA_PADRAO): string[] {
  const dias: string[] = [];
  const base = new Date();
  base.setHours(12, 0, 0, 0);
  for (let i = 0; i < quantidade; i += 1) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    dias.push(dataParaIsoLocal(d));
  }
  return dias;
}

/**
 * Data indisponível se estiver em `datasIndisponiveis`, ou — quando há
 * `diasSemana` preenchido (fluxo modelo) — se o dia da semana não estiver na lista.
 */
export function dataEstaDisponivel(
  disponibilidade: DisponibilidadeInfluenciador | undefined,
  dataIso: string,
): boolean {
  const bloqueadas = disponibilidade?.datasIndisponiveis ?? [];
  if (bloqueadas.includes(dataIso)) return false;

  const diasSemana = disponibilidade?.diasSemana;
  if (diasSemana && diasSemana.length > 0) {
    const dia = diaSemanaDeDataIso(dataIso);
    if (dia && !diasSemana.includes(dia)) return false;
  }

  return true;
}

export function formatarDataAgendaCurta(dataIso: string): string {
  const data = new Date(`${dataIso}T12:00:00`);
  if (Number.isNaN(data.getTime())) return dataIso;
  return data.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export function formatarDataAgendaLonga(dataIso: string): string {
  const data = new Date(`${dataIso}T12:00:00`);
  if (Number.isNaN(data.getTime())) return dataIso;
  return data.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** ISO relativos a hoje — úteis em mocks. */
export function isoDiasAPartirDeHoje(offset: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return dataParaIsoLocal(d);
}
