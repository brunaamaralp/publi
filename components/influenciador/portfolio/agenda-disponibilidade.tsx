"use client";

import {
  DIAS_AGENDA_PADRAO,
  dataEstaDisponivel,
  formatarDataAgendaCurta,
  listarProximosDiasIso,
} from "@/lib/influenciador/agenda-utils";
import type { DisponibilidadeInfluenciador } from "@/lib/types/influenciador";
import { cn } from "@/lib/utils";

type AgendaDisponibilidadeProps = {
  disponibilidade?: DisponibilidadeInfluenciador;
  diasVisiveis?: number;
  /** Se true, dias disponíveis são clicáveis. */
  selecionavel?: boolean;
  dataSelecionada?: string | null;
  onSelecionar?: (dataIso: string) => void;
  className?: string;
};

export function AgendaDisponibilidade({
  disponibilidade,
  diasVisiveis = DIAS_AGENDA_PADRAO,
  selecionavel = false,
  dataSelecionada = null,
  onSelecionar,
  className,
}: AgendaDisponibilidadeProps) {
  const dias = listarProximosDiasIso(diasVisiveis);

  return (
    <section className={cn("space-y-3", className)} aria-label="Agenda de disponibilidade">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold">Agenda</h2>
          <p className="text-texto-secundario text-sm font-normal">
            Próximos {diasVisiveis} dias · granularidade de dia inteiro
          </p>
        </div>
        <ul className="text-texto-secundario flex flex-wrap gap-3 text-xs">
          <li className="inline-flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-sm border border-verde-acao/40 bg-verde-acao/15"
              aria-hidden
            />
            Disponível
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-sm border border-cinza-200 bg-cinza-100"
              aria-hidden
            />
            Indisponível
          </li>
        </ul>
      </div>

      {disponibilidade?.observacao ? (
        <p className="text-texto-secundario text-sm font-normal">
          {disponibilidade.observacao}
        </p>
      ) : null}

      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7">
        {dias.map((dataIso) => {
          const disponivel = dataEstaDisponivel(disponibilidade, dataIso);
          const selecionado = dataSelecionada === dataIso;
          const rotulo = formatarDataAgendaCurta(dataIso);
          const diaNum = dataIso.slice(8, 10);

          if (!disponivel) {
            return (
              <li key={dataIso}>
                <div
                  className="flex h-full min-h-14 flex-col items-center justify-center rounded-card border border-cinza-200 bg-cinza-100 px-1 py-2 text-center opacity-60"
                  aria-label={`${rotulo}: indisponível`}
                  title="Indisponível"
                >
                  <span className="text-texto-secundario text-[10px] uppercase">
                    {rotulo.split(",")[0] ?? ""}
                  </span>
                  <span className="font-data text-sm font-semibold line-through">
                    {diaNum}
                  </span>
                </div>
              </li>
            );
          }

          if (selecionavel) {
            return (
              <li key={dataIso}>
                <button
                  type="button"
                  onClick={() => onSelecionar?.(dataIso)}
                  aria-pressed={selecionado}
                  aria-label={`${rotulo}: disponível`}
                  className={cn(
                    "flex h-full min-h-14 w-full flex-col items-center justify-center rounded-card border px-1 py-2 text-center transition-colors",
                    selecionado
                      ? "border-verde-acao bg-verde-acao text-white"
                      : "border-verde-acao/35 bg-verde-acao/10 hover:bg-verde-acao/20",
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] uppercase",
                      selecionado ? "text-white/80" : "text-texto-secundario",
                    )}
                  >
                    {rotulo.split(",")[0] ?? ""}
                  </span>
                  <span className="font-data text-sm font-semibold">{diaNum}</span>
                </button>
              </li>
            );
          }

          return (
            <li key={dataIso}>
              <div
                className="flex h-full min-h-14 flex-col items-center justify-center rounded-card border border-verde-acao/35 bg-verde-acao/10 px-1 py-2 text-center"
                aria-label={`${rotulo}: disponível`}
              >
                <span className="text-texto-secundario text-[10px] uppercase">
                  {rotulo.split(",")[0] ?? ""}
                </span>
                <span className="font-data text-sm font-semibold">{diaNum}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
