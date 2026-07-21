"use client";

import { useState } from "react";
import Link from "next/link";
import { BadgeCheck, CalendarDays } from "lucide-react";

import {
  BadgeFormatoDemanda,
} from "@/components/influenciador/demandas/indicador-match";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { MatchRing } from "@/components/ui/match-ring";
import { formatarPrazo, labelFormatoEntrega } from "@/lib/demandas/utils";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import type { DemandaFeedItem } from "@/lib/mock-data/demandas";
import { cn } from "@/lib/utils";

const BRIEFING_LIMITE = 140;

type DemandaCardProps = {
  item: DemandaFeedItem;
  onInteresse: (matchId: string) => void;
  onRecusar: (matchId: string) => void;
  modoEnviado?: boolean;
};

function iniciaisEmpresa(nome: string) {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

export function DemandaCard({
  item,
  onInteresse,
  onRecusar,
  modoEnviado = false,
}: DemandaCardProps) {
  const [expandido, setExpandido] = useState(false);
  const { demanda, match, empresaNome, empresaVerificada } = item;
  const briefingLongo = demanda.briefing.length > BRIEFING_LIMITE;
  const briefingExibido =
    expandido || !briefingLongo
      ? demanda.briefing
      : `${demanda.briefing.slice(0, BRIEFING_LIMITE).trim()}…`;

  return (
    <article
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-cinza-200 bg-white p-5 shadow-sm transition-[border-color,box-shadow]",
        "hover:border-verde-neon/60 focus-within:border-verde-neon/60",
        "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        modoEnviado && "border-verde-acao/40 bg-[color-mix(in_srgb,var(--verde-acao)_4%,white)]",
      )}
    >
      <header className="flex items-start gap-4">
        <MatchRing
          score={match.score}
          size="sm"
          showLabel
          darkBackdrop
          className="shrink-0"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <Avatar size="sm">
                <AvatarFallback className="bg-lilas-claro font-display text-xs font-semibold text-lilas-escuro">
                  {iniciaisEmpresa(empresaNome)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-medium">{empresaNome}</p>
                  {empresaVerificada ? (
                    <BadgeCheck
                      className="text-verde-acao size-3.5 shrink-0"
                      aria-label="Empresa verificada"
                    />
                  ) : null}
                </div>
              </div>
            </div>
            {modoEnviado ? (
              <Badge
                variant="outline"
                className="shrink-0 border-lilas-escuro/25 bg-lilas-claro text-lilas-escuro"
              >
                Enviado
              </Badge>
            ) : null}
          </div>
          <h2 className="font-display text-base leading-snug font-semibold tracking-tight">
            {demanda.titulo}
          </h2>
        </div>
      </header>

      <div className="mt-4 space-y-3">
        <p className="font-display font-data text-2xl font-bold tracking-tight sm:text-3xl">
          {formatarMoeda(demanda.orcamento)}
        </p>

        <div className="text-texto-secundario flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5 shrink-0" aria-hidden />
            <span>
              Prazo{" "}
              <span className="text-foreground font-data font-medium">
                {formatarPrazo(demanda.prazo)}
              </span>
            </span>
          </span>
          <BadgeFormatoDemanda>
            {labelFormatoEntrega(demanda.formatoEntrega)}
          </BadgeFormatoDemanda>
        </div>

        <p className="text-texto-secundario text-sm leading-relaxed font-normal">
          {briefingExibido}
          {briefingLongo ? (
            <button
              type="button"
              className="text-lilas-escuro ml-1 font-medium hover:underline"
              onClick={() => setExpandido((v) => !v)}
            >
              {expandido ? "ver menos" : "ver mais"}
            </button>
          ) : null}
        </p>
      </div>

      {!modoEnviado ? (
        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-[1.4fr_1fr]">
          <Button
            type="button"
            variant="cta"
            size="lg"
            className="w-full"
            onClick={() => onInteresse(match.id)}
          >
            Tenho interesse
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="text-texto-secundario w-full hover:text-foreground"
            onClick={() => onRecusar(match.id)}
          >
            Não é pra mim
          </Button>
        </div>
      ) : (
        <div className="mt-5 space-y-2.5">
          <p className="text-texto-secundario text-center text-sm font-normal">
            Interesse enviado — a empresa pode iniciar a conversa.
          </p>
          <Link
            href={`/negociacao/${match.id}`}
            className={cn(
              buttonVariants({ variant: "cta", size: "lg" }),
              "w-full",
            )}
          >
            Acompanhar negociação
          </Link>
        </div>
      )}
    </article>
  );
}

type DemandaListaVaziaProps = {
  mensagem?: string;
  mostrarLinkPerfil?: boolean;
};

export function DemandaListaVazia({
  mensagem = "Nenhuma demanda disponível no momento — complete seu perfil para aparecer em mais buscas.",
  mostrarLinkPerfil = true,
}: DemandaListaVaziaProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-cinza-200 bg-white px-4 py-16 text-center">
      <p className="text-texto-secundario max-w-sm text-sm leading-relaxed font-normal">
        {mensagem}
      </p>
      {mostrarLinkPerfil ? (
        <Link
          href="/influenciador/cadastro"
          className="text-lilas-escuro mt-4 text-sm font-medium hover:underline"
        >
          Completar meu perfil →
        </Link>
      ) : null}
    </div>
  );
}
