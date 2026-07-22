"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  adicionarMeses,
  alternarBloqueioData,
  diaDoMesDeIso,
  estadoDiaAgenda,
  formatarDataAgendaCurta,
  hojeIsoLocal,
  listarCelulasMes,
  mesAnoDeReferencia,
  rotuloMesAno,
  weekdayCurtoDeIso,
} from "@/lib/influenciador/agenda-utils";
import { DIAS_SEMANA } from "@/lib/influenciador/atuacao-utils";
import type {
  DiaSemana,
  DisponibilidadeInfluenciador,
} from "@/lib/types/influenciador";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;

type AgendaEditorProps = {
  disponibilidade?: DisponibilidadeInfluenciador;
  onChange: (next: DisponibilidadeInfluenciador) => void;
  /** Exige ao menos um dia da semana (fluxo modelo). */
  exigirDiasSemana?: boolean;
  className?: string;
};

export function AgendaEditor({
  disponibilidade,
  onChange,
  exigirDiasSemana = false,
  className,
}: AgendaEditorProps) {
  const dias = disponibilidade?.diasSemana ?? [];
  const inicial = mesAnoDeReferencia();
  const [ref, setRef] = useState(inicial);
  const celulas = useMemo(
    () => listarCelulasMes(ref.ano, ref.mes),
    [ref.ano, ref.mes],
  );
  const hoje = hojeIsoLocal();
  const podeVoltar =
    ref.ano > inicial.ano || (ref.ano === inicial.ano && ref.mes > inicial.mes);

  function patch(partial: Partial<DisponibilidadeInfluenciador>) {
    onChange({
      diasSemana: disponibilidade?.diasSemana ?? [],
      observacao: disponibilidade?.observacao,
      datasIndisponiveis: disponibilidade?.datasIndisponiveis,
      datasBloqueadas: disponibilidade?.datasBloqueadas,
      ...partial,
    });
  }

  function toggleDia(dia: DiaSemana) {
    const atuais = disponibilidade?.diasSemana ?? [];
    const next = atuais.includes(dia)
      ? atuais.filter((d) => d !== dia)
      : [...atuais, dia];
    patch({ diasSemana: next });
  }

  function onCelulaClick(dataIso: string) {
    const estado = estadoDiaAgenda(disponibilidade, dataIso);
    if (estado === "ocupado") return;
    if (dataIso < hoje) return;
    onChange(alternarBloqueioData(disponibilidade, dataIso));
  }

  return (
    <section
      id="agenda"
      className={cn("scroll-mt-24 space-y-5", className)}
      aria-label="Editar agenda"
    >
      <div>
        <h2 className="font-display text-sm font-bold">Minha agenda</h2>
        <p className="text-texto-secundario text-xs font-normal">
          Defina os dias de rotina e bloqueie datas pontuais. Datas ocupadas por
          contrato não podem ser liberadas aqui.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Dias de rotina</Label>
        <div className="flex flex-wrap gap-2">
          {DIAS_SEMANA.map((dia) => {
            const ativo = dias.includes(dia.id);
            return (
              <button
                key={dia.id}
                type="button"
                onClick={() => toggleDia(dia.id)}
                className={cn(
                  "rounded-button border px-3 py-1.5 text-xs font-medium transition-colors",
                  ativo
                    ? "border-verde-neon bg-verde-carvao-escuro text-verde-neon"
                    : "border-cinza-200 bg-white hover:border-verde-neon/40",
                )}
                aria-pressed={ativo}
              >
                {dia.labelCurto}
              </button>
            );
          })}
        </div>
        {exigirDiasSemana && dias.length === 0 ? (
          <p className="text-destructive text-xs">
            Informe ao menos um dia de disponibilidade.
          </p>
        ) : null}
        <p className="text-texto-secundario text-xs font-normal">
          Dias fora da rotina aparecem como indisponíveis para a empresa.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="agenda-observacao">
          Observação{" "}
          <span className="text-texto-secundario font-normal">(opcional)</span>
        </Label>
        <Input
          id="agenda-observacao"
          value={disponibilidade?.observacao ?? ""}
          onChange={(e) => patch({ observacao: e.target.value })}
          onBlur={(e) =>
            patch({ observacao: e.target.value.trim() || undefined })
          }
          placeholder="Ex.: ensaios só pela manhã; sem deslocamento aos sábados"
          className="border-cinza-200 bg-white font-normal"
          maxLength={160}
        />
      </div>

      <div className="space-y-3">
        <div>
          <Label>Bloquear ou liberar datas</Label>
          <p className="text-texto-secundario text-xs font-normal">
            Clique em um dia livre para bloquear; clique de novo para liberar.
            Âmbar = bloqueado por você · cinza = ocupado por contrato.
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-button border border-cinza-200 bg-white disabled:opacity-40"
            disabled={!podeVoltar}
            onClick={() => setRef((r) => adicionarMeses(r.ano, r.mes, -1))}
            aria-label="Mês anterior"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <p className="font-display text-sm font-bold">
            {rotuloMesAno(ref.ano, ref.mes)}
          </p>
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-button border border-cinza-200 bg-white"
            onClick={() => setRef((r) => adicionarMeses(r.ano, r.mes, 1))}
            aria-label="Próximo mês"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="text-texto-secundario py-1 text-center text-[10px] font-medium uppercase"
            >
              {d}
            </div>
          ))}
          {celulas.map((cel, idx) => {
            if (!cel.dataIso) {
              return <div key={`empty-${idx}`} className="min-h-12" />;
            }
            const dataIso = cel.dataIso;
            const passado = dataIso < hoje;
            const estado = estadoDiaAgenda(disponibilidade, dataIso);
            const rotulo = formatarDataAgendaCurta(dataIso);

            if (passado) {
              return (
                <div
                  key={dataIso}
                  className="flex min-h-12 flex-col items-center justify-center rounded-card opacity-35"
                  aria-hidden
                >
                  <span className="font-data text-sm">
                    {diaDoMesDeIso(dataIso)}
                  </span>
                </div>
              );
            }

            const ocupado = estado === "ocupado";
            const bloqueado = estado === "bloqueado";
            const fora = estado === "fora_regra";
            const livre = estado === "disponivel";

            return (
              <button
                key={dataIso}
                type="button"
                disabled={ocupado}
                onClick={() => onCelulaClick(dataIso)}
                aria-label={
                  ocupado
                    ? `${rotulo}: ocupado por contrato`
                    : bloqueado
                      ? `${rotulo}: bloqueado — clique para liberar`
                      : `${rotulo}: livre — clique para bloquear`
                }
                title={
                  ocupado
                    ? "Ocupado por contrato"
                    : bloqueado
                      ? "Bloqueado — clique para liberar"
                      : "Clique para bloquear"
                }
                className={cn(
                  "flex min-h-12 w-full flex-col items-center justify-center rounded-card border px-1 py-1.5 text-center transition-colors",
                  ocupado &&
                    "cursor-not-allowed border-cinza-200 bg-cinza-100 opacity-70",
                  bloqueado && "border-ambar/40 bg-ambar-claro",
                  livre &&
                    "border-verde-acao/35 bg-verde-acao/10 hover:bg-verde-acao/20",
                  fora &&
                    !bloqueado &&
                    "border-cinza-200/80 bg-transparent opacity-60 hover:bg-cinza-100",
                  dataIso === hoje && "ring-1 ring-verde-acao/40",
                )}
              >
                <span className="text-texto-secundario text-[10px] uppercase">
                  {weekdayCurtoDeIso(dataIso)}
                </span>
                <span
                  className={cn(
                    "font-data text-sm font-semibold",
                    ocupado && "line-through",
                  )}
                >
                  {diaDoMesDeIso(dataIso)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
