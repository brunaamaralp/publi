"use client";

import { useEffect, useState } from "react";

import { CardsResumoFinanceiro } from "@/components/influenciador/financeiro/cards-resumo-financeiro";
import { GraficoReceitaMensal } from "@/components/influenciador/financeiro/grafico-receita-mensal";
import { IndicadoresDemanda } from "@/components/influenciador/financeiro/indicadores-demanda";
import { ListaTransacoesRecentes } from "@/components/influenciador/financeiro/lista-transacoes-recentes";
import { PainelSaldoSaque } from "@/components/influenciador/financeiro/painel-saldo-saque";
import { ProximasLiberacoes } from "@/components/influenciador/financeiro/proximas-liberacoes";
import { RecomendacoesFinanceiras } from "@/components/influenciador/financeiro/recomendacoes-financeiras";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  agregarPainelFinanceiroInfluenciador,
  processarLiberacoesPainelInfluenciador,
  type PainelFinanceiroInfluenciador,
} from "@/lib/financeiro";
import {
  FORMATO_MAIS_REQUISITADO,
  INDICADORES_FORMATO_MOCK,
  RECOMENDACOES_FINANCEIRAS_MOCK,
} from "@/lib/mock-data/financeiro";
import { LABELS_TIPO_SERVICO } from "@/lib/influenciador/cadastro-utils";
import { INFLUENCIADOR_MOCK_ID } from "@/lib/mock-data/avaliacoes";

type AbaFinanceiro = "resumo" | "historico" | "insights";

export function PainelFinanceiro() {
  const [painel, setPainel] = useState<PainelFinanceiroInfluenciador | null>(
    null,
  );
  const [aba, setAba] = useState<AbaFinanceiro>("resumo");

  useEffect(() => {
    processarLiberacoesPainelInfluenciador(INFLUENCIADOR_MOCK_ID);
    setPainel(agregarPainelFinanceiroInfluenciador(INFLUENCIADOR_MOCK_ID));
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <p className="text-texto-secundario text-sm font-medium">Financeiro</p>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Seu painel financeiro
        </h1>
        <p className="text-texto-secundario max-w-2xl text-sm font-normal leading-relaxed">
          Acompanhe saldo disponível para saque, valores retidos no pagamento
          protegido e liberações previstas.
        </p>
      </header>

      {/* Acima da dobra: saldo + KPIs-chave */}
      {painel ? (
        <div className="space-y-6">
          <PainelSaldoSaque />
          <CardsResumoFinanceiro resumo={painel.resumo} variante="destaque" />
        </div>
      ) : (
        <p className="text-texto-secundario text-sm">Carregando painel…</p>
      )}

      {painel ? (
        <Tabs
          value={aba}
          onValueChange={(v) => {
            if (v === "resumo" || v === "historico" || v === "insights") {
              setAba(v);
            }
          }}
          className="gap-6"
        >
          <TabsList
            variant="line"
            className="h-auto w-full max-w-full flex-wrap justify-start"
            aria-label="Seções do painel financeiro"
          >
            <TabsTrigger value="resumo" className="px-3">
              Resumo
            </TabsTrigger>
            <TabsTrigger value="historico" className="px-3">
              Histórico
            </TabsTrigger>
            <TabsTrigger value="insights" className="px-3">
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resumo" className="space-y-6">
            <ProximasLiberacoes liberacoes={painel.proximasLiberacoes} />
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <GraficoReceitaMensal dados={painel.receitaMensal} />
              </div>
              <div className="lg:col-span-2">
                <IndicadoresDemanda
                  indicadores={INDICADORES_FORMATO_MOCK}
                  formatoDestaque={LABELS_TIPO_SERVICO[FORMATO_MAIS_REQUISITADO]}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="historico" className="space-y-6">
            <ListaTransacoesRecentes transacoes={painel.transacoes} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <CardsResumoFinanceiro
              resumo={painel.resumo}
              variante="projecao"
            />
            <RecomendacoesFinanceiras
              recomendacoes={RECOMENDACOES_FINANCEIRAS_MOCK}
            />
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  );
}
