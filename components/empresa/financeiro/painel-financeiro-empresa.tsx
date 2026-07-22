"use client";

import { useEffect, useState } from "react";

import { AcoesPendentesFinanceiro } from "@/components/empresa/financeiro/acoes-pendentes-financeiro";
import { CardsResumoFinanceiroEmpresa } from "@/components/empresa/financeiro/cards-resumo-financeiro-empresa";
import { ListaTransacoesEmpresa } from "@/components/empresa/financeiro/lista-transacoes-empresa";
import { GraficoReceitaMensal } from "@/components/influenciador/financeiro/grafico-receita-mensal";
import {
  agregarPainelFinanceiroEmpresa,
  type PainelFinanceiroEmpresa,
} from "@/lib/financeiro";
import {
  listarAcoesPendentesDashboardEmpresa,
  type AcaoDashboardEmpresa,
} from "@/lib/empresa/dashboard-utils";
import { EMPRESA_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import { EMPRESA_NEGOCIACAO_USUARIO_ID } from "@/lib/negociacao/negociacao-constantes";

const MAX_ACOES_FINANCEIRO = 8;

type PainelState = {
  painel: PainelFinanceiroEmpresa;
  acoes: AcaoDashboardEmpresa[];
  totalAcoes: number;
};

type PainelFinanceiroEmpresaFlowProps = {
  empresaId?: string;
  empresaUsuarioId?: string;
};

export function PainelFinanceiroEmpresaFlow({
  empresaId = EMPRESA_MOCK_ID,
  empresaUsuarioId = EMPRESA_NEGOCIACAO_USUARIO_ID,
}: PainelFinanceiroEmpresaFlowProps) {
  const [dados, setDados] = useState<PainelState | null>(null);

  useEffect(() => {
    const painel = agregarPainelFinanceiroEmpresa(empresaId);
    const { acoes } = listarAcoesPendentesDashboardEmpresa(
      empresaId,
      empresaUsuarioId,
      0,
    );
    const acoesFinanceiras = acoes.filter(
      (a) =>
        a.tipo === "revisar_entrega" ||
        a.tipo === "depositar_aditivo" ||
        a.tipo === "confirmar_termos",
    );
    setDados({
      painel,
      acoes: acoesFinanceiras.slice(0, MAX_ACOES_FINANCEIRO),
      totalAcoes: acoesFinanceiras.length,
    });
  }, [empresaId, empresaUsuarioId]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <header>
        <p className="text-primary text-sm font-medium">Financeiro</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          Painel financeiro
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
          Acompanhe investimento do mês, valores retidos no pagamento protegido
          e o que precisa da sua ação.
        </p>
      </header>

      {dados ? (
        <>
          <CardsResumoFinanceiroEmpresa resumo={dados.painel.resumo} />

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <GraficoReceitaMensal
                dados={dados.painel.gastoMensal}
                titulo="Investimento mensal"
                descricao="Depósitos no pagamento protegido — últimos 6 meses"
              />
            </div>
            <div className="lg:col-span-2">
              <AcoesPendentesFinanceiro
                acoes={dados.acoes}
                total={dados.totalAcoes}
              />
            </div>
          </div>

          <ListaTransacoesEmpresa transacoes={dados.painel.transacoes} />
        </>
      ) : (
        <p className="text-muted-foreground text-sm">Carregando…</p>
      )}
    </div>
  );
}
