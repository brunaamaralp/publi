import type { Mensagem } from "@/lib/types";

import { obterMatchConvite } from "@/lib/empresa/convite-match";
import {
  EMPRESA_MOCK_ID,
  INFLUENCIADOR_MOCK_ID,
} from "@/lib/mock-data/avaliacoes";
import { DEMANDAS_FEED_MOCK } from "@/lib/mock-data/demandas";
import {
  INFLUENCIADOR_SUSPENSO_MOCK_ID,
  INFLUENCIADOR_SUSPENSO_USUARIO_ID,
} from "@/lib/mock-data/influenciadores-status";
import {
  EMPRESA_NEGOCIACAO_USUARIO_ID,
  INFLUENCIADOR_NEGOCIACAO_USUARIO_ID,
  TAXA_DESBLOQUEIO_PADRAO,
} from "@/lib/negociacao/negociacao-constantes";
import type { NegociacaoContexto } from "@/lib/negociacao/negociacao-types";

export {
  EMPRESA_NEGOCIACAO_USUARIO_ID,
  INFLUENCIADOR_NEGOCIACAO_USUARIO_ID,
  TAXA_DESBLOQUEIO_PADRAO,
} from "@/lib/negociacao/negociacao-constantes";

const CONTEXTO_MATCH_001: NegociacaoContexto = {
  match: {
    id: "match-001",
    demandaId: "dem-001",
    influenciadorId: INFLUENCIADOR_MOCK_ID,
    score: 97,
    status: "aceito",
  },
  demanda: DEMANDAS_FEED_MOCK[0]!.demanda,
  influenciador: {
    id: INFLUENCIADOR_MOCK_ID,
    nome: "Ana Beatriz Silva",
    nicho: "Beleza e skincare",
    seguidores: 128000,
    engajamentoMedio: 4.8,
    notaMedia: 4.9,
    totalAvaliacoes: 23,
  },
  empresa: {
    id: EMPRESA_MOCK_ID,
    nome: "Glow Cosmetics",
    usuarioId: EMPRESA_NEGOCIACAO_USUARIO_ID,
  },
  influenciadorUsuarioId: INFLUENCIADOR_NEGOCIACAO_USUARIO_ID,
  taxaDesbloqueio: TAXA_DESBLOQUEIO_PADRAO,
};

const CONTEXTO_MATCH_002: NegociacaoContexto = {
  match: DEMANDAS_FEED_MOCK[1]!.match,
  demanda: DEMANDAS_FEED_MOCK[1]!.demanda,
  influenciador: {
    id: INFLUENCIADOR_MOCK_ID,
    nome: "Ana Beatriz Silva",
    nicho: "Tech e produtividade",
    seguidores: 128000,
    engajamentoMedio: 4.8,
    notaMedia: 4.9,
    totalAvaliacoes: 23,
  },
  empresa: {
    id: "emp-plat-006",
    nome: "Nexa Solutions",
    usuarioId: EMPRESA_NEGOCIACAO_USUARIO_ID,
  },
  influenciadorUsuarioId: INFLUENCIADOR_NEGOCIACAO_USUARIO_ID,
  taxaDesbloqueio: TAXA_DESBLOQUEIO_PADRAO,
};

/** Match com influenciador suspenso — filtrado em listarMatchesPorDemanda. */
const CONTEXTO_MATCH_SUSPENSO: NegociacaoContexto = {
  match: {
    id: "match-suspenso",
    demandaId: "dem-001",
    influenciadorId: INFLUENCIADOR_SUSPENSO_MOCK_ID,
    score: 85,
    status: "sugerido",
  },
  demanda: DEMANDAS_FEED_MOCK[0]!.demanda,
  influenciador: {
    id: INFLUENCIADOR_SUSPENSO_MOCK_ID,
    nome: "Criador Suspenso (demo)",
    nicho: "Lifestyle",
    seguidores: 50000,
    engajamentoMedio: 3.2,
    notaMedia: 4.0,
    totalAvaliacoes: 8,
  },
  empresa: {
    id: EMPRESA_MOCK_ID,
    nome: "Glow Cosmetics",
    usuarioId: EMPRESA_NEGOCIACAO_USUARIO_ID,
  },
  influenciadorUsuarioId: INFLUENCIADOR_SUSPENSO_USUARIO_ID,
  taxaDesbloqueio: TAXA_DESBLOQUEIO_PADRAO,
};

export const NEGOCIACAO_CONTEXTOS: Record<string, NegociacaoContexto> = {
  "match-001": CONTEXTO_MATCH_001,
  "match-002": CONTEXTO_MATCH_002,
  "match-suspenso": CONTEXTO_MATCH_SUSPENSO,
};

export function getNegociacaoContexto(
  matchId: string,
): NegociacaoContexto | null {
  return NEGOCIACAO_CONTEXTOS[matchId] ?? obterMatchConvite(matchId);
}

export function criarMensagensIniciais(
  conversaId: string,
  ctx: NegociacaoContexto,
): Mensagem[] {
  const { empresa, influenciadorUsuarioId } = ctx;

  return [
    {
      id: "msg-001",
      conversaId,
      remetenteId: empresa.usuarioId,
      texto:
        "Olá! Gostamos muito do seu perfil para a campanha de skincare. Podemos conversar sobre os detalhes?",
      enviadoEm: "2026-07-10T10:05:00.000Z",
      flagContatoExterno: "nenhum",
    },
    {
      id: "msg-002",
      conversaId,
      remetenteId: influenciadorUsuarioId,
      texto:
        "Oi! Fico feliz com o interesse. Pode me contar mais sobre as entregas esperadas?",
      enviadoEm: "2026-07-10T10:12:00.000Z",
      flagContatoExterno: "nenhum",
    },
    {
      id: "msg-003",
      conversaId,
      remetenteId: empresa.usuarioId,
      texto:
        "Seria 1 reels + 2 stories, com roteiro livre dentro das orientações que enviamos na demanda.",
      enviadoEm: "2026-07-10T10:18:00.000Z",
      flagContatoExterno: "nenhum",
    },
    {
      id: "msg-004",
      conversaId,
      remetenteId: influenciadorUsuarioId,
      texto:
        "Perfeito! O prazo de agosto funciona bem para mim. Vocês já têm referências visuais?",
      enviadoEm: "2026-07-10T10:25:00.000Z",
      flagContatoExterno: "nenhum",
    },
    {
      id: "msg-005",
      conversaId,
      remetenteId: empresa.usuarioId,
      texto:
        "Sim, podemos compartilhar um moodboard depois que fecharmos o contrato pela plataforma.",
      enviadoEm: "2026-07-10T10:31:00.000Z",
      flagContatoExterno: "nenhum",
    },
    {
      id: "msg-006",
      conversaId,
      remetenteId: influenciadorUsuarioId,
      texto:
        "Combinado! Se precisar alinhar algum detalhe rápido, me chama no zap depois.",
      enviadoEm: "2026-07-10T10:38:00.000Z",
      flagContatoExterno: "alerta_termo",
    },
    {
      id: "msg-007",
      conversaId,
      remetenteId: empresa.usuarioId,
      texto:
        "Vamos manter tudo por aqui para registrar a negociação. Podemos seguir com o contrato?",
      enviadoEm: "2026-07-10T10:42:00.000Z",
      flagContatoExterno: "nenhum",
    },
    {
      id: "msg-008",
      conversaId,
      remetenteId: influenciadorUsuarioId,
      texto:
        "Claro! Estou de acordo. Me envie a proposta formal que reviso e assino.",
      enviadoEm: "2026-07-10T10:48:00.000Z",
      flagContatoExterno: "nenhum",
    },
  ];
}
