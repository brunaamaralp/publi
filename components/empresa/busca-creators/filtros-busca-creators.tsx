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
import {
  estadosDisponiveisNoCatalogo,
  LABELS_FAIXA_ENGAJAMENTO,
  LABELS_FAIXA_PRECO,
  LABELS_FAIXA_SEGUIDORES,
  type FaixaEngajamento,
  type FaixaPrecoPacote,
  type FaixaSeguidores,
  type FiltrosBuscaCreators,
} from "@/lib/empresa/busca-creators";
import { CATEGORIAS_CATALOGO } from "@/lib/mock-data/categorias";
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

  return (
    <div className={cn("secao-editavel space-y-4 ring-0", className)}>
      <div className="flex items-center gap-2">
        <SlidersHorizontal
          className="text-texto-secundario size-4"
          aria-hidden
        />
        <h2 className="font-display text-sm font-bold">Busca e filtros</h2>
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
              {(Object.keys(LABELS_FAIXA_SEGUIDORES) as FaixaSeguidores[]).map(
                (key) => (
                  <SelectItem key={key} value={key}>
                    {LABELS_FAIXA_SEGUIDORES[key]}
                  </SelectItem>
                ),
              )}
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
                onChange({ ...filtros, preco: valor as FaixaPrecoPacote });
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
