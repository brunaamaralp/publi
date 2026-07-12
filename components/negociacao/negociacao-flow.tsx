"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ChatNegociacao } from "@/components/negociacao/chat-negociacao";
import { PaywallDesbloqueio } from "@/components/negociacao/paywall-desbloqueio";
import { buttonVariants } from "@/components/ui/button";
import { getNegociacaoContexto } from "@/lib/mock-data/negociacao";
import type { NegociacaoEstado } from "@/lib/negociacao/negociacao-types";
import {
  assinarContratoEmpresa,
  assinarContratoInfluenciador,
  carregarNegociacaoEstado,
  desbloquearChat,
  gerarContratoRascunho,
  salvarNegociacaoEstado,
} from "@/lib/negociacao/negociacao-utils";
import { cn } from "@/lib/utils";

type NegociacaoFlowProps = {
  matchId: string;
};

export function NegociacaoFlow({ matchId }: NegociacaoFlowProps) {
  const contexto = getNegociacaoContexto(matchId);
  const [estado, setEstado] = useState<NegociacaoEstado | null>(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    const inicial = carregarNegociacaoEstado(matchId);
    setEstado(inicial);
    setCarregado(true);
  }, [matchId]);

  const persistir = useCallback((next: NegociacaoEstado) => {
    setEstado(next);
    salvarNegociacaoEstado(next);
  }, []);

  const atualizarEstado = useCallback(
    (updater: (prev: NegociacaoEstado) => NegociacaoEstado) => {
      setEstado((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        salvarNegociacaoEstado(next);
        return next;
      });
    },
    [],
  );

  if (!contexto) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-xl font-semibold">Match não encontrado</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          O identificador <span className="font-data">{matchId}</span> não
          corresponde a uma negociação disponível.
        </p>
        <Link
          href="/influenciador/demandas"
          className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
        >
          Voltar ao feed
        </Link>
      </div>
    );
  }

  if (!carregado || !estado) {
    return (
      <div className="text-muted-foreground flex min-h-[50vh] items-center justify-center text-sm">
        Carregando negociação…
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-border border-b px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Link
            href="/empresa/demandas"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "-ml-2",
            )}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Voltar
          </Link>
          <div className="min-w-0">
            <p className="text-primary text-xs font-medium">Negociação</p>
            <p className="truncate text-sm font-medium">
              {contexto.demanda.titulo}
            </p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6">
        {!estado.desbloqueado ? (
          <PaywallDesbloqueio
            contexto={contexto}
            onDesbloqueado={() => {
              persistir(desbloquearChat(estado, contexto));
            }}
          />
        ) : (
          <ChatNegociacao
            contexto={contexto}
            estado={estado}
            onEstadoChange={persistir}
            onGerarContrato={(dados) => {
              atualizarEstado((prev) => gerarContratoRascunho(prev, dados));
            }}
            onAssinarEmpresa={() => {
              atualizarEstado(assinarContratoEmpresa);
            }}
            onAssinarInfluenciador={() => {
              atualizarEstado(assinarContratoInfluenciador);
            }}
          />
        )}
      </main>
    </div>
  );
}
