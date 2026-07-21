import type { Demanda, Match } from "@/lib/types";

import { demandaVisivelNaBusca } from "@/lib/demandas/utils";
import { INFLUENCIADOR_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import {
  influenciadorAtivoEmListagens,
  INFLUENCIADOR_SUSPENSO_MOCK_ID,
} from "@/lib/mock-data/influenciadores-status";

/** Item do feed combinando demanda, match e metadados de exibição. */
export type DemandaFeedItem = {
  demanda: Demanda;
  match: Match;
  empresaNome: string;
  empresaVerificada: boolean;
  publicadoEm: string;
};

export const DEMANDAS_FEED_MOCK: DemandaFeedItem[] = [
  {
    demanda: {
      id: "dem-001",
      empresaId: "emp-plat-001",
      titulo: "Lançamento linha skincare verão",
      briefing:
        "Buscamos influenciador(a) de beleza para apresentar nossa nova linha de séruns com vitamina C. O conteúdo deve destacar rotina matinal, textura do produto e resultado em 7 dias. Preferência por tom autêntico, sem roteiro engessado.",
      orcamento: 8500,
      formatoEntrega: "reels",
      prazo: "2026-08-15",
      status: "aberta",
    },
    match: {
      id: "match-001",
      demandaId: "dem-001",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      score: 97,
      status: "sugerido",
    },
    empresaNome: "Glow Cosmetics",
    empresaVerificada: true,
    publicadoEm: "2026-07-08T10:00:00.000Z",
  },
  {
    demanda: {
      id: "dem-002",
      empresaId: "emp-plat-006",
      titulo: "Review app de produtividade",
      briefing:
        "Queremos um reels mostrando o app em uso no dia a dia: organização de tarefas, integração com calendário e dica de produtividade. Público jovem profissional, 22-35 anos.",
      orcamento: 4200,
      formatoEntrega: "reels",
      prazo: "2026-08-01",
      status: "em_negociacao",
    },
    match: {
      id: "match-002",
      demandaId: "dem-002",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      score: 91,
      status: "sugerido",
    },
    empresaNome: "Nexa Solutions",
    empresaVerificada: true,
    publicadoEm: "2026-07-07T14:30:00.000Z",
  },
  {
    demanda: {
      id: "dem-003",
      empresaId: "emp-plat-005",
      titulo: "Receita rápida com linha premium",
      briefing:
        "Campanha de culinária: preparar uma receita de 15 minutos usando nossos molhos gourmet. Mostrar ingredientes, preparo e prato final. Stories com enquete sobre sabor.",
      orcamento: 6000,
      formatoEntrega: "stories",
      prazo: "2026-07-28",
      status: "em_andamento",
    },
    match: {
      id: "match-003",
      demandaId: "dem-003",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      score: 88,
      status: "sugerido",
    },
    empresaNome: "Sabor & Arte",
    empresaVerificada: true,
    publicadoEm: "2026-07-06T09:00:00.000Z",
  },
  {
    demanda: {
      id: "dem-004",
      empresaId: "emp-plat-007",
      titulo: "Desafio fitness 21 dias",
      briefing:
        "Divulgar nosso programa de treinos em casa. Mostrar um treino completo de 20 minutos, mencionar app gratuito por 7 dias e código de desconto exclusivo para seguidores.",
      orcamento: 7200,
      formatoEntrega: "reels",
      prazo: "2026-08-10",
      status: "aberta",
    },
    match: {
      id: "match-004",
      demandaId: "dem-004",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      score: 84,
      status: "sugerido",
    },
    empresaNome: "Vida Ativa",
    empresaVerificada: true,
    publicadoEm: "2026-07-05T16:45:00.000Z",
  },
  {
    demanda: {
      id: "dem-005",
      empresaId: "emp-plat-004",
      titulo: "Coleção outono — look do dia",
      briefing:
        "Post feed estilo lookbook com 3 peças da coleção outono/inverno. Legenda destacando versatilidade e link para a loja. Estética clean, fundo neutro.",
      orcamento: 3800,
      formatoEntrega: "post_feed",
      prazo: "2026-07-25",
      status: "aberta",
    },
    match: {
      id: "match-005",
      demandaId: "dem-005",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      score: 79,
      status: "sugerido",
    },
    empresaNome: "Urban Style",
    empresaVerificada: true,
    publicadoEm: "2026-07-04T11:20:00.000Z",
  },
  {
    demanda: {
      id: "dem-006",
      empresaId: "emp-plat-008",
      titulo: "Unboxing kit pet premium",
      briefing:
        "Abrir e apresentar nosso kit mensal para cães: brinquedos, petiscos naturais e bandana. Mostrar reação do pet (se tiver) e destacar sustentabilidade da embalagem.",
      orcamento: 2900,
      formatoEntrega: "unboxing",
      prazo: "2026-07-30",
      status: "aberta",
    },
    match: {
      id: "match-006",
      demandaId: "dem-006",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      score: 76,
      status: "sugerido",
    },
    empresaNome: "PetLove",
    empresaVerificada: true,
    publicadoEm: "2026-07-03T08:15:00.000Z",
  },
  {
    demanda: {
      id: "dem-007",
      empresaId: "emp-plat-003",
      titulo: "Educação financeira para iniciantes",
      briefing:
        "Live de 30 minutos explicando conceitos básicos: reserva de emergência, CDB e diversificação. Formato didático, com espaço para perguntas dos seguidores.",
      orcamento: 9500,
      formatoEntrega: "live",
      prazo: "2026-08-20",
      status: "aberta",
    },
    match: {
      id: "match-007",
      demandaId: "dem-007",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      score: 72,
      status: "sugerido",
    },
    empresaNome: "InvestFácil",
    empresaVerificada: true,
    publicadoEm: "2026-07-02T13:00:00.000Z",
  },
  {
    demanda: {
      id: "dem-008",
      empresaId: "emp-plat-002",
      titulo: "Gameplay indie game launch",
      briefing:
        "Gravar 60s de gameplay do nosso novo jogo mobile puzzle. Destacar mecânica única, gráficos e CTA para download. Público gamer casual.",
      orcamento: 5100,
      formatoEntrega: "reels",
      prazo: "2026-08-05",
      status: "aberta",
    },
    match: {
      id: "match-008",
      demandaId: "dem-008",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      score: 68,
      status: "sugerido",
    },
    empresaNome: "Pixel Games",
    empresaVerificada: true,
    publicadoEm: "2026-07-01T17:30:00.000Z",
  },
  {
    demanda: {
      id: "dem-009",
      empresaId: "emp-plat-009",
      titulo: "Dicas de consumo consciente",
      briefing:
        "Stories em sequência (5 frames) sobre hábitos sustentáveis no dia a dia: redução de plástico, reciclagem e nossos produtos eco-friendly.",
      orcamento: 2400,
      formatoEntrega: "stories",
      prazo: "2026-07-22",
      status: "aberta",
    },
    match: {
      id: "match-009",
      demandaId: "dem-009",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      score: 63,
      status: "sugerido",
    },
    empresaNome: "EcoVerde",
    empresaVerificada: true,
    publicadoEm: "2026-06-30T10:45:00.000Z",
  },
  {
    demanda: {
      id: "dem-010",
      empresaId: "emp-plat-010",
      titulo: "Conteúdo educativo infantil",
      briefing:
        "Reels lúdico apresentando nosso app de matemática para crianças 6-10 anos. Mostrar uma atividade interativa e depoimento de pai/mãe.",
      orcamento: 4500,
      formatoEntrega: "reels",
      prazo: "2026-08-12",
      status: "aberta",
    },
    match: {
      id: "match-010",
      demandaId: "dem-010",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      score: 58,
      status: "sugerido",
    },
    empresaNome: "Mundo Kids",
    empresaVerificada: true,
    publicadoEm: "2026-06-29T15:00:00.000Z",
  },
  {
    demanda: {
      id: "dem-011",
      empresaId: "emp-anon-001",
      titulo: "Campanha institucional B2B",
      briefing:
        "Post feed corporativo sobre inovação em logística. Tom profissional, sem humor. Empresa prefere manter nome reservado até match aceito.",
      orcamento: 3200,
      formatoEntrega: "post_feed",
      prazo: "2026-07-18",
      status: "aberta",
    },
    match: {
      id: "match-011",
      demandaId: "dem-011",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      score: 52,
      status: "sugerido",
    },
    empresaNome: "Empresa verificada",
    empresaVerificada: true,
    publicadoEm: "2026-06-28T12:00:00.000Z",
  },
  {
    demanda: {
      id: "dem-012",
      empresaId: "emp-anon-002",
      titulo: "Promoção sazonal genérica",
      briefing:
        "Stories simples divulgando promoção de fim de temporada. Flexível quanto ao nicho — qualquer criador com engajamento acima de 3% pode se candidatar.",
      orcamento: 1800,
      formatoEntrega: "stories",
      prazo: "2026-07-15",
      status: "aberta",
    },
    match: {
      id: "match-012",
      demandaId: "dem-012",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      score: 45,
      status: "sugerido",
    },
    empresaNome: "Empresa verificada",
    empresaVerificada: true,
    publicadoEm: "2026-06-27T09:30:00.000Z",
  },
  /**
   * Rascunho no mock do feed só para validar exclusão na listagem do influenciador.
   * Não deve aparecer após o filtro por demanda.status (etapa de telas).
   */
  {
    demanda: {
      id: "dem-013",
      empresaId: "emp-plat-011",
      titulo: "Campanha ainda em edição (rascunho)",
      briefing:
        "Demanda não publicada — não deve ser listada para influenciadores.",
      orcamento: 5000,
      formatoEntrega: "reels",
      prazo: "2026-09-30",
      status: "rascunho",
    },
    match: {
      id: "match-013",
      demandaId: "dem-013",
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      score: 40,
      status: "sugerido",
    },
    empresaNome: "Marca Interna",
    empresaVerificada: false,
    publicadoEm: "2026-07-16T12:00:00.000Z",
  },
  /**
   * Match apontando para influenciador suspenso — excluído por listarDemandasFeed.
   */
  {
    demanda: {
      id: "dem-014",
      empresaId: "emp-plat-012",
      titulo: "Campanha com criador suspenso (demo filtro)",
      briefing:
        "Não deve aparecer no feed — influenciador do match não está ativo.",
      orcamento: 3200,
      formatoEntrega: "stories",
      prazo: "2026-08-20",
      status: "aberta",
    },
    match: {
      id: "match-014",
      demandaId: "dem-014",
      influenciadorId: INFLUENCIADOR_SUSPENSO_MOCK_ID,
      score: 70,
      status: "sugerido",
    },
    empresaNome: "Filtro Demo Co.",
    empresaVerificada: true,
    publicadoEm: "2026-07-16T13:00:00.000Z",
  },
];

/**
 * Origem do feed do influenciador: só inclui matches cujo influenciador está ativo
 * e demandas elegíveis à busca (exclui rascunho).
 * Telas devem consumir esta função, não o array bruto.
 */
export function listarDemandasFeed(): DemandaFeedItem[] {
  return DEMANDAS_FEED_MOCK.filter(
    (item) =>
      demandaVisivelNaBusca(item.demanda.status) &&
      influenciadorAtivoEmListagens(item.match.influenciadorId),
  );
}

/** Busca no feed por id da demanda (apenas itens elegíveis). */
export function obterDemandaFeedPorId(
  demandaId: string,
): DemandaFeedItem | undefined {
  return listarDemandasFeed().find((item) => item.demanda.id === demandaId);
}

export const ORCAMENTO_MIN_MOCK = 1500;
export const ORCAMENTO_MAX_MOCK = 10000;
