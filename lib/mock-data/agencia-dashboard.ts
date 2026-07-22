import type { MinhaDemandaItem } from "@/lib/empresa/demandas-types";
import type { Contrato } from "@/lib/types";
import type { EmpresaClienteVinculada } from "@/lib/contexts/agencia-context";
import { EMPRESAS_PLATAFORMA_MOCK } from "@/lib/mock-data/empresas";
import type { Agencia } from "@/lib/types";

export type ContratoAgenciaResumo = {
  id: string;
  empresaId: string;
  campanhaTitulo: string;
  valor: number;
  status: Contrato["status"];
  dataAssinatura: string;
};

export const AGENCIA_DEMO: Agencia = {
  id: "ag-demo-001",
  usuarioId: "usr-ag-demo",
  razaoSocial: "Pulse Media Agência Digital",
};

const idsClientesDemo = [
  "emp-plat-001",
  "emp-plat-004",
  "emp-plat-005",
  "emp-plat-006",
] as const;

export const EMPRESAS_CLIENTES_DEMO: EmpresaClienteVinculada[] =
  EMPRESAS_PLATAFORMA_MOCK.filter((e) =>
    (idsClientesDemo as readonly string[]).includes(e.id),
  ).map((e) => ({ ...e, criadaPelaAgencia: false }));

/** Demandas mock para empresas-clientes da agência demo. */
export const DEMANDAS_AGENCIA_CLIENTES_MOCK: MinhaDemandaItem[] = [
  {
    demanda: {
      id: "ag-dem-001",
      empresaId: "emp-plat-001",
      titulo: "Lançamento sérum vitamina C",
      briefing: "Reels apresentando rotina matinal com o novo sérum.",
      orcamento: 9500,
      formatoEntrega: "reels",
      prazo: "2026-08-10",
      status: "aberta",
    },
    publicoAlvo: [{ dimensao: "genero", valor: "Feminino" }],
    matchesGerados: 9,
    publicadoEm: "2026-07-08T10:00:00.000Z",
  },
  {
    demanda: {
      id: "ag-dem-002",
      empresaId: "emp-plat-001",
      titulo: "Stories — rotina skincare noturna",
      briefing: "Série de 4 stories com passo a passo da rotina.",
      orcamento: 4200,
      formatoEntrega: "stories",
      prazo: "2026-07-28",
      status: "em_negociacao",
    },
    publicoAlvo: [{ dimensao: "faixa_etaria", valor: "18-34" }],
    matchesGerados: 5,
    publicadoEm: "2026-07-05T14:30:00.000Z",
  },
  {
    demanda: {
      id: "ag-dem-003",
      empresaId: "emp-plat-001",
      titulo: "Post feed — coleção verão",
      briefing: "Carrossel com 3 looks usando a linha verão.",
      orcamento: 6800,
      formatoEntrega: "post_feed",
      prazo: "2026-09-01",
      status: "aberta",
    },
    publicoAlvo: [{ dimensao: "localidade", valor: "São Paulo" }],
    matchesGerados: 12,
    publicadoEm: "2026-07-11T09:15:00.000Z",
  },
  {
    demanda: {
      id: "ag-dem-004",
      empresaId: "emp-plat-004",
      titulo: "Lookbook outono/inverno",
      briefing: "Reels estilo editorial com peças da nova coleção.",
      orcamento: 11000,
      formatoEntrega: "reels",
      prazo: "2026-08-25",
      status: "aberta",
    },
    publicoAlvo: [{ dimensao: "genero", valor: "Feminino" }],
    matchesGerados: 7,
    publicadoEm: "2026-07-09T11:00:00.000Z",
  },
  {
    demanda: {
      id: "ag-dem-005",
      empresaId: "emp-plat-005",
      titulo: "Receita com linha premium",
      briefing: "Vídeo de receita rápida usando produtos da marca.",
      orcamento: 7500,
      formatoEntrega: "reels",
      prazo: "2026-08-05",
      status: "em_negociacao",
    },
    publicoAlvo: [{ dimensao: "faixa_etaria", valor: "25-44" }],
    matchesGerados: 11,
    publicadoEm: "2026-07-06T16:20:00.000Z",
  },
  {
    demanda: {
      id: "ag-dem-006",
      empresaId: "emp-plat-005",
      titulo: "Bastidores da fábrica",
      briefing: "Stories mostrando processo de produção sustentável.",
      orcamento: 3800,
      formatoEntrega: "stories",
      prazo: "2026-06-20",
      status: "fechada",
    },
    publicoAlvo: [{ dimensao: "localidade", valor: "Brasil" }],
    matchesGerados: 18,
    publicadoEm: "2026-05-15T08:00:00.000Z",
  },
  {
    demanda: {
      id: "ag-dem-007",
      empresaId: "emp-plat-006",
      titulo: "Demo do app de produtividade",
      briefing: "Reels mostrando fluxo diário com o app.",
      orcamento: 4200,
      formatoEntrega: "reels",
      prazo: "2026-08-01",
      status: "em_negociacao",
    },
    publicoAlvo: [{ dimensao: "faixa_etaria", valor: "22-35" }],
    matchesGerados: 6,
    publicadoEm: "2026-07-10T13:45:00.000Z",
  },
  {
    demanda: {
      id: "ag-dem-008",
      empresaId: "emp-plat-006",
      titulo: "Live Q&A sobre integrações",
      briefing: "Live de 30 min com perguntas do público.",
      orcamento: 9000,
      formatoEntrega: "live",
      prazo: "2026-08-18",
      status: "aberta",
    },
    publicoAlvo: [{ dimensao: "genero", valor: "Todos" }],
    matchesGerados: 3,
    publicadoEm: "2026-07-11T07:30:00.000Z",
  },
];

export const CONTRATOS_AGENCIA_MOCK: ContratoAgenciaResumo[] = [
  {
    id: "ctr-ag-001",
    empresaId: "emp-plat-001",
    campanhaTitulo: "Campanha hidratante facial",
    valor: 6200,
    status: "em_andamento",
    dataAssinatura: "2026-07-03T10:00:00.000Z",
  },
  {
    id: "ctr-cnpj-001",
    empresaId: "emp-plat-006",
    campanhaTitulo: "Demo do app de produtividade",
    valor: 4200,
    status: "assinado",
    dataAssinatura: "2026-07-11T14:00:00.000Z",
  },
  {
    id: "ctr-ag-003",
    empresaId: "emp-plat-005",
    campanhaTitulo: "Receita com linha premium",
    valor: 7500,
    status: "em_andamento",
    dataAssinatura: "2026-07-08T09:30:00.000Z",
  },
  {
    id: "ctr-ag-004",
    empresaId: "emp-plat-004",
    campanhaTitulo: "Coleção primavera — unboxing",
    valor: 5400,
    status: "assinado",
    dataAssinatura: "2026-06-28T15:00:00.000Z",
  },
];
