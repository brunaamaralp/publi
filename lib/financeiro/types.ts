import type { Demanda, Pagamento } from "@/lib/types";
import type { TipoServico } from "@/lib/influenciador/cadastro-utils";

/** Status exibidos no ledger financeiro (alinhado ao escrow). */
export type StatusPagamentoFinanceiro =
  | Pagamento["status"]
  | "em_disputa"
  | "aguardando_deposito";

export type ReceitaMensal = {
  mesLabel: string;
  mesAno: string;
  receita: number;
};

export type TransacaoFinanceira = {
  id: string;
  data: string;
  empresaNome: string;
  valor: number;
  statusPagamento: StatusPagamentoFinanceiro;
  contratoId: string;
  demandaTitulo?: string;
};

export type FormatoDemandaIndicador = {
  formato: Demanda["formatoEntrega"];
  percentual: number;
  rotulo: string;
};

export type RecomendacaoFinanceira = {
  id: string;
  titulo: string;
  descricao: string;
};

export type ResumoFinanceiro = {
  ganhosMesAtual: number;
  variacaoMesAnterior: number;
  contratosConcluidosMes: number;
  ticketMedio: number;
  /** Estimativa simples mantendo o ritmo do mês atual. */
  projecaoMes?: number;
};

export type ProximaLiberacao = {
  id: string;
  contratoId: string;
  empresaNome: string;
  demandaTitulo: string;
  valor: number;
  prazoLiberacaoAutomatica: string;
  diasUteisRestantes: number;
};

export type PainelFinanceiroInfluenciador = {
  resumo: ResumoFinanceiro;
  receitaMensal: ReceitaMensal[];
  transacoes: TransacaoFinanceira[];
  proximasLiberacoes: ProximaLiberacao[];
};

/** KPI do painel financeiro da empresa (visão de gasto / escrow). */
export type ResumoFinanceiroEmpresaPainel = {
  investidoMes: number;
  retido: number;
  liberadoMes: number;
  ticketMedio: number;
  contratosAtivos: number;
  variacaoMesAnterior: number;
};

export type TransacaoFinanceiraEmpresa = {
  id: string;
  data: string;
  influenciadorNome: string;
  demandaTitulo: string;
  valor: number;
  statusPagamento: StatusPagamentoFinanceiro;
  contratoId: string;
};

/** Série mensal de investimento (mesmo shape do gráfico de receita). */
export type GastoMensal = ReceitaMensal;

export type PainelFinanceiroEmpresa = {
  resumo: ResumoFinanceiroEmpresaPainel;
  gastoMensal: GastoMensal[];
  transacoes: TransacaoFinanceiraEmpresa[];
};

export type ResumoFinanceiroClienteAgencia = {
  empresaId: string;
  nome: string;
  investidoMes: number;
  retido: number;
  liberadoMes: number;
  contratosAtivos: number;
  pendencias: number;
};

export type EscopoFinanceiroAgencia = "cliente" | "todos";

export type PainelFinanceiroAgencia = {
  escopo: EscopoFinanceiroAgencia;
  painel: PainelFinanceiroEmpresa;
  porCliente: ResumoFinanceiroClienteAgencia[];
};

export type { TipoServico };
