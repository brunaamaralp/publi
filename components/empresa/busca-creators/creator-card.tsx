"use client";

import { CalendarDays, MapPin, Star, Users, Zap } from "lucide-react";
import Link from "next/link";

import { BadgeSemantico } from "@/components/ui/badge-semantico";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { CreatorCatalogo } from "@/lib/empresa/creator-catalogo-types";
import { creatorExibeNota } from "@/lib/empresa/creator-catalogo-types";
import {
  formatarFaixaSeguidores,
  rotuloAvaliacaoCreator,
  type FiltroTipoAtuacaoBusca,
} from "@/lib/empresa/busca-creators";
import { nomeNicho } from "@/lib/empresa/orcamento-nicho";
import {
  ehSomenteModelo,
  rotuloDiasSemana,
  tambemAtuaComoModelo,
} from "@/lib/influenciador/atuacao-utils";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { cn } from "@/lib/utils";

type CreatorCardProps = {
  creator: CreatorCatalogo;
  onConvidar?: (creator: CreatorCatalogo) => void;
  tipoAtuacaoFiltro?: FiltroTipoAtuacaoBusca;
  className?: string;
};

function iniciais(nome: string): string {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function CreatorCard({
  creator,
  onConvidar,
  tipoAtuacaoFiltro = "todos",
  className,
}: CreatorCardProps) {
  const exibeNota = creatorExibeNota(creator);
  const soModelo = ehSomenteModelo(creator.tiposAtuacao);
  const hibrido = tambemAtuaComoModelo(creator.tiposAtuacao);
  const verComoModelo = tipoAtuacaoFiltro === "modelo" || soModelo;
  const dias = creator.disponibilidade?.diasSemana ?? [];

  return (
    <article
      className={cn(
        "card-marketing flex h-full flex-col gap-4 p-4 transition-colors",
        "hover:border-verde-neon/40",
        className,
      )}
    >
      <Link
        href={`/influenciador/${creator.id}`}
        className="flex min-w-0 flex-1 items-start gap-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-verde-neon/30"
      >
        <Avatar
          size="lg"
          className="size-14 shrink-0 [&_[data-slot=avatar-fallback]]:text-sm"
        >
          <AvatarFallback className="bg-verde-carvao-escuro font-display font-bold text-verde-neon">
            {iniciais(creator.nome)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="font-display truncate font-bold">{creator.nome}</p>
          <p className="text-texto-secundario truncate text-xs font-normal">
            {creator.handle}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <BadgeSemantico variante="info">
              {nomeNicho(creator.nichoId)}
            </BadgeSemantico>
            {soModelo ? (
              <BadgeSemantico variante="neutro">Modelo</BadgeSemantico>
            ) : null}
            {hibrido && tipoAtuacaoFiltro !== "modelo" ? (
              <BadgeSemantico variante="sucesso">
                Também atua como modelo
              </BadgeSemantico>
            ) : null}
            {exibeNota ? (
              <span className="text-texto-secundario inline-flex items-center gap-1 text-xs font-medium">
                <Star className="size-3 text-ambar-escuro" aria-hidden />
                {rotuloAvaliacaoCreator(creator)}
              </span>
            ) : (
              <BadgeSemantico variante="sucesso">Novo no Publi</BadgeSemantico>
            )}
          </div>
        </div>
      </Link>

      <dl className="grid grid-cols-2 gap-2 text-sm">
        {verComoModelo ? (
          <>
            <div className="col-span-2">
              <dt className="text-texto-secundario flex items-center gap-1 text-xs">
                <CalendarDays className="size-3" aria-hidden />
                Disponibilidade
              </dt>
              <dd className="mt-0.5 text-sm font-medium">
                {rotuloDiasSemana(dias)}
              </dd>
            </div>
            {!soModelo ? (
              <div>
                <dt className="text-texto-secundario text-xs">
                  Pacotes a partir de
                </dt>
                <dd className="font-data mt-0.5 font-semibold">
                  {formatarMoeda(creator.precoPacoteMin)}
                </dd>
              </div>
            ) : null}
            <div className={soModelo ? "col-span-2" : undefined}>
              <dt className="text-texto-secundario flex items-center gap-1 text-xs">
                <MapPin className="size-3" aria-hidden />
                Local
              </dt>
              <dd className="mt-0.5 truncate text-sm font-medium">
                {creator.cidade}, {creator.estado}
              </dd>
            </div>
          </>
        ) : (
          <>
            <div>
              <dt className="text-texto-secundario flex items-center gap-1 text-xs">
                <Users className="size-3" aria-hidden />
                Seguidores
              </dt>
              <dd className="font-data mt-0.5 font-semibold">
                {formatarFaixaSeguidores(creator.seguidores)}
              </dd>
            </div>
            <div>
              <dt className="text-texto-secundario flex items-center gap-1 text-xs">
                <Zap className="size-3" aria-hidden />
                Engajamento
              </dt>
              <dd className="font-data mt-0.5 font-semibold">
                {creator.engajamentoMedio.toFixed(1)}%
              </dd>
            </div>
            <div>
              <dt className="text-texto-secundario text-xs">
                Pacotes a partir de
              </dt>
              <dd className="font-data mt-0.5 font-semibold">
                {formatarMoeda(creator.precoPacoteMin)}
              </dd>
            </div>
            <div>
              <dt className="text-texto-secundario flex items-center gap-1 text-xs">
                <MapPin className="size-3" aria-hidden />
                Local
              </dt>
              <dd className="mt-0.5 truncate text-sm font-medium">
                {creator.cidade}, {creator.estado}
              </dd>
            </div>
          </>
        )}
      </dl>

      <p className="text-texto-secundario line-clamp-2 text-xs leading-relaxed font-normal">
        {creator.bio}
      </p>

      <div className="mt-auto flex flex-col gap-2 sm:flex-row">
        {onConvidar ? (
          <Button
            type="button"
            variant="cta"
            className="flex-1"
            onClick={() => onConvidar(creator)}
          >
            Convidar para demanda
          </Button>
        ) : null}
        <Link
          href={`/influenciador/${creator.id}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            onConvidar ? "flex-1" : "w-full",
          )}
        >
          Ver perfil
        </Link>
      </div>
    </article>
  );
}
