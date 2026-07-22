"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { AcoesPendentesFinanceiro } from "@/components/empresa/financeiro/acoes-pendentes-financeiro";
import { CardsResumoFinanceiroEmpresa } from "@/components/empresa/financeiro/cards-resumo-financeiro-empresa";
import { ListaTransacoesEmpresa } from "@/components/empresa/financeiro/lista-transacoes-empresa";
import { GraficoReceitaMensal } from "@/components/influenciador/financeiro/grafico-receita-mensal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  agregarPainelFinanceiroAgencia,
  idsEscrowParaEmpresa,
  type EscopoFinanceiroAgencia,
  type PainelFinanceiroAgencia,
} from "@/lib/financeiro";
import {
  listarAcoesPendentesDashboardEmpresa,
  type AcaoDashboardEmpresa,
} from "@/lib/empresa/dashboard-utils";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { useAgencia } from "@/lib/contexts/agencia-context";
import {
  AGENCIA_DEMO,
  EMPRESAS_CLIENTES_DEMO,
} from "@/lib/mock-data/agencia-dashboard";
import { EMPRESA_NEGOCIACAO_USUARIO_ID } from "@/lib/negociacao/negociacao-constantes";

const MAX_ACOES = 8;

type PainelState = {
  dados: PainelFinanceiroAgencia;
  acoes: AcaoDashboardEmpresa[];
  totalAcoes: number;
};

export function PainelFinanceiroAgenciaFlow() {
  const {
    agencia,
    empresasClientes,
    empresaAtivaId,
    empresaAtiva,
    inicializarAgencia,
  } = useAgencia();
  const [escopo, setEscopo] = useState<EscopoFinanceiroAgencia>("todos");
  const [pronto, setPronto] = useState(false);
  const [dados, setDados] = useState<PainelState | null>(null);

  useEffect(() => {
    if (!agencia && empresasClientes.length === 0) {
      inicializarAgencia(AGENCIA_DEMO, EMPRESAS_CLIENTES_DEMO);
    }
    setPronto(true);
  }, [agencia, empresasClientes.length, inicializarAgencia]);

  // Sem cliente ativo, força visão consolidada.
  useEffect(() => {
    if (pronto && !empresaAtivaId && escopo === "cliente") {
      setEscopo("todos");
    }
  }, [pronto, empresaAtivaId, escopo]);

  const clientes = useMemo(
    () =>
      empresasClientes.map((e) => ({
        id: e.id,
        nome: e.nomeFantasia ?? e.razaoSocial,
      })),
    [empresasClientes],
  );

  useEffect(() => {
    if (!pronto) return;

    const escopoEfetivo: EscopoFinanceiroAgencia =
      escopo === "cliente" && empresaAtivaId ? "cliente" : "todos";

    const painel = agregarPainelFinanceiroAgencia({
      escopo: escopoEfetivo,
      clientes,
      empresaAtivaId,
    });

    let acoes: AcaoDashboardEmpresa[] = [];
    if (escopoEfetivo === "cliente" && empresaAtivaId) {
      const ids = idsEscrowParaEmpresa(empresaAtivaId);
      for (const id of ids) {
        const { acoes: lista } = listarAcoesPendentesDashboardEmpresa(
          id,
          EMPRESA_NEGOCIACAO_USUARIO_ID,
          0,
        );
        acoes.push(
          ...lista.filter(
            (a) =>
              a.tipo === "revisar_entrega" ||
              a.tipo === "depositar_aditivo" ||
              a.tipo === "confirmar_termos",
          ),
        );
      }
      // Dedup por id
      const seen = new Set<string>();
      acoes = acoes.filter((a) => {
        if (seen.has(a.id)) return false;
        seen.add(a.id);
        return true;
      });
    }

    setDados({
      dados: painel,
      acoes: acoes.slice(0, MAX_ACOES),
      totalAcoes: acoes.length,
    });
  }, [pronto, escopo, empresaAtivaId, clientes]);

  if (!pronto) {
    return (
      <div className="text-muted-foreground flex min-h-[40vh] items-center justify-center text-sm">
        Carregando…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-4">
        <div>
          <p className="text-primary text-sm font-medium">Financeiro</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            Painel financeiro
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            {escopo === "cliente" && empresaAtiva
              ? `Investimento e pagamento protegido de ${empresaAtiva.nomeFantasia ?? empresaAtiva.razaoSocial}.`
              : "Visão consolidada da carteira de clientes — troque o escopo para focar no cliente ativo."}
          </p>
        </div>

        <div
          className="inline-flex rounded-button border border-cinza-200 bg-white p-1"
          role="group"
          aria-label="Escopo do financeiro"
        >
          <button
            type="button"
            onClick={() => setEscopo("cliente")}
            disabled={!empresaAtivaId}
            className={cn(
              "rounded-button px-3 py-1.5 text-sm font-medium transition-colors",
              escopo === "cliente" && empresaAtivaId
                ? "bg-verde-neon/15 text-foreground"
                : "text-texto-secundario hover:text-foreground",
              !empresaAtivaId && "cursor-not-allowed opacity-50",
            )}
          >
            Cliente ativo
          </button>
          <button
            type="button"
            onClick={() => setEscopo("todos")}
            className={cn(
              "rounded-button px-3 py-1.5 text-sm font-medium transition-colors",
              escopo === "todos" || !empresaAtivaId
                ? "bg-verde-neon/15 text-foreground"
                : "text-texto-secundario hover:text-foreground",
            )}
          >
            Todos os clientes
          </button>
        </div>
      </header>

      {dados ? (
        <>
          <CardsResumoFinanceiroEmpresa resumo={dados.dados.painel.resumo} />

          {dados.dados.escopo === "todos" ? (
            <TabelaClientesFinanceiro clientes={dados.dados.porCliente} />
          ) : null}

          <div className="grid gap-6 lg:grid-cols-5">
            <div
              className={
                dados.dados.escopo === "cliente" ? "lg:col-span-3" : "lg:col-span-5"
              }
            >
              <GraficoReceitaMensal
                dados={dados.dados.painel.gastoMensal}
                titulo="Investimento mensal"
                descricao={
                  dados.dados.escopo === "cliente"
                    ? "Depósitos do cliente ativo — últimos 6 meses"
                    : "Depósitos consolidados — últimos 6 meses"
                }
              />
            </div>
            {dados.dados.escopo === "cliente" ? (
              <div className="lg:col-span-2">
                <AcoesPendentesFinanceiro
                  acoes={dados.acoes}
                  total={dados.totalAcoes}
                />
              </div>
            ) : null}
          </div>

          <ListaTransacoesEmpresa
            transacoes={dados.dados.painel.transacoes}
          />
        </>
      ) : (
        <p className="text-muted-foreground text-sm">Carregando dados…</p>
      )}
    </div>
  );
}

function TabelaClientesFinanceiro({
  clientes,
}: {
  clientes: PainelFinanceiroAgencia["porCliente"];
}) {
  return (
    <Card className="border-cinza-200 bg-white ring-0">
      <CardHeader>
        <CardTitle className="font-display text-lg font-bold">
          Por cliente
        </CardTitle>
        <CardDescription className="text-texto-secundario font-normal">
          Investimento e retenção no pagamento protegido
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {clientes.length === 0 ? (
          <p className="text-texto-secundario px-4 py-8 text-center text-sm">
            Nenhum cliente vinculado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-cinza-200 bg-fundo-pagina">
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Investido no mês
                  </th>
                  <th className="px-4 py-3 text-right font-medium">Retido</th>
                  <th className="px-4 py-3 text-right font-medium">
                    Contratos ativos
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    Pendências
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr
                    key={c.empresaId}
                    className="border-b border-cinza-200 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={`/agencia/clientes/${c.empresaId}`}
                        className="text-lilas-escuro hover:underline"
                      >
                        {c.nome}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-data tabular-nums">
                        {formatarMoeda(c.investidoMes)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-data tabular-nums">
                        {formatarMoeda(c.retido)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-data tabular-nums">
                      {c.contratosAtivos}
                    </td>
                    <td className="px-4 py-3 text-right font-data tabular-nums">
                      {c.pendencias}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
