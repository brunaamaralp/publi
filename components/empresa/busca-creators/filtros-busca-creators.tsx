"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DIAS_SEMANA } from "@/lib/influenciador/atuacao-utils";
import {
  estadosDisponiveisNoCatalogo,
  LABELS_FAIXA_ENGAJAMENTO,
  LABELS_FAIXA_PRECO,
  LABELS_FAIXA_SEGUIDORES,
  type FaixaEngajamento,
  type FaixaPrecoPacote,
  type FaixaSeguidores,
  type FiltroTipoAtuacaoBusca,
  type FiltrosBuscaCreators,
} from "@/lib/empresa/busca-creators";
import { CATEGORIAS_CATALOGO } from "@/lib/mock-data/categorias";
import type { DiaSemana } from "@/lib/types/influenciador";
import { cn } from "@/lib/utils";

type FiltrosBuscaCreatorsProps = {
  filtros: FiltrosBuscaCreators;
  onChange: (filtros: FiltrosBuscaCreators) => void;
  className?: string;
};

export function FiltrosBuscaCreatorsPainel({
  filtros,
  onChange,
  className,
}: FiltrosBuscaCreatorsProps) {
  const estados = estadosDisponiveisNoCatalogo();
  const modoModelo = filtros.tipoAtuacao === "modelo";

  function toggleDia(dia: DiaSemana) {
    const tem = filtros.diasDisponiveis.includes(dia);
    onChange({
      ...filtros,
      diasDisponiveis: tem
        ? filtros.diasDisponiveis.filter((d) => d !== dia)
        : [...filtros.diasDisponiveis, dia],
    });
  }

  return (
    <div className={cn("secao-editavel space-y-4 ring-0", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            className="text-texto-secundario size-4"
            aria-hidden
          />
          <h2 className="font-display text-sm font-bold">Busca e filtros</h2>
        </div>

        <Tabs
          value={filtros.tipoAtuacao}
          onValueChange={(valor) => {
            if (!valor) return;
            const tipoAtuacao = valor as FiltroTipoAtuacaoBusca;
            onChange({
              ...filtros,
              tipoAtuacao,
              ...(tipoAtuacao === "modelo"
                ? {
                    seguidores: "todos",
                    engajamento: "todos",
                    preco: "todos",
                  }
                : { diasDisponiveis: [] }),
            });
          }}
        >
          <TabsList aria-label="Tipo de atuação">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="influenciador">Influenciador</TabsTrigger>
            <TabsTrigger value="modelo">Modelo</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-2">
        <Label htmlFor="busca-creators-texto">Buscar</Label>
        <div className="relative">
          <Search
            className="text-texto-secundario pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            id="busca-creators-texto"
            value={filtros.texto}
            onChange={(e) => onChange({ ...filtros, texto: e.target.value })}
            placeholder="Nome, @ ou palavra-chave da bio"
            className="border-cinza-200 bg-white pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="filtro-nicho">Nicho / categoria</Label>
          <Select
            value={filtros.nichoId}
            onValueChange={(valor) => {
              if (valor) onChange({ ...filtros, nichoId: valor });
            }}
          >
            <SelectTrigger id="filtro-nicho" className="w-full">
              <SelectValue placeholder="Todos os nichos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os nichos</SelectItem>
              {CATEGORIAS_CATALOGO.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {modoModelo ? (
          <div className="space-y-2 sm:col-span-2">
            <Label>Disponibilidade (dias da semana)</Label>
            <div className="flex flex-wrap gap-2">
              {DIAS_SEMANA.map((dia) => {
                const ativo = filtros.diasDisponiveis.includes(dia.id);
                return (
                  <button
                    key={dia.id}
                    type="button"
                    onClick={() => toggleDia(dia.id)}
                    className={cn(
                      "rounded-button border px-3 py-1.5 text-xs font-medium transition-colors",
                      ativo
                        ? "border-verde-neon bg-verde-carvao-escuro text-verde-neon"
                        : "border-cinza-200 bg-white text-foreground hover:border-verde-neon/40",
                    )}
                    aria-pressed={ativo}
                  >
                    {dia.labelCurto}
                  </button>
                );
              })}
            </div>
            <p className="text-texto-secundario text-xs font-normal">
              Filtra quem topa ensaios nos dias selecionados (qualquer um dos
              dias).
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="filtro-seguidores">Seguidores</Label>
              <Select
                value={filtros.seguidores}
                onValueChange={(valor) => {
                  if (valor) {
                    onChange({
                      ...filtros,
                      seguidores: valor as FaixaSeguidores,
                    });
                  }
                }}
              >
                <SelectTrigger id="filtro-seguidores" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.keys(LABELS_FAIXA_SEGUIDORES) as FaixaSeguidores[]
                  ).map((key) => (
                    <SelectItem key={key} value={key}>
                      {LABELS_FAIXA_SEGUIDORES[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtro-engajamento">Engajamento</Label>
              <Select
                value={filtros.engajamento}
                onValueChange={(valor) => {
                  if (valor) {
                    onChange({
                      ...filtros,
                      engajamento: valor as FaixaEngajamento,
                    });
                  }
                }}
              >
                <SelectTrigger id="filtro-engajamento" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.keys(LABELS_FAIXA_ENGAJAMENTO) as FaixaEngajamento[]
                  ).map((key) => (
                    <SelectItem key={key} value={key}>
                      {LABELS_FAIXA_ENGAJAMENTO[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtro-preco">Preço de pacote</Label>
              <Select
                value={filtros.preco}
                onValueChange={(valor) => {
                  if (valor) {
                    onChange({
                      ...filtros,
                      preco: valor as FaixaPrecoPacote,
                    });
                  }
                }}
              >
                <SelectTrigger id="filtro-preco" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(LABELS_FAIXA_PRECO) as FaixaPrecoPacote[]).map(
                    (key) => (
                      <SelectItem key={key} value={key}>
                        {LABELS_FAIXA_PRECO[key]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="filtro-estado">Estado</Label>
          <Select
            value={filtros.estado}
            onValueChange={(valor) => {
              if (valor) onChange({ ...filtros, estado: valor });
            }}
          >
            <SelectTrigger id="filtro-estado" className="w-full">
              <SelectValue placeholder="Todo o Brasil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todo o Brasil</SelectItem>
              {estados.map((uf) => (
                <SelectItem key={uf} value={uf}>
                  {uf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
