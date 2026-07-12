import {
  EMPRESA_MOCK_ID,
  INFLUENCIADOR_MOCK_ID,
} from "@/lib/mock-data/avaliacoes";
import {
  EMPRESA_NEGOCIACAO_USUARIO_ID,
  INFLUENCIADOR_NEGOCIACAO_USUARIO_ID,
} from "@/lib/mock-data/negociacao";
import { DEMANDAS_FEED_MOCK } from "@/lib/mock-data/demandas";
import type { ContratoPagamentoContexto } from "@/lib/pagamento/pagamento-types";

/** Contrato assinado — influenciador CPF (dispara fluxo de RPA). */
export const CONTRATO_CPF_ID = "ctr-cpf-001";

/** Contrato assinado — influenciador CNPJ (sem etapa de RPA). */
export const CONTRATO_CNPJ_ID = "ctr-cnpj-001";

const CONTRATO_CPF: ContratoPagamentoContexto = {
  contrato: {
    id: CONTRATO_CPF_ID,
    matchId: "match-001",
    valor: 8500,
    escopo:
      "Buscamos influenciador(a) de beleza para apresentar nossa nova linha de séruns com vitamina C. O conteúdo deve destacar rotina matinal, textura do produto e resultado em 7 dias. Entregas: 1 reels + 2 stories.",
    prazoEntrega: "2026-08-15",
    status: "assinado",
    dataAssinatura: "2026-07-12T10:00:00.000Z",
  },
  empresa: {
    id: EMPRESA_MOCK_ID,
    nome: "Glow Cosmetics",
    usuarioId: EMPRESA_NEGOCIACAO_USUARIO_ID,
  },
  influenciador: {
    id: INFLUENCIADOR_MOCK_ID,
    nome: "Ana Beatriz Silva",
    usuarioId: INFLUENCIADOR_NEGOCIACAO_USUARIO_ID,
    documentoTipo: "cpf",
  },
  demandaTitulo: DEMANDAS_FEED_MOCK[0]!.demanda.titulo,
};

const CONTRATO_CNPJ: ContratoPagamentoContexto = {
  contrato: {
    id: CONTRATO_CNPJ_ID,
    matchId: "match-002",
    valor: 4200,
    escopo:
      "Reels mostrando o app em uso no dia a dia: organização de tarefas, integração com calendário e dica de produtividade. Público jovem profissional, 22-35 anos.",
    prazoEntrega: "2026-08-01",
    status: "assinado",
    dataAssinatura: "2026-07-11T14:00:00.000Z",
  },
  empresa: {
    id: "emp-plat-006",
    nome: "Nexa Solutions",
    usuarioId: EMPRESA_NEGOCIACAO_USUARIO_ID,
  },
  influenciador: {
    id: "inf-cnpj-001",
    nome: "Marcos Tech Creator",
    usuarioId: "usr-influ-cnpj-001",
    documentoTipo: "cnpj",
  },
  demandaTitulo: DEMANDAS_FEED_MOCK[1]!.demanda.titulo,
};

export const CONTRATOS_PAGAMENTO_MOCK: Record<
  string,
  ContratoPagamentoContexto
> = {
  [CONTRATO_CPF_ID]: CONTRATO_CPF,
  [CONTRATO_CNPJ_ID]: CONTRATO_CNPJ,
};

export const MUNICIPIOS_MOCK = [
  "São Paulo — SP",
  "Rio de Janeiro — RJ",
  "Belo Horizonte — MG",
  "Curitiba — PR",
  "Porto Alegre — RS",
] as const;

export function getContratoPagamentoContexto(
  contratoId: string,
): ContratoPagamentoContexto | null {
  return CONTRATOS_PAGAMENTO_MOCK[contratoId] ?? null;
}
