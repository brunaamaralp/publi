import type {
  FormatoDemandaIndicador,
  ReceitaMensal,
  RecomendacaoFinanceira,
  ResumoFinanceiro,
  TransacaoFinanceira,
} from "@/lib/financeiro/types";
import type { TipoServico } from "@/lib/influenciador/cadastro-utils";

import {
  CONTRATO_AJUSTE_ID,
  CONTRATO_APROVADO_ID,
  CONTRATO_CNPJ_ID,
  CONTRATO_CPF_ID,
  CONTRATO_ENTREGUE_ID,
} from "@/lib/mock-data/contratos-pagamento";

export type {
  FormatoDemandaIndicador,
  ReceitaMensal,
  RecomendacaoFinanceira,
  ResumoFinanceiro,
  TransacaoFinanceira,
};

/** Receita dos últimos 6 meses — seed de fallback quando não há liberação live. */
export const RECEITA_MENSAL_MOCK: ReceitaMensal[] = [
  { mesLabel: "Fev", mesAno: "2026-02", receita: 6200 },
  { mesLabel: "Mar", mesAno: "2026-03", receita: 7800 },
  { mesLabel: "Abr", mesAno: "2026-04", receita: 7100 },
  { mesLabel: "Mai", mesAno: "2026-05", receita: 9400 },
  { mesLabel: "Jun", mesAno: "2026-06", receita: 10200 },
  { mesLabel: "Jul", mesAno: "2026-07", receita: 11850 },
];

/** Investimento mensal da empresa — seed de fallback no gráfico. */
export const GASTO_MENSAL_EMPRESA_MOCK: ReceitaMensal[] = [
  { mesLabel: "Fev", mesAno: "2026-02", receita: 9800 },
  { mesLabel: "Mar", mesAno: "2026-03", receita: 11200 },
  { mesLabel: "Abr", mesAno: "2026-04", receita: 8900 },
  { mesLabel: "Mai", mesAno: "2026-05", receita: 13400 },
  { mesLabel: "Jun", mesAno: "2026-06", receita: 15100 },
  { mesLabel: "Jul", mesAno: "2026-07", receita: 16800 },
];

export const RESUMO_FINANCEIRO_MOCK: ResumoFinanceiro = {
  ganhosMesAtual: 11850,
  variacaoMesAnterior: 16.2,
  contratosConcluidosMes: 4,
  ticketMedio: 2962.5,
};

/** @deprecated Preferir ledger derivado de `agregarPainelFinanceiroInfluenciador`. */
export const TRANSACOES_RECENTES_MOCK: TransacaoFinanceira[] = [
  {
    id: "tx-001",
    data: "2026-07-14T16:00:00.000Z",
    empresaNome: "Sabor & Arte",
    valor: 5200,
    statusPagamento: "liberado",
    contratoId: CONTRATO_APROVADO_ID,
  },
  {
    id: "tx-002",
    data: "2026-07-18T11:00:00.000Z",
    empresaNome: "Urban Style",
    valor: 3500,
    statusPagamento: "retido",
    contratoId: CONTRATO_AJUSTE_ID,
  },
  {
    id: "tx-003",
    data: "2026-07-19T10:00:00.000Z",
    empresaNome: "Nexa Solutions",
    valor: 2800,
    statusPagamento: "retido",
    contratoId: CONTRATO_ENTREGUE_ID,
  },
  {
    id: "tx-004",
    data: "2026-07-08T11:00:00.000Z",
    empresaNome: "Nexa Solutions",
    valor: 4200,
    statusPagamento: "retido",
    contratoId: CONTRATO_CNPJ_ID,
  },
  {
    id: "tx-005",
    data: "2026-07-11T14:30:00.000Z",
    empresaNome: "Glow Cosmetics",
    valor: 8500,
    statusPagamento: "retido",
    contratoId: CONTRATO_CPF_ID,
  },
  {
    id: "tx-006",
    data: "2026-06-28T16:45:00.000Z",
    empresaNome: "Sabor & Arte",
    valor: 5400,
    statusPagamento: "liberado",
    contratoId: "ctr-mock-003",
  },
  {
    id: "tx-007",
    data: "2026-06-22T10:20:00.000Z",
    empresaNome: "Pixel Games",
    valor: 2800,
    statusPagamento: "liberado",
    contratoId: "ctr-mock-004",
  },
  {
    id: "tx-008",
    data: "2026-06-15T13:00:00.000Z",
    empresaNome: "InvestFácil",
    valor: 6100,
    statusPagamento: "liberado",
    contratoId: "ctr-mock-005",
  },
];

export const INDICADORES_FORMATO_MOCK: FormatoDemandaIndicador[] = [
  { formato: "reels", percentual: 42, rotulo: "Reels" },
  { formato: "stories", percentual: 28, rotulo: "Stories" },
  { formato: "post_feed", percentual: 15, rotulo: "Post feed" },
  { formato: "unboxing", percentual: 10, rotulo: "Unboxing" },
  { formato: "live", percentual: 5, rotulo: "Live" },
];

export const RECOMENDACOES_FINANCEIRAS_MOCK: RecomendacaoFinanceira[] = [
  {
    id: "rec-001",
    titulo: "Reels convertem mais",
    descricao:
      "Seus Reels convertem cerca de 30% mais que Stories nas campanhas fechadas — considere ajustar seus pacotes para priorizar esse formato.",
  },
  {
    id: "rec-002",
    titulo: "Ticket médio em alta",
    descricao:
      "Seu ticket médio subiu 12% nos últimos 3 meses. Vale testar um pacote premium combinando Reels + Stories para marcas de beleza.",
  },
  {
    id: "rec-003",
    titulo: "Demanda por unboxing",
    descricao:
      "Unboxing cresceu 18% nas buscas da plataforma no seu nicho. Se você tem equipamento de qualidade, destaque isso no perfil.",
  },
];

export const FORMATO_MAIS_REQUISITADO: TipoServico = "reels";
