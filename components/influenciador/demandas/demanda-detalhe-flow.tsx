"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  ListChecks,
} from "lucide-react";
import { toast } from "sonner";

import { BadgeFormatoDemanda } from "@/components/influenciador/demandas/indicador-match";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  LABELS_FAIXA_MATCH,
  MatchRing,
  nivelMatchRing,
} from "@/components/ui/match-ring";
import { explicarMatchScore } from "@/lib/demandas/match-explicacao";
import {
  formatarPrazo,
  hrefFeedDemandas,
  labelFormatoEntrega,
  labelNichoDemanda,
  requisitosDemanda,
  tagsDemandaCard,
} from "@/lib/demandas/utils";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { obterDemandaFeedPorId } from "@/lib/mock-data/demandas";
import { cn } from "@/lib/utils";

type DemandaDetalheFlowProps = {
  demandaId: string;
};

function iniciaisEmpresa(nome: string) {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

export function DemandaDetalheFlow({ demandaId }: DemandaDetalheFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryVoltar = searchParams.toString();
  const hrefVoltar = hrefFeedDemandas(queryVoltar);

  const itemInicial = useMemo(
    () => obterDemandaFeedPorId(demandaId),
    [demandaId],
  );
  const [enviado, setEnviado] = useState(
    () => itemInicial?.match.status === "aceito",
  );

  if (!itemInicial) {
    return (
      <div className="min-h-full bg-fundo-pagina">
        <div className="mx-auto max-w-lg px-4 py-10 text-center">
          <h1 className="font-display text-xl font-bold">
            Demanda não encontrada
          </h1>
          <p className="text-texto-secundario mt-2 text-sm font-normal">
            Esta oportunidade pode ter expirado ou saído da sua lista.
          </p>
          <Link
            href={hrefVoltar}
            className={cn(
              buttonVariants({ variant: "cta", size: "lg" }),
              "mt-6 inline-flex",
            )}
          >
            Voltar às demandas
          </Link>
        </div>
      </div>
    );
  }

  const { demanda, match, empresaNome, empresaVerificada } = itemInicial;
  const explicacao = explicarMatchScore(match.score);
  const nivel = nivelMatchRing(match.score);
  const tags = tagsDemandaCard(demanda);
  const requisitos = requisitosDemanda(demanda);
  const nicho = labelNichoDemanda(demanda);

  function handleInteresse() {
    setEnviado(true);
    toast.success(
      "Interesse enviado — a empresa verá seu perfil nesta demanda.",
    );
  }

  function handleRecusar() {
    toast("Oportunidade removida da sua lista.");
    router.push(hrefVoltar);
  }

  return (
    <div className="min-h-full bg-fundo-pagina">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
        <Link
          href={hrefVoltar}
          className="text-texto-secundario hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Voltar às demandas
        </Link>

        <article className="card-marketing mt-5 overflow-hidden border-l-[3px] border-l-verde-neon p-0">
          <header className="flex flex-col gap-5 border-b border-cinza-200/80 bg-[color-mix(in_srgb,var(--lilas-claro)_40%,white)] p-5 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
            <MatchRing
              score={match.score}
              size="lg"
              showLabel
              label={LABELS_FAIXA_MATCH[nivel]}
              darkBackdrop
              className="mx-auto shrink-0 sm:mx-0"
            />
            <div className="min-w-0 flex-1 space-y-3 text-center sm:text-left">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <Avatar size="sm">
                  <AvatarFallback className="bg-lilas-claro font-display text-xs font-semibold text-lilas-escuro">
                    {iniciaisEmpresa(empresaNome)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium">{empresaNome}</p>
                {empresaVerificada ? (
                  <BadgeCheck
                    className="text-verde-acao size-3.5 shrink-0"
                    aria-label="Empresa verificada"
                  />
                ) : null}
              </div>
              <h1 className="font-display text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
                {demanda.titulo}
              </h1>
              <p className="font-display font-data text-3xl font-bold tracking-tight">
                {formatarMoeda(demanda.orcamento)}
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start">
                {tags.map((tag) => (
                  <BadgeFormatoDemanda key={tag}>{tag}</BadgeFormatoDemanda>
                ))}
              </div>
            </div>
          </header>

          <div className="space-y-8 p-5 sm:p-6">
            <section aria-labelledby="briefing-titulo">
              <h2
                id="briefing-titulo"
                className="font-display text-sm font-bold tracking-wide uppercase"
              >
                Briefing
              </h2>
              <p className="text-texto-secundario mt-2 text-sm leading-relaxed font-normal sm:text-base">
                {demanda.briefing}
              </p>
            </section>

            <section
              aria-labelledby="detalhes-titulo"
              className="grid gap-4 sm:grid-cols-2"
            >
              <h2 id="detalhes-titulo" className="sr-only">
                Detalhes da campanha
              </h2>
              <div className="rounded-card border border-cinza-200 bg-fundo-pagina p-4">
                <p className="text-texto-secundario text-xs font-medium tracking-wide uppercase">
                  Prazo
                </p>
                <p className="font-data mt-1 flex items-center gap-1.5 text-base font-semibold">
                  <CalendarDays className="size-4 text-verde-acao" aria-hidden />
                  {formatarPrazo(demanda.prazo)}
                </p>
              </div>
              <div className="rounded-card border border-cinza-200 bg-fundo-pagina p-4">
                <p className="text-texto-secundario text-xs font-medium tracking-wide uppercase">
                  Formato
                </p>
                <p className="mt-1 text-base font-semibold">
                  {labelFormatoEntrega(demanda.formatoEntrega)}
                </p>
              </div>
              {nicho ? (
                <div className="rounded-card border border-cinza-200 bg-fundo-pagina p-4">
                  <p className="text-texto-secundario text-xs font-medium tracking-wide uppercase">
                    Nicho
                  </p>
                  <p className="mt-1 text-base font-semibold">{nicho}</p>
                </div>
              ) : null}
              <div className="rounded-card border border-cinza-200 bg-fundo-pagina p-4">
                <p className="text-texto-secundario text-xs font-medium tracking-wide uppercase">
                  Orçamento
                </p>
                <p className="font-data mt-1 text-base font-semibold">
                  {formatarMoeda(demanda.orcamento)}
                </p>
              </div>
            </section>

            <section aria-labelledby="requisitos-titulo">
              <h2
                id="requisitos-titulo"
                className="font-display text-sm font-bold tracking-wide uppercase"
              >
                Requisitos
              </h2>
              <ul className="mt-3 space-y-2">
                {requisitos.map((req) => (
                  <li
                    key={req}
                    className="flex items-start gap-2 text-sm leading-snug"
                  >
                    <ListChecks
                      className="text-verde-acao mt-0.5 size-4 shrink-0"
                      aria-hidden
                    />
                    <span className="text-texto-secundario">{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-labelledby="match-titulo"
              className="rounded-card border border-cinza-200 border-l-[3px] border-l-verde-neon bg-white p-4 sm:p-5"
            >
              <h2
                id="match-titulo"
                className="font-display text-sm font-bold tracking-wide uppercase"
              >
                Por que este match
              </h2>
              <p className="text-texto-secundario mt-2 text-sm leading-relaxed font-normal">
                {explicacao.resumo}
              </p>
              <ul className="mt-4 space-y-3">
                {explicacao.fatores.map((fator) => (
                  <li key={fator.id} className="flex gap-3">
                    <span className="font-data text-verde-acao w-10 shrink-0 text-sm font-bold tabular-nums">
                      {fator.pontos}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{fator.label}</p>
                      <p className="text-texto-secundario text-xs leading-relaxed font-normal">
                        {fator.detalhe}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {!enviado ? (
              <div className="grid gap-2.5 sm:grid-cols-[1.4fr_1fr]">
                <Button
                  type="button"
                  variant="cta"
                  size="lg"
                  className="w-full"
                  onClick={handleInteresse}
                >
                  Tenho interesse
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="text-texto-secundario w-full hover:text-foreground"
                  onClick={handleRecusar}
                >
                  Não é pra mim
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
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
          </div>
        </article>
      </div>
    </div>
  );
}
