import type { ResultadoCampanha } from "@/lib/types";

import {
  CONTRATO_CNPJ_ID,
  CONTRATO_CPF_ID,
} from "@/lib/mock-data/contratos-pagamento";
import {
  EMPRESA_MOCK_ID,
  INFLUENCIADOR_MOCK_ID,
} from "@/lib/mock-data/avaliacoes";
import { EMPRESA_NEGOCIACAO_USUARIO_ID } from "@/lib/negociacao/negociacao-constantes";

export type ResultadoCampanhaMeta = {
  campanhaTitulo: string;
  empresaId: string;
  empresaNome: string;
  influenciadorId: string;
  influenciadorNome: string;
};

export type ResultadoCampanhaRegistro = {
  resultado: ResultadoCampanha;
  meta: ResultadoCampanhaMeta;
};

export const RESULTADOS_CAMPANHA_MOCK: ResultadoCampanhaRegistro[] = [
  {
    resultado: {
      id: "res-001",
      contratoId: "ctr-mock-003",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      status: "preenchido",
      impressoes: 185000,
      alcance: 142000,
      cliques: 3200,
      engajamentoTotal: 12400,
      taxaEngajamento: 8.73,
      linkComprovante: "https://instagram.com/p/exemplo-campanha-1",
      observacoes: "Pico de engajamento no segundo story da série.",
    },
    meta: {
      campanhaTitulo: "Receita rápida com linha premium",
      empresaId: "emp-plat-005",
      empresaNome: "Sabor & Arte",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      influenciadorNome: "Ana Beatriz Silva",
    },
  },
  {
    resultado: {
      id: "res-002",
      contratoId: "ctr-mock-004",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      solicitadoPorUsuarioId: EMPRESA_NEGOCIACAO_USUARIO_ID,
      status: "validado",
      impressoes: 92000,
      alcance: 78000,
      cliques: 1850,
      engajamentoTotal: 6800,
      taxaEngajamento: 8.72,
      linkComprovante: "https://instagram.com/p/exemplo-campanha-2",
    },
    meta: {
      campanhaTitulo: "Review indie game — lançamento",
      empresaId: "emp-plat-002",
      empresaNome: "Pixel Games",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      influenciadorNome: "Ana Beatriz Silva",
    },
  },
  {
    resultado: {
      id: "res-003",
      contratoId: CONTRATO_CPF_ID,
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      status: "preenchido",
      impressoes: 248000,
      alcance: 195000,
      cliques: 4100,
      engajamentoTotal: 18200,
      taxaEngajamento: 9.33,
      linkComprovante: "https://instagram.com/p/exemplo-skincare",
      observacoes: "Melhor performance no reels principal.",
    },
    meta: {
      campanhaTitulo: "Lançamento linha skincare verão",
      empresaId: EMPRESA_MOCK_ID,
      empresaNome: "Glow Cosmetics",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      influenciadorNome: "Ana Beatriz Silva",
    },
  },
  {
    resultado: {
      id: "res-004",
      contratoId: "ctr-mock-005",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      solicitadoPorUsuarioId: EMPRESA_NEGOCIACAO_USUARIO_ID,
      status: "solicitado",
    },
    meta: {
      campanhaTitulo: "Educação financeira — série stories",
      empresaId: "emp-plat-003",
      empresaNome: "InvestFácil",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      influenciadorNome: "Ana Beatriz Silva",
    },
  },
  {
    resultado: {
      id: "res-005",
      contratoId: "ctr-mock-006",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      status: "nao_solicitado",
    },
    meta: {
      campanhaTitulo: "Coleção outono/inverno — carrossel",
      empresaId: EMPRESA_MOCK_ID,
      empresaNome: "Glow Cosmetics",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      influenciadorNome: "Ana Beatriz Silva",
    },
  },
  {
    resultado: {
      id: "res-006",
      contratoId: CONTRATO_CNPJ_ID,
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      status: "nao_solicitado",
    },
    meta: {
      campanhaTitulo: "Review app de produtividade",
      empresaId: "emp-plat-006",
      empresaNome: "Nexa Solutions",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      influenciadorNome: "Ana Beatriz Silva",
    },
  },
];

export function getResultadoPorContratoId(
  registros: ResultadoCampanhaRegistro[],
  contratoId: string,
): ResultadoCampanhaRegistro | undefined {
  return registros.find((r) => r.resultado.contratoId === contratoId);
}
