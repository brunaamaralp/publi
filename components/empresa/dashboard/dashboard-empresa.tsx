"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Lock,
  Search,
  ShieldAlert,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { formatarNomeExibicao } from "@/lib/app/formatar-nome-exibicao";
import { useAuth } from "@/lib/auth-context";
import {
  formatarDesdeQuando,
  listarAcoesPendentesDashboardEmpresa,
  listarDisputasDashboardEmpresa,
  MAX_ACOES_DASHBOARD_EMPRESA,
  resumoFinanceiroDashboardEmpresa,
  type AcaoDashboardEmpresa,
  type DisputaDashboardEmpresa,
  type ResumoFinanceiroEmpresa,
} from "@/lib/empresa/dashboard-utils";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { EMPRESA_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import { EMPRESA_NEGOCIACAO_USUARIO_ID } from "@/lib/negociacao/negociacao-constantes";
import { cn } from "@/lib/utils";

type DashboardState = {
  acoes: AcaoDashboardEmpresa[];
  totalAcoes: number;
  financeiro: ResumoFinanceiroEmpresa;
  disputas: DisputaDashboardEmpresa[];
};

function carregarDashboard(
  empresaId: string,
  empresaUsuarioId: string,
): DashboardState {
  const { acoes, total } = listarAcoesPendentesDashboardEmpresa(
    empresaId,
    empresaUsuarioId,
  );
  return {
    acoes,
    totalAcoes: total,
    financeiro: resumoFinanceiroDashboardEmpresa(empresaId),
    disputas: listarDisputasDashboardEmpresa(empresaId),
  };
}

type DashboardEmpresaProps = {
  nomeExibicao: string;
  empresaId?: string;
  empresaUsuarioId?: string;
};

export function DashboardEmpresa({
  nomeExibicao,
  empresaId = EMPRESA_MOCK_ID,
  empresaUsuarioId = EMPRESA_NEGOCIACAO_USUARIO_ID,
}: DashboardEmpresaProps) {
  const [dados, setDados] = useState<DashboardState | null>(null);

  useEffect(() => {
    setDados(carregarDashboard(empresaId, empresaUsuarioId));
  }, [empresaId, empresaUsuarioId]);

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

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <p className="text-texto-secundario text-sm font-normal">Painel</p>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Olá, {nomeExibicao}
        </h1>
        <p className="text-texto-secundario max-w-2xl text-sm font-normal leading-relaxed">
          Ações pendentes, pagamentos protegidos e busca de creators em um só
          lugar.
        </p>
      </header>

      <section className="space-y-3" aria-labelledby="acoes-empresa">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="acoes-empresa" className="font-display text-lg font-bold">
            Precisa da sua atenção
          </h2>
          {dados.totalAcoes > MAX_ACOES_DASHBOARD_EMPRESA ? (
            <Link
              href="/empresa/demandas"
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

      <section className="space-y-3" aria-labelledby="resumo-financeiro-empresa">
        <h2
          id="resumo-financeiro-empresa"
          className="font-display text-lg font-bold"
        >
          Resumo financeiro
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-card border border-cinza-200 bg-white p-4">
            <p className="text-texto-secundario flex items-center gap-1.5 text-xs font-normal">
              <Lock className="size-3.5" aria-hidden />
              Retido em pagamento protegido
            </p>
            <p className="font-data mt-2 text-3xl font-bold tracking-tight">
              {formatarMoeda(dados.financeiro.retido)}
            </p>
            <p className="text-texto-secundario mt-1 text-xs font-normal">
              {dados.financeiro.contratosAtivos === 0
                ? "Nenhum contrato ativo"
                : dados.financeiro.contratosAtivos === 1
                  ? "1 contrato ativo"
                  : `${dados.financeiro.contratosAtivos} contratos ativos`}
            </p>
          </article>

          <article className="card-metrica-perfil rounded-card p-4 ring-0">
            <p className="flex items-center gap-1.5 text-xs font-medium opacity-80">
              <FileText className="size-3.5" aria-hidden />
              Demandas ativas
            </p>
            <p className="font-data mt-2 text-3xl font-bold tracking-tight">
              {dados.financeiro.demandasAtivas}
            </p>
            <p className="mt-1 text-xs font-normal opacity-80">
              {dados.financeiro.matchesRecebidos === 0
                ? "Nenhuma candidatura recebida"
                : dados.financeiro.matchesRecebidos === 1
                  ? "1 candidatura/match no total"
                  : `${dados.financeiro.matchesRecebidos} candidaturas/matches no total`}
            </p>
            <Link
              href="/empresa/demandas"
              className="mt-3 inline-flex text-xs font-medium underline-offset-2 hover:underline"
            >
              Ver campanhas
            </Link>
          </article>
        </div>
      </section>

      <section
        className="card-marketing-lilas relative overflow-hidden rounded-card p-6"
        aria-labelledby="buscar-creators-destaque"
      >
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg space-y-2">
            <div className="flex size-10 items-center justify-center rounded-button border border-lilas/50 bg-white/60 text-lilas-escuro">
              <Search className="size-5" aria-hidden />
            </div>
            <h2
              id="buscar-creators-destaque"
              className="font-display text-xl font-bold text-lilas-escuro"
            >
              Buscar creators
            </h2>
            <p className="text-sm font-normal leading-relaxed text-lilas-escuro/80">
              Encontre influenciadores e modelos fora do fluxo de demanda —
              filtro por nicho, região, preço e disponibilidade.
            </p>
          </div>
          <Link
            href="/empresa/buscar-creators"
            className={cn(buttonVariants({ variant: "cta", size: "lg" }), "shrink-0")}
          >
            Abrir busca ativa
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      {dados.disputas.length > 0 ? (
        <section className="space-y-3" aria-labelledby="disputas-empresa">
          <h2 id="disputas-empresa" className="font-display text-lg font-bold">
            Em análise pela equipe Publi
          </h2>
          <ul className="space-y-2">
            {dados.disputas.map((disputa) => (
              <li
                key={disputa.id}
                className="flex items-start gap-3 rounded-card border border-ambar/40 bg-ambar-claro/40 px-4 py-3"
              >
                <ShieldAlert
                  className="text-ambar-escuro mt-0.5 size-4 shrink-0"
                  aria-hidden
                />
                <div className="min-w-0 space-y-0.5">
                  <p className="font-display text-sm font-bold leading-snug">
                    Disputa com {disputa.influenciadorNome}
                  </p>
                  <p className="text-texto-secundario text-xs font-normal">
                    Reportado em {formatarDesdeQuando(disputa.reportadoEm)} ·
                    contrato #{disputa.contratoId.replace(/^ctr-/, "")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export function useNomeExibicaoUsuario() {
  const { usuario } = useAuth();
  return formatarNomeExibicao(usuario?.email);
}
