"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Lock,
  Scale,
  Wallet,
} from "lucide-react";

import { BannerCompletarPerfil } from "@/components/influenciador/banner-completar-perfil";
import { OnboardingCompletarPerfilDialog } from "@/components/influenciador/onboarding-completar-perfil-dialog";
import {
  BadgeFormatoDemanda,
  IndicadorMatch,
} from "@/components/influenciador/demandas/indicador-match";
import { buttonVariants } from "@/components/ui/button";
import { formatarNomeExibicao } from "@/lib/app/formatar-nome-exibicao";
import { useAuth } from "@/lib/auth-context";
import { hrefDetalheDemanda, labelFormatoEntrega } from "@/lib/demandas/utils";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import {
  listarAcoesPendentesDashboard,
  MAX_ACOES_DASHBOARD,
  resumoAgendaDashboard,
  resumoComparacaoPrecoDashboard,
  resumoSaldoDashboard,
  teaserOportunidadesDashboard,
  textoCurtoComparacaoMercado,
  type AcaoDashboard,
  type ResumoAgendaDashboard,
  type ResumoSaldoDashboard,
} from "@/lib/influenciador/dashboard-utils";
import { nomeExibicaoPerfil } from "@/lib/influenciador/perfil-storage";
import { INFLUENCIADOR_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import type { DemandaFeedItem } from "@/lib/mock-data/demandas";
import type { ResumoComparacaoMercado } from "@/lib/utils/comparacao-mercado";
import { cn } from "@/lib/utils";

type DashboardState = {
  acoes: AcaoDashboard[];
  totalAcoes: number;
  saldo: ResumoSaldoDashboard;
  oportunidades: DemandaFeedItem[];
  comparacao: ResumoComparacaoMercado | null;
  agenda: ResumoAgendaDashboard;
};

function carregarDashboard(influenciadorId: string): DashboardState {
  const { acoes, total } = listarAcoesPendentesDashboard(influenciadorId);
  return {
    acoes,
    totalAcoes: total,
    saldo: resumoSaldoDashboard(influenciadorId),
    oportunidades: teaserOportunidadesDashboard(3),
    comparacao: resumoComparacaoPrecoDashboard(influenciadorId),
    agenda: resumoAgendaDashboard(influenciadorId),
  };
}

type DashboardInfluenciadorProps = {
  nomeExibicao: string;
  influenciadorId?: string;
};

export function DashboardInfluenciador({
  nomeExibicao,
  influenciadorId = INFLUENCIADOR_MOCK_ID,
}: DashboardInfluenciadorProps) {
  const [dados, setDados] = useState<DashboardState | null>(null);

  useEffect(() => {
    setDados(carregarDashboard(influenciadorId));
  }, [influenciadorId]);

  if (!dados) {
    return (
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
        <header className="space-y-2">
          <p className="text-texto-secundario text-sm font-normal">Painel</p>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Olá, {nomeExibicao}
          </h1>
          <p className="text-texto-secundario text-sm font-normal">Carregando…</p>
        </header>
      </div>
    );
  }

  const textoMercado = dados.comparacao
    ? textoCurtoComparacaoMercado(dados.comparacao)
    : "Compare seus preços no portfólio";

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <p className="text-texto-secundario text-sm font-normal">Painel</p>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Olá, {nomeExibicao}
        </h1>
        <p className="text-texto-secundario max-w-2xl text-sm font-normal leading-relaxed">
          Ações pendentes, saldo e oportunidades em um só lugar.
        </p>
      </header>

      <BannerCompletarPerfil />
      <OnboardingCompletarPerfilDialog />

      <section className="space-y-3" aria-labelledby="acoes-pendentes">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="acoes-pendentes" className="font-display text-lg font-bold">
            Precisa da sua atenção
          </h2>
          {dados.totalAcoes > MAX_ACOES_DASHBOARD ? (
            <Link
              href="/influenciador/financeiro"
              className="text-verde-acao text-sm font-medium hover:underline"
            >
              Ver tudo ({dados.totalAcoes})
            </Link>
          ) : null}
        </div>

        {dados.acoes.length === 0 ? (
          <div className="rounded-card border border-cinza-200 bg-white px-4 py-6 text-center">
            <CheckCircle2
              className="text-verde-neon mx-auto size-8"
              aria-hidden
            />
            <p className="font-display mt-3 text-base font-bold">
              Tudo em dia por aqui
            </p>
            <p className="text-texto-secundario mt-1 text-sm font-normal">
              Nenhuma ação pendente nos seus contratos no momento.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {dados.acoes.map((acao) => (
              <li key={acao.id}>
                <Link
                  href={acao.href}
                  className="group flex items-center justify-between gap-3 rounded-card border border-cinza-200 border-l-[3px] border-l-verde-neon bg-white px-4 py-3 transition-colors hover:bg-fundo-pagina"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-display text-sm font-bold leading-snug">
                      {acao.titulo}
                    </p>
                    <p className="text-texto-secundario text-xs font-normal capitalize">
                      {acao.acaoLabel}
                    </p>
                  </div>
                  <span
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "shrink-0",
                    )}
                  >
                    {acao.acaoLabel}
                    <ArrowRight className="size-3.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3" aria-labelledby="saldo-dashboard">
        <h2 id="saldo-dashboard" className="font-display text-lg font-bold">
          Saldo
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-card border border-verde-neon/30 bg-white p-4">
            <p className="text-texto-secundario flex items-center gap-1.5 text-xs font-normal">
              <Wallet className="size-3.5" aria-hidden />
              Saldo disponível
            </p>
            <p className="font-data text-verde-acao mt-2 text-3xl font-bold tracking-tight">
              {formatarMoeda(dados.saldo.disponivel)}
            </p>
            <p className="text-texto-secundario mt-1 text-xs font-normal">
              Entregas aprovadas ainda não sacadas
            </p>
            <Link
              href="/influenciador/financeiro"
              className={cn(
                buttonVariants({
                  variant: dados.saldo.disponivel > 0 ? "cta" : "outline",
                  size: "sm",
                }),
                "mt-4 inline-flex",
                dados.saldo.disponivel <= 0 && "pointer-events-none opacity-50",
              )}
              aria-disabled={dados.saldo.disponivel <= 0}
            >
              Sacar no financeiro
            </Link>
          </article>

          <article className="rounded-card border border-cinza-200 bg-white p-4">
            <p className="text-texto-secundario flex items-center gap-1.5 text-xs font-normal">
              <Lock className="size-3.5" aria-hidden />
              Retido em contratos
            </p>
            <p className="font-data mt-2 text-3xl font-bold tracking-tight">
              {formatarMoeda(dados.saldo.retido)}
            </p>
            <p className="text-texto-secundario mt-1 text-xs font-normal">
              {dados.saldo.entregasEmAndamento === 0
                ? "Nenhuma entrega em andamento"
                : dados.saldo.entregasEmAndamento === 1
                  ? "1 entrega em andamento"
                  : `${dados.saldo.entregasEmAndamento} entregas em andamento`}
            </p>
            <Link
              href="/influenciador/financeiro"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-4 inline-flex",
              )}
            >
              Ver financeiro
            </Link>
          </article>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="oportunidades-dashboard">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2
            id="oportunidades-dashboard"
            className="font-display text-lg font-bold"
          >
            Novas oportunidades
          </h2>
          <Link
            href="/influenciador/demandas"
            className="text-verde-acao text-sm font-medium hover:underline"
          >
            Ver todas
          </Link>
        </div>

        {dados.oportunidades.length === 0 ? (
          <p className="text-texto-secundario rounded-card border border-cinza-200 bg-white px-4 py-5 text-sm">
            Nenhuma oportunidade disponível no momento.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-3">
            {dados.oportunidades.map((item) => (
              <li key={item.demanda.id}>
                <Link
                  href={hrefDetalheDemanda(item.demanda.id, "")}
                  className="group flex h-full flex-col gap-3 rounded-card border border-cinza-200 border-l-[3px] border-l-transparent bg-white p-4 transition-[border-color,background-color,box-shadow] hover:border-l-verde-neon hover:bg-fundo-pagina hover:shadow-[0_8px_24px_color-mix(in_srgb,var(--preto)_6%,transparent)]"
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    <BadgeFormatoDemanda>
                      {labelFormatoEntrega(item.demanda.formatoEntrega)}
                    </BadgeFormatoDemanda>
                    <IndicadorMatch
                      score={item.match.score}
                      variante="compact"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-display line-clamp-2 text-sm font-bold leading-snug">
                      {item.demanda.titulo}
                    </p>
                    <p className="text-texto-secundario text-xs font-normal">
                      {item.empresaNome}
                    </p>
                  </div>
                  <p className="font-data text-sm font-semibold tracking-tight">
                    {formatarMoeda(item.demanda.orcamento)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        className="grid gap-3 sm:grid-cols-2"
        aria-label="Informações de apoio"
      >
        <article className="card-metrica-perfil rounded-card p-4 ring-0">
          <p className="flex items-center gap-1.5 text-xs font-medium opacity-80">
            <Scale className="size-3.5" aria-hidden />
            Preço × mercado
          </p>
          <p className="font-display mt-2 text-sm font-bold leading-snug">
            {textoMercado}
          </p>
          <Link
            href="/influenciador/meu-portfolio#precos"
            className="mt-3 inline-flex text-xs font-medium underline-offset-2 hover:underline"
          >
            Ajustar preços
          </Link>
        </article>

        <article className="rounded-card border border-cinza-200 bg-white p-4">
          <p className="text-texto-secundario flex items-center gap-1.5 text-xs font-normal">
            <CalendarDays className="size-3.5" aria-hidden />
            Agenda
          </p>
          <p className="font-display mt-2 text-sm font-bold leading-snug">
            {dados.agenda.texto}
          </p>
          {dados.agenda.proximasDatasLivres.length > 0 ? (
            <p className="text-texto-secundario mt-1 text-xs font-normal">
              Próximos livres: {dados.agenda.proximasDatasLivres.join(" · ")}
            </p>
          ) : (
            <p className="text-texto-secundario mt-1 text-xs font-normal">
              Nenhuma data livre na janela — ajuste a disponibilidade.
            </p>
          )}
          <Link
            href="/influenciador/meu-portfolio#agenda"
            className="text-verde-acao mt-3 inline-flex text-xs font-medium hover:underline"
          >
            Gerenciar agenda
          </Link>
        </article>
      </section>
    </div>
  );
}

export function useNomeExibicaoUsuario() {
  const { usuario } = useAuth();
  const nomePerfil = usuario ? nomeExibicaoPerfil(usuario.id) : null;
  return nomePerfil ?? formatarNomeExibicao(usuario?.email);
}
