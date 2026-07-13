"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Wallet } from "lucide-react";

import {
  BadgeEmpresa,
  BadgeFormatoDemanda,
  IndicadorMatch,
} from "@/components/influenciador/demandas/indicador-match";
import { Button } from "@/components/ui/button";
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
        "overflow-hidden rounded-card border border-cinza-200 bg-white transition-[border-color,box-shadow]",
        "hover:border-verde-neon focus-within:border-verde-neon",
        modoEnviado && "border-verde-neon/50",
      )}
    >
      <header className="border-b border-cinza-200/80 p-4">
        <div className="flex items-start gap-4">
          <IndicadorMatch score={match.score} alinhamento="inicio" />
          <div className="min-w-0 flex-1 space-y-2 pt-0.5">
            <BadgeEmpresa nome={empresaNome} verificada={empresaVerificada} />
            <h3 className="font-display text-base leading-snug font-bold">
              {demanda.titulo}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <BadgeFormatoDemanda>
                {labelFormatoEntrega(demanda.formatoEntrega)}
              </BadgeFormatoDemanda>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-3 p-4">
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

        <div className="text-texto-secundario flex flex-wrap gap-x-5 gap-y-2 text-sm font-normal">
          <span className="inline-flex items-center gap-1.5">
            <Wallet className="size-3.5 shrink-0" aria-hidden />
            <span className="text-foreground font-data font-medium">
              {formatarMoeda(demanda.orcamento)}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0" aria-hidden />
            Prazo:{" "}
            <span className="text-foreground font-data">
              {formatarPrazo(demanda.prazo)}
            </span>
          </span>
        </div>
      </div>

      {!modoEnviado ? (
        <footer className="flex gap-2 border-t border-cinza-200/80 p-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onRecusar(match.id)}
          >
            Recusar
          </Button>
          <Button
            type="button"
            variant="cta"
            className="flex-1"
            onClick={() => onInteresse(match.id)}
          >
            Tenho interesse
          </Button>
        </footer>
      ) : (
        <footer className="border-t border-cinza-200/80 p-4">
          <p className="text-verde-neon w-full text-center text-sm font-medium">
            Interesse enviado — aguardando resposta da empresa
          </p>
        </footer>
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
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-cinza-200 bg-white px-4 py-16 text-center">
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
