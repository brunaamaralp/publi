"use client";

import { SlidersHorizontal } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LABELS_ORDENACAO,
  labelFormatoEntrega,
  type OrdenacaoDemanda,
} from "@/lib/demandas/utils";
import { TIPOS_SERVICO } from "@/lib/influenciador/cadastro-utils";
import {
  ORCAMENTO_MAX_MOCK,
  ORCAMENTO_MIN_MOCK,
} from "@/lib/mock-data/demandas";
import type { Demanda } from "@/lib/types";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { cn } from "@/lib/utils";

export type FiltrosDemanda = {
  formato: Demanda["formatoEntrega"] | "todos";
  orcamentoMinimo: number;
  ordenacao: OrdenacaoDemanda;
};

export const FILTROS_INICIAIS: FiltrosDemanda = {
  formato: "todos",
  orcamentoMinimo: ORCAMENTO_MIN_MOCK,
  ordenacao: "melhor_match",
};

type FiltrosDemandasProps = {
  filtros: FiltrosDemanda;
  onChange: (filtros: FiltrosDemanda) => void;
  className?: string;
};

export function FiltrosDemandas({
  filtros,
  onChange,
  className,
}: FiltrosDemandasProps) {
  return (
    <div
      className={cn(
        "secao-editavel space-y-4 ring-0",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <SlidersHorizontal
          className="text-texto-secundario size-4"
          aria-hidden
        />
        <h2 className="font-display text-sm font-bold">Filtros</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="filtro-formato">Formato</Label>
          <Select
            value={filtros.formato}
            onValueChange={(valor) => {
              if (valor) {
                onChange({
                  ...filtros,
                  formato: valor as FiltrosDemanda["formato"],
                });
              }
            }}
          >
            <SelectTrigger id="filtro-formato" className="w-full">
              <SelectValue placeholder="Todos os formatos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os formatos</SelectItem>
              {TIPOS_SERVICO.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {labelFormatoEntrega(tipo)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filtro-ordenacao">Ordenar por</Label>
          <Select
            value={filtros.ordenacao}
            onValueChange={(valor) => {
              if (valor) {
                onChange({
                  ...filtros,
                  ordenacao: valor as OrdenacaoDemanda,
                });
              }
            }}
          >
            <SelectTrigger id="filtro-ordenacao" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(LABELS_ORDENACAO) as OrdenacaoDemanda[]).map(
                (key) => (
                  <SelectItem key={key} value={key}>
                    {LABELS_ORDENACAO[key]}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-1">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="filtro-orcamento">Orçamento mínimo</Label>
            <span className="text-texto-secundario font-data text-xs">
              {formatarMoeda(filtros.orcamentoMinimo)}+
            </span>
          </div>
          <input
            id="filtro-orcamento"
            type="range"
            min={ORCAMENTO_MIN_MOCK}
            max={ORCAMENTO_MAX_MOCK}
            step={500}
            value={filtros.orcamentoMinimo}
            onChange={(e) =>
              onChange({
                ...filtros,
                orcamentoMinimo: Number(e.target.value),
              })
            }
            className="accent-verde-acao w-full"
            aria-valuemin={ORCAMENTO_MIN_MOCK}
            aria-valuemax={ORCAMENTO_MAX_MOCK}
            aria-valuenow={filtros.orcamentoMinimo}
          />
        </div>
      </div>
    </div>
  );
}
