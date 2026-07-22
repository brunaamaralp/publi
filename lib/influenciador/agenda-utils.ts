import { diaSemanaDeDataIso } from "@/lib/influenciador/atuacao-utils";
import type { DisponibilidadeInfluenciador } from "@/lib/types/influenciador";

export const DIAS_AGENDA_PADRAO = 45;
/** Sugestões compactas no checkout/chat. */
export const DIAS_SUGESTAO_SELECAO = 8;

export type EstadoDiaAgenda =
  | "disponivel"
  | "ocupado"
  | "bloqueado"
  | "fora_regra";

export const LABELS_ESTADO_AGENDA: Record<EstadoDiaAgenda, string> = {
  disponivel: "Disponível",
  ocupado: "Ocupado",
  bloqueado: "Bloqueado",
  fora_regra: "Fora da rotina",
};

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
 * Classifica o dia: ocupado (contrato) > bloqueado (manual) > fora da
 * regra semanal > disponível.
 */
export function estadoDiaAgenda(
  disponibilidade: DisponibilidadeInfluenciador | undefined,
  dataIso: string,
): EstadoDiaAgenda {
  if (disponibilidade?.datasIndisponiveis?.includes(dataIso)) {
    return "ocupado";
  }
  if (disponibilidade?.datasBloqueadas?.includes(dataIso)) {
    return "bloqueado";
  }

  const diasSemana = disponibilidade?.diasSemana;
  if (diasSemana && diasSemana.length > 0) {
    const dia = diaSemanaDeDataIso(dataIso);
    if (dia && !diasSemana.includes(dia)) return "fora_regra";
  }

  return "disponivel";
}

/**
 * Data indisponível se estiver ocupada, bloqueada ou — quando há
 * `diasSemana` preenchido — se o dia da semana não estiver na lista.
 */
export function dataEstaDisponivel(
  disponibilidade: DisponibilidadeInfluenciador | undefined,
  dataIso: string,
): boolean {
  return estadoDiaAgenda(disponibilidade, dataIso) === "disponivel";
}

/** Próximas datas livres a partir de hoje (inclusive). */
export function listarProximasDatasDisponiveis(
  disponibilidade: DisponibilidadeInfluenciador | undefined,
  quantidade = DIAS_SUGESTAO_SELECAO,
  janelaBusca = DIAS_AGENDA_PADRAO,
): string[] {
  return listarProximosDiasIso(janelaBusca)
    .filter((d) => dataEstaDisponivel(disponibilidade, d))
    .slice(0, quantidade);
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

/** Rotulo curto do weekday (sem vírgula frágil). */
export function weekdayCurtoDeIso(dataIso: string): string {
  const data = new Date(`${dataIso}T12:00:00`);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
}

export function diaDoMesDeIso(dataIso: string): string {
  return dataIso.slice(8, 10);
}

/** ISO relativos a hoje — úteis em mocks. */
export function isoDiasAPartirDeHoje(offset: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return dataParaIsoLocal(d);
}

export function mesAnoDeReferencia(ref: Date = new Date()): {
  ano: number;
  mes: number;
} {
  return { ano: ref.getFullYear(), mes: ref.getMonth() };
}

export function adicionarMeses(
  ano: number,
  mes: number,
  delta: number,
): { ano: number; mes: number } {
  const d = new Date(ano, mes + delta, 1);
  return { ano: d.getFullYear(), mes: d.getMonth() };
}

export function rotuloMesAno(ano: number, mes: number): string {
  const d = new Date(ano, mes, 1);
  const texto = d.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Células do calendário mensal (semana começa na segunda).
 * `dataIso` null = preenchimento vazio do grid.
 */
export function listarCelulasMes(
  ano: number,
  mes: number,
): Array<{ dataIso: string | null; foraDoMes: boolean }> {
  const primeiro = new Date(ano, mes, 1, 12, 0, 0, 0);
  const ultimo = new Date(ano, mes + 1, 0, 12, 0, 0, 0);
  // getDay: 0=dom … → segunda=0
  const offsetSegunda = (primeiro.getDay() + 6) % 7;
  const totalDias = ultimo.getDate();
  const celulas: Array<{ dataIso: string | null; foraDoMes: boolean }> = [];

  for (let i = 0; i < offsetSegunda; i += 1) {
    celulas.push({ dataIso: null, foraDoMes: true });
  }
  for (let dia = 1; dia <= totalDias; dia += 1) {
    celulas.push({
      dataIso: dataParaIsoLocal(new Date(ano, mes, dia, 12, 0, 0, 0)),
      foraDoMes: false,
    });
  }
  while (celulas.length % 7 !== 0) {
    celulas.push({ dataIso: null, foraDoMes: true });
  }
  return celulas;
}

/** Alterna bloqueio manual; não altera datas ocupadas por contrato. */
export function alternarBloqueioData(
  disponibilidade: DisponibilidadeInfluenciador | undefined,
  dataIso: string,
): DisponibilidadeInfluenciador {
  const base: DisponibilidadeInfluenciador = {
    diasSemana: disponibilidade?.diasSemana ?? [],
    observacao: disponibilidade?.observacao,
    datasIndisponiveis: disponibilidade?.datasIndisponiveis,
    datasBloqueadas: [...(disponibilidade?.datasBloqueadas ?? [])],
  };

  if (base.datasIndisponiveis?.includes(dataIso)) {
    return base;
  }

  const set = new Set(base.datasBloqueadas);
  if (set.has(dataIso)) set.delete(dataIso);
  else set.add(dataIso);

  return {
    ...base,
    datasBloqueadas: Array.from(set).sort(),
  };
}
