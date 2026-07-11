"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Wallet } from "lucide-react";

import {
  BadgeEmpresa,
  IndicadorMatch,
} from "@/components/influenciador/demandas/indicador-match";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatarPrazo, labelFormatoEntrega } from "@/lib/demandas/utils";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import type { DemandaFeedItem } from "@/lib/mock-data/demandas";

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
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start gap-3 pb-2">
        <div className="min-w-0 flex-1 space-y-2">
          <BadgeEmpresa nome={empresaNome} verificada={empresaVerificada} />
          <h3 className="text-base leading-snug font-semibold">
            {demanda.titulo}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary">
              {labelFormatoEntrega(demanda.formatoEntrega)}
            </Badge>
          </div>
        </div>
        <IndicadorMatch score={match.score} />
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {briefingExibido}
          {briefingLongo ? (
            <button
              type="button"
              className="text-primary ml-1 font-medium hover:underline"
              onClick={() => setExpandido((v) => !v)}
            >
              {expandido ? "ver menos" : "ver mais"}
            </button>
          ) : null}
        </p>

        <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <Wallet className="size-3.5" aria-hidden />
            <span className="text-foreground font-data font-semibold">
              {formatarMoeda(demanda.orcamento)}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" aria-hidden />
            Prazo:{" "}
            <span className="text-foreground font-data">
              {formatarPrazo(demanda.prazo)}
            </span>
          </span>
        </div>
      </CardContent>

      {!modoEnviado ? (
        <CardFooter className="flex gap-2 border-t pt-4">
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
            className="flex-1"
            onClick={() => onInteresse(match.id)}
          >
            Tenho interesse
          </Button>
        </CardFooter>
      ) : (
        <CardFooter className="border-t pt-4">
          <p className="text-primary w-full text-center text-sm font-medium">
            Interesse enviado — aguardando resposta da empresa
          </p>
        </CardFooter>
      )}
    </Card>
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
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
        {mensagem}
      </p>
      {mostrarLinkPerfil ? (
        <Link
          href="/influenciador/cadastro"
          className="text-primary mt-4 text-sm font-medium hover:underline"
        >
          Completar meu perfil →
        </Link>
      ) : null}
    </div>
  );
}
