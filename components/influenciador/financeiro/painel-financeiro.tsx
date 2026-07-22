"use client";

import { useEffect, useState } from "react";

import { CardsResumoFinanceiro } from "@/components/influenciador/financeiro/cards-resumo-financeiro";
import { GraficoReceitaMensal } from "@/components/influenciador/financeiro/grafico-receita-mensal";
import { IndicadoresDemanda } from "@/components/influenciador/financeiro/indicadores-demanda";
import { ListaTransacoesRecentes } from "@/components/influenciador/financeiro/lista-transacoes-recentes";
import { PainelSaldoSaque } from "@/components/influenciador/financeiro/painel-saldo-saque";
import { RecomendacoesFinanceiras } from "@/components/influenciador/financeiro/recomendacoes-financeiras";
import {
  FORMATO_MAIS_REQUISITADO,
  INDICADORES_FORMATO_MOCK,
  RECEITA_MENSAL_MOCK,
  RECOMENDACOES_FINANCEIRAS_MOCK,
  RESUMO_FINANCEIRO_MOCK,
  TRANSACOES_RECENTES_MOCK,
} from "@/lib/mock-data/financeiro";
import { LABELS_TIPO_SERVICO } from "@/lib/influenciador/cadastro-utils";
import {
  CONTRATO_AJUSTE_ID,
  CONTRATO_APROVADO_ID,
  CONTRATO_CNPJ_ID,
  CONTRATO_ENTREGUE_ID,
  estadoPagamentoSeed,
} from "@/lib/mock-data/contratos-pagamento";
import {
  carregarPagamentoEstado,
  processarLiberacoesAutomaticas,
  salvarPagamentoEstado,
  valorRetidoPagamentoRetido,
} from "@/lib/pagamento/pagamento-utils";
import { creditarSaldoDisponivel } from "@/lib/pagamento/saldo-influenciador";
import { getContratoPagamentoContexto } from "@/lib/mock-data/contratos-pagamento";

export function PainelFinanceiro() {
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    // Checagem de liberação automática no load do dashboard (sem cron).
    for (const id of [
      CONTRATO_CNPJ_ID,
      CONTRATO_ENTREGUE_ID,
      CONTRATO_AJUSTE_ID,
      CONTRATO_APROVADO_ID,
    ]) {
      const estado = carregarPagamentoEstado(id) ?? estadoPagamentoSeed(id);
      if (!estado) continue;
      const antes = valorRetidoPagamentoRetido(estado);
      const next = processarLiberacoesAutomaticas(estado);
      const depois = valorRetidoPagamentoRetido(next);
      if (depois < antes) {
        const ctx = getContratoPagamentoContexto(id);
        if (ctx) {
          creditarSaldoDisponivel(ctx.influenciador.id, antes - depois);
        }
        salvarPagamentoEstado(next);
      }
    }
    setPronto(true);
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <header>
        <p className="text-primary text-sm font-medium">Financeiro</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          Seu painel financeiro
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
          Acompanhe saldo disponível para saque, valores retidos no pagamento retido e
          tendências de demanda.
        </p>
      </header>

      {pronto ? <PainelSaldoSaque /> : null}

      <CardsResumoFinanceiro resumo={RESUMO_FINANCEIRO_MOCK} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <GraficoReceitaMensal dados={RECEITA_MENSAL_MOCK} />
        </div>
        <div className="lg:col-span-2">
          <IndicadoresDemanda
            indicadores={INDICADORES_FORMATO_MOCK}
            formatoDestaque={LABELS_TIPO_SERVICO[FORMATO_MAIS_REQUISITADO]}
          />
        </div>
      </div>

      <ListaTransacoesRecentes transacoes={TRANSACOES_RECENTES_MOCK} />

      <RecomendacoesFinanceiras recomendacoes={RECOMENDACOES_FINANCEIRAS_MOCK} />
    </div>
  );
}
