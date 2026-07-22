"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  DIAS_SUGESTAO_SELECAO,
  adicionarMeses,
  dataEstaDisponivel,
  diaDoMesDeIso,
  estadoDiaAgenda,
  formatarDataAgendaCurta,
  formatarDataAgendaLonga,
  hojeIsoLocal,
  listarCelulasMes,
  listarProximasDatasDisponiveis,
  mesAnoDeReferencia,
  rotuloMesAno,
  weekdayCurtoDeIso,
  type EstadoDiaAgenda,
} from "@/lib/influenciador/agenda-utils";
import type { DisponibilidadeInfluenciador } from "@/lib/types/influenciador";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;

type AgendaDisponibilidadeProps = {
  disponibilidade?: DisponibilidadeInfluenciador;
  /**
   * `calendario` — mês navegável (portfólio / gestão).
   * `selecao` — próximas datas livres + mês sob demanda (checkout/chat).
   */
  modo?: "calendario" | "selecao";
  /** Se true, dias disponíveis são clicáveis. */
  selecionavel?: boolean;
  dataSelecionada?: string | null;
  onSelecionar?: (dataIso: string) => void;
  /** Quantidade de chips na seleção compacta. */
  diasSugestao?: number;
  /** Esconde título/subtítulo (útil dentro de dialogs com Label próprio). */
  ocultarCabecalho?: boolean;
  id?: string;
  className?: string;
};

function classesEstado(
  estado: EstadoDiaAgenda,
  opts: { selecionado: boolean; hoje: boolean; interativo: boolean },
): string {
  if (opts.selecionado) {
    return "border-verde-acao bg-verde-acao text-white";
  }
  switch (estado) {
    case "disponivel":
      return cn(
        "border-verde-acao/35 bg-verde-acao/10",
        opts.interativo && "hover:bg-verde-acao/20 cursor-pointer",
      );
    case "ocupado":
      return "border-cinza-200 bg-cinza-100 text-texto-secundario opacity-70";
    case "bloqueado":
      return "border-ambar/40 bg-ambar-claro text-texto-secundario";
    case "fora_regra":
      return "border-cinza-200/80 bg-transparent text-texto-secundario opacity-50";
  }
}

function LegendaAgenda({
  mostrarSelecionado,
}: {
  mostrarSelecionado: boolean;
}) {
  return (
    <ul className="text-texto-secundario flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
      <li className="inline-flex items-center gap-1.5">
        <span
          className="size-2.5 rounded-sm border border-verde-acao/40 bg-verde-acao/15"
          aria-hidden
        />
        Livre
      </li>
      <li className="inline-flex items-center gap-1.5">
        <span
          className="size-2.5 rounded-sm border border-cinza-200 bg-cinza-100"
          aria-hidden
        />
        Ocupado
      </li>
      <li className="inline-flex items-center gap-1.5">
        <span
          className="size-2.5 rounded-sm border border-ambar/40 bg-ambar-claro"
          aria-hidden
        />
        Bloqueado
      </li>
      <li className="inline-flex items-center gap-1.5">
        <span
          className="size-2.5 rounded-sm border border-cinza-200/80 bg-transparent"
          aria-hidden
        />
        Fora da rotina
      </li>
      {mostrarSelecionado ? (
        <li className="inline-flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-sm border border-verde-acao bg-verde-acao"
            aria-hidden
          />
          Selecionado
        </li>
      ) : null}
    </ul>
  );
}

function CelulaDia({
  dataIso,
  disponibilidade,
  selecionavel,
  dataSelecionada,
  onSelecionar,
  compacto = false,
}: {
  dataIso: string;
  disponibilidade?: DisponibilidadeInfluenciador;
  selecionavel: boolean;
  dataSelecionada: string | null;
  onSelecionar?: (dataIso: string) => void;
  compacto?: boolean;
}) {
  const estado = estadoDiaAgenda(disponibilidade, dataIso);
  const disponivel = estado === "disponivel";
  const selecionado = dataSelecionada === dataIso;
  const hoje = dataIso === hojeIsoLocal();
  const rotulo = formatarDataAgendaCurta(dataIso);
  const weekday = weekdayCurtoDeIso(dataIso);
  const diaNum = diaDoMesDeIso(dataIso);
  const interativo = selecionavel && disponivel;

  const conteudo = (
    <>
      {!compacto ? (
        <span
          className={cn(
            "text-[10px] uppercase",
            selecionado ? "text-white/80" : "text-texto-secundario",
          )}
        >
          {weekday}
        </span>
      ) : null}
      <span
        className={cn(
          "font-data text-sm font-semibold",
          !disponivel && estado === "ocupado" && "line-through",
        )}
      >
        {diaNum}
      </span>
      {hoje ? (
        <span
          className={cn(
            "mt-0.5 size-1 rounded-full",
            selecionado ? "bg-white" : "bg-verde-acao",
          )}
          aria-hidden
        />
      ) : (
        <span className="mt-0.5 size-1" aria-hidden />
      )}
    </>
  );

  const className = cn(
    "flex h-full min-h-12 w-full flex-col items-center justify-center rounded-card border px-1 py-1.5 text-center transition-colors",
    classesEstado(estado, {
      selecionado,
      hoje,
      interativo,
    }),
    hoje && !selecionado && "ring-1 ring-verde-acao/40",
  );

  if (interativo) {
    return (
      <button
        type="button"
        onClick={() => onSelecionar?.(dataIso)}
        aria-pressed={selecionado}
        aria-label={`${rotulo}: disponível${selecionado ? ", selecionado" : ""}`}
        className={className}
      >
        {conteudo}
      </button>
    );
  }

  return (
    <div
      className={className}
      aria-label={`${rotulo}: ${estado === "disponivel" ? "disponível" : estado === "ocupado" ? "ocupado" : estado === "bloqueado" ? "bloqueado" : "fora da rotina"}`}
      title={
        estado === "ocupado"
          ? "Ocupado por contrato"
          : estado === "bloqueado"
            ? "Bloqueado pelo creator"
            : estado === "fora_regra"
              ? "Fora dos dias de rotina"
              : undefined
      }
    >
      {conteudo}
    </div>
  );
}

function CalendarioMensal({
  disponibilidade,
  selecionavel,
  dataSelecionada,
  onSelecionar,
}: {
  disponibilidade?: DisponibilidadeInfluenciador;
  selecionavel: boolean;
  dataSelecionada: string | null;
  onSelecionar?: (dataIso: string) => void;
}) {
  const inicial = mesAnoDeReferencia();
  const [ref, setRef] = useState(inicial);
  const celulas = useMemo(
    () => listarCelulasMes(ref.ano, ref.mes),
    [ref.ano, ref.mes],
  );
  const hoje = hojeIsoLocal();
  const podeVoltar =
    ref.ano > inicial.ano || (ref.ano === inicial.ano && ref.mes > inicial.mes);

  return (
    <div className="space-y-3">
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
          const passado = cel.dataIso < hoje;
          if (passado) {
            return (
              <div
                key={cel.dataIso}
                className="flex min-h-12 flex-col items-center justify-center rounded-card border border-transparent px-1 py-1.5 text-center opacity-35"
                aria-hidden
              >
                <span className="font-data text-sm">
                  {diaDoMesDeIso(cel.dataIso)}
                </span>
              </div>
            );
          }
          return (
            <CelulaDia
              key={cel.dataIso}
              dataIso={cel.dataIso}
              disponibilidade={disponibilidade}
              selecionavel={selecionavel}
              dataSelecionada={dataSelecionada}
              onSelecionar={onSelecionar}
            />
          );
        })}
      </div>
    </div>
  );
}

export function AgendaDisponibilidade({
  disponibilidade,
  modo = "calendario",
  selecionavel = false,
  dataSelecionada = null,
  onSelecionar,
  diasSugestao = DIAS_SUGESTAO_SELECAO,
  ocultarCabecalho = false,
  id,
  className,
}: AgendaDisponibilidadeProps) {
  const [mostrarMes, setMostrarMes] = useState(modo === "calendario");
  const sugestoes = useMemo(
    () =>
      listarProximasDatasDisponiveis(disponibilidade, diasSugestao),
    [disponibilidade, diasSugestao],
  );

  return (
    <section
      id={id}
      className={cn("scroll-mt-24 space-y-3", className)}
      aria-label="Agenda de disponibilidade"
    >
      {!ocultarCabecalho ? (
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-bold">Agenda</h2>
            <p className="text-texto-secundario text-sm font-normal">
              Disponibilidade por dia (sem horário)
            </p>
          </div>
          <LegendaAgenda mostrarSelecionado={selecionavel} />
        </div>
      ) : (
        <LegendaAgenda mostrarSelecionado={selecionavel} />
      )}

      {disponibilidade?.observacao ? (
        <p className="text-texto-secundario text-sm font-normal">
          {disponibilidade.observacao}
        </p>
      ) : null}

      {modo === "selecao" ? (
        <div className="space-y-3">
          {sugestoes.length === 0 ? (
            <p className="text-texto-secundario text-sm">
              Não há datas livres nos próximos 45 dias.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {sugestoes.map((dataIso) => {
                const selecionado = dataSelecionada === dataIso;
                return (
                  <li key={dataIso}>
                    <button
                      type="button"
                      onClick={() => onSelecionar?.(dataIso)}
                      aria-pressed={selecionado}
                      className={cn(
                        "rounded-button border px-3 py-2 text-left text-sm transition-colors",
                        selecionado
                          ? "border-verde-acao bg-verde-acao text-white"
                          : "border-verde-acao/35 bg-verde-acao/10 hover:bg-verde-acao/20",
                      )}
                    >
                      <span className="font-medium">
                        {formatarDataAgendaCurta(dataIso)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {dataSelecionada &&
          !sugestoes.includes(dataSelecionada) &&
          dataEstaDisponivel(disponibilidade, dataSelecionada) ? (
            <p className="text-texto-secundario text-xs font-normal">
              Selecionado: {formatarDataAgendaLonga(dataSelecionada)}
            </p>
          ) : null}

          <button
            type="button"
            className="text-verde-acao text-xs font-medium hover:underline"
            onClick={() => setMostrarMes((v) => !v)}
          >
            {mostrarMes ? "Ocultar calendário completo" : "Ver calendário completo"}
          </button>

          {mostrarMes ? (
            <CalendarioMensal
              disponibilidade={disponibilidade}
              selecionavel={selecionavel}
              dataSelecionada={dataSelecionada}
              onSelecionar={onSelecionar}
            />
          ) : null}
        </div>
      ) : (
        <CalendarioMensal
          disponibilidade={disponibilidade}
          selecionavel={selecionavel}
          dataSelecionada={dataSelecionada}
          onSelecionar={onSelecionar}
        />
      )}
    </section>
  );
}
