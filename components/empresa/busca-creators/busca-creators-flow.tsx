"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SearchX, Users } from "lucide-react";

import { CreatorCard } from "@/components/empresa/busca-creators/creator-card";
import { ConvidarDemandaDialog } from "@/components/empresa/busca-creators/convidar-demanda-dialog";
import { FiltrosBuscaCreatorsPainel } from "@/components/empresa/busca-creators/filtros-busca-creators";
import { SeletorEmpresaCliente } from "@/components/agencia/seletor-empresa-cliente";
import { Button, buttonVariants } from "@/components/ui/button";
import type { CreatorCatalogo } from "@/lib/empresa/creator-catalogo-types";
import {
  FILTROS_BUSCA_CREATORS_INICIAIS,
  filtrarCreators,
  filtrosBuscaAtivos,
  PAGE_SIZE_BUSCA_CREATORS,
  type FiltrosBuscaCreators,
} from "@/lib/empresa/busca-creators";
import { useEmpresaPublicadora } from "@/lib/empresa/use-empresa-publicadora";
import { cn } from "@/lib/utils";

export function BuscaCreatorsFlow() {
  const publicador = useEmpresaPublicadora();
  const [filtros, setFiltros] = useState<FiltrosBuscaCreators>(
    FILTROS_BUSCA_CREATORS_INICIAIS,
  );
  const [visiveis, setVisiveis] = useState(PAGE_SIZE_BUSCA_CREATORS);
  const [convidar, setConvidar] = useState<CreatorCatalogo | null>(null);

  const resultados = useMemo(() => filtrarCreators(filtros), [filtros]);

  useEffect(() => {
    setVisiveis(PAGE_SIZE_BUSCA_CREATORS);
  }, [filtros]);

  const pagina = resultados.slice(0, visiveis);
  const temMais = visiveis < resultados.length;
  const filtrosAtivos = filtrosBuscaAtivos(filtros);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
      <header className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-texto-secundario text-sm font-medium">Creators</p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">
              Buscar creators
            </h1>
            <p className="text-texto-secundario mt-2 max-w-2xl text-sm font-normal">
              Busca ativa fora do fluxo de uma demanda — encontre influenciadores
              verificados e convide para suas campanhas.
            </p>
          </div>
          <Link
            href="/empresa/demandas"
            className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
          >
            Minhas campanhas
          </Link>
        </div>

        {publicador.modo === "agencia" ||
        publicador.modo === "agencia_sem_cliente" ? (
          <div className="flex flex-col gap-3 rounded-card border border-lilas-claro bg-lilas-claro p-4 text-lilas-escuro sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-normal">
              Agência{" "}
              <span className="font-semibold">{publicador.agenciaNome}</span>
              {publicador.modo === "agencia_sem_cliente" ? (
                <span className="mt-1 block text-xs font-medium text-destructive">
                  Selecione um cliente para convidar creators às demandas.
                </span>
              ) : null}
            </p>
            <SeletorEmpresaCliente className="text-lilas-escuro [&_span]:text-lilas-escuro/70" />
          </div>
        ) : null}
      </header>

      <FiltrosBuscaCreatorsPainel filtros={filtros} onChange={setFiltros} />

      <div className="flex items-center justify-between gap-2">
        <p className="text-texto-secundario inline-flex items-center gap-1.5 text-sm font-normal">
          <Users className="size-4" aria-hidden />
          <span className="font-data font-semibold text-foreground">
            {resultados.length}
          </span>{" "}
          {resultados.length === 1 ? "creator" : "creators"}
          {filtrosAtivos ? " com os filtros atuais" : " ativos"}
        </p>
        {filtrosAtivos ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setFiltros(FILTROS_BUSCA_CREATORS_INICIAIS)}
          >
            Limpar filtros
          </Button>
        ) : null}
      </div>

      {resultados.length === 0 ? (
        <div className="rounded-card border border-dashed border-cinza-200 bg-white px-6 py-14 text-center">
          <SearchX
            className="text-texto-secundario mx-auto size-10 opacity-60"
            aria-hidden
          />
          <h2 className="font-display mt-4 text-lg font-bold">
            Nenhum creator encontrado
          </h2>
          <p className="text-texto-secundario mx-auto mt-2 max-w-md text-sm font-normal">
            Tente afrouxar os filtros — remova nicho, faixa de seguidores ou
            preço, ou busque por outro termo na bio.
          </p>
          <Button
            type="button"
            variant="cta"
            className="mt-6"
            onClick={() => setFiltros(FILTROS_BUSCA_CREATORS_INICIAIS)}
          >
            Limpar filtros
          </Button>
        </div>
      ) : (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pagina.map((creator) => (
              <li key={creator.id}>
                <CreatorCard
                  creator={creator}
                  onConvidar={setConvidar}
                />
              </li>
            ))}
          </ul>

          {temMais ? (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setVisiveis((n) => n + PAGE_SIZE_BUSCA_CREATORS)
                }
              >
                Carregar mais
              </Button>
            </div>
          ) : null}
        </>
      )}

      <ConvidarDemandaDialog
        creator={convidar}
        open={convidar !== null}
        onOpenChange={(open) => {
          if (!open) setConvidar(null);
        }}
      />
    </div>
  );
}
