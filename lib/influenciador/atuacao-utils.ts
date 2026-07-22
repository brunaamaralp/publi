import type {
  DiaSemana,
  DisponibilidadeInfluenciador,
  TipoAtuacao,
} from "@/lib/types/influenciador";

export const TIPOS_ATUACAO_PADRAO: TipoAtuacao[] = ["influenciador"];

export const DIAS_SEMANA: { id: DiaSemana; label: string; labelCurto: string }[] =
  [
    { id: "seg", label: "Segunda", labelCurto: "Seg" },
    { id: "ter", label: "Terça", labelCurto: "Ter" },
    { id: "qua", label: "Quarta", labelCurto: "Qua" },
    { id: "qui", label: "Quinta", labelCurto: "Qui" },
    { id: "sex", label: "Sexta", labelCurto: "Sex" },
    { id: "sab", label: "Sábado", labelCurto: "Sáb" },
    { id: "dom", label: "Domingo", labelCurto: "Dom" },
  ];

/** JS `Date.getDay()`: 0 = domingo … 6 = sábado → nosso `DiaSemana`. */
const JS_DAY_PARA_DIA: DiaSemana[] = [
  "dom",
  "seg",
  "ter",
  "qua",
  "qui",
  "sex",
  "sab",
];

export function normalizarTiposAtuacao(
  tipos?: TipoAtuacao[] | null,
): TipoAtuacao[] {
  if (!tipos || tipos.length === 0) return [...TIPOS_ATUACAO_PADRAO];
  const unicos = Array.from(new Set(tipos));
  return unicos.length > 0 ? unicos : [...TIPOS_ATUACAO_PADRAO];
}

export function atuaComo(
  tipos: TipoAtuacao[] | null | undefined,
  papel: TipoAtuacao,
): boolean {
  return normalizarTiposAtuacao(tipos).includes(papel);
}

export function ehSomenteModelo(
  tipos: TipoAtuacao[] | null | undefined,
): boolean {
  const n = normalizarTiposAtuacao(tipos);
  return n.length === 1 && n[0] === "modelo";
}

export function tambemAtuaComoModelo(
  tipos: TipoAtuacao[] | null | undefined,
): boolean {
  const n = normalizarTiposAtuacao(tipos);
  return n.includes("modelo") && n.includes("influenciador");
}

export function diaSemanaDeDataIso(prazoIso: string): DiaSemana | null {
  const data = new Date(`${prazoIso}T12:00:00`);
  if (Number.isNaN(data.getTime())) return null;
  return JS_DAY_PARA_DIA[data.getDay()] ?? null;
}

export function disponibilidadeCobrePrazo(
  disponibilidade: DisponibilidadeInfluenciador | undefined,
  prazoIso: string,
): boolean | null {
  if (!disponibilidade) return null;

  const dataIso = prazoIso.slice(0, 10);
  if (disponibilidade.datasIndisponiveis?.includes(dataIso)) {
    return false;
  }
  if (disponibilidade.datasBloqueadas?.includes(dataIso)) {
    return false;
  }

  if (!disponibilidade.diasSemana?.length) {
    return disponibilidade.datasIndisponiveis ||
      disponibilidade.datasBloqueadas
      ? true
      : null;
  }

  const dia = diaSemanaDeDataIso(prazoIso);
  if (!dia) return null;
  return disponibilidade.diasSemana.includes(dia);
}

export function rotuloDiasSemana(dias: DiaSemana[]): string {
  if (dias.length === 0) return "Não informado";
  const ordem = DIAS_SEMANA.map((d) => d.id);
  const ordenados = [...dias].sort(
    (a, b) => ordem.indexOf(a) - ordem.indexOf(b),
  );
  return ordenados
    .map((id) => DIAS_SEMANA.find((d) => d.id === id)?.labelCurto ?? id)
    .join(", ");
}
