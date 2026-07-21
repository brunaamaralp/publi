import { EMPRESA_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import type { MinhaDemandaItem } from "@/lib/empresa/demandas-types";

/** Demandas de exemplo para a listagem "Minhas demandas" (empresa direta). */
export const MINHAS_DEMANDAS_MOCK: MinhaDemandaItem[] = [
  {
    demanda: {
      id: "minha-dem-001",
      empresaId: EMPRESA_MOCK_ID,
      titulo: "Campanha de lançamento — linha fitness",
      briefing:
        "Buscamos influenciador(a) de lifestyle fitness para apresentar nossa nova linha de suplementos. Conteúdo em tom motivacional, mostrando rotina de treino e uso do produto no pós-treino.",
      orcamento: 12000,
      nichoId: "cat-fitness",
      formatoEntrega: "reels",
      prazo: "2026-08-20",
      status: "aberta",
    },
    publicoAlvo: [
      { dimensao: "genero", valor: "Feminino" },
      { dimensao: "faixa_etaria", valor: "25-34" },
      { dimensao: "localidade", valor: "São Paulo" },
    ],
    matchesGerados: 2,
    publicadoEm: "2026-07-10T09:00:00.000Z",
  },
  {
    demanda: {
      id: "minha-dem-002",
      empresaId: EMPRESA_MOCK_ID,
      titulo: "Stories — bastidores da fábrica",
      briefing:
        "Série de stories mostrando o processo de produção sustentável dos nossos produtos. Tom transparente e educativo, com enquetes sobre preferências do público.",
      orcamento: 5500,
      nichoId: "cat-sustentabilidade",
      formatoEntrega: "stories",
      prazo: "2026-07-30",
      status: "em_negociacao",
    },
    publicoAlvo: [
      { dimensao: "genero", valor: "Todos" },
      { dimensao: "faixa_etaria", valor: "18-44" },
    ],
    matchesGerados: 1,
    publicadoEm: "2026-07-05T14:00:00.000Z",
  },
  {
    demanda: {
      id: "minha-dem-003",
      empresaId: EMPRESA_MOCK_ID,
      titulo: "Unboxing kit presente Dia das Mães",
      briefing:
        "Vídeo de unboxing do kit especial com reação autêntica e destaque para os itens principais. Incluir menção ao cupom exclusivo para seguidores.",
      orcamento: 3800,
      nichoId: "cat-maternidade",
      formatoEntrega: "unboxing",
      prazo: "2026-05-10",
      status: "fechada",
    },
    publicoAlvo: [
      { dimensao: "genero", valor: "Feminino" },
      { dimensao: "localidade", valor: "Brasil" },
    ],
    matchesGerados: 1,
    publicadoEm: "2026-04-12T11:30:00.000Z",
  },
  {
    demanda: {
      id: "minha-dem-004",
      empresaId: EMPRESA_MOCK_ID,
      titulo: "Live de perguntas e respostas com a marca",
      briefing:
        "Live de 30 minutos para tirar dúvidas sobre nossos produtos e lançar novidade. Interação com chat e sorteio ao final.",
      orcamento: 9000,
      nichoId: "cat-empreendedorismo",
      formatoEntrega: "live",
      prazo: "2026-06-15",
      status: "cancelada",
    },
    publicoAlvo: [{ dimensao: "faixa_etaria", valor: "25-44" }],
    matchesGerados: 0,
    publicadoEm: "2026-05-20T16:00:00.000Z",
  },
  {
    demanda: {
      id: "minha-dem-005",
      empresaId: EMPRESA_MOCK_ID,
      titulo: "Post feed — coleção outono/inverno",
      briefing:
        "Carrossel no feed apresentando 3 looks da nova coleção. Fotos em ambiente urbano, estilo editorial casual.",
      orcamento: 7200,
      nichoId: "cat-moda",
      formatoEntrega: "post_feed",
      prazo: "2026-09-01",
      status: "em_andamento",
    },
    publicoAlvo: [
      { dimensao: "genero", valor: "Feminino" },
      { dimensao: "faixa_etaria", valor: "18-28" },
      { dimensao: "localidade", valor: "Rio de Janeiro" },
    ],
    matchesGerados: 1,
    publicadoEm: "2026-07-11T08:45:00.000Z",
  },
  {
    demanda: {
      id: "minha-dem-006",
      empresaId: EMPRESA_MOCK_ID,
      titulo: "Reels — rotina matinal com café",
      briefing:
        "Rascunho: reels de 30s mostrando o ritual matinal com nossa linha de cafés especiais. Tom acolhedor, luz natural.",
      orcamento: 4500,
      nichoId: "cat-culinaria",
      formatoEntrega: "reels",
      prazo: "2026-09-15",
      status: "rascunho",
    },
    publicoAlvo: [
      { dimensao: "genero", valor: "Todos" },
      { dimensao: "faixa_etaria", valor: "25-40" },
    ],
    matchesGerados: 0,
    publicadoEm: "2026-07-16T10:00:00.000Z",
  },
];
