import { isoDiasAPartirDeHoje } from "@/lib/influenciador/agenda-utils";
import { nomeNicho } from "@/lib/empresa/orcamento-nicho";
import {
  carregarPortfolioPorId,
  salvarPortfolio,
} from "@/lib/influenciador/portfolio-storage";
import type { PortfolioInfluenciador } from "@/lib/influenciador/portfolio-types";
import {
  EMPRESA_MOCK_ID,
  INFLUENCIADOR_MOCK_ID,
} from "@/lib/mock-data/avaliacoes";
import {
  EMPRESA_NEGOCIACAO_USUARIO_ID,
  TAXA_DESBLOQUEIO_PADRAO,
} from "@/lib/negociacao/negociacao-constantes";
import type {
  NegociacaoContexto,
  NegociacaoEstado,
} from "@/lib/negociacao/negociacao-types";
import { registrarContextoPagamentoDireto } from "@/lib/pagamento/contrato-pagamento-registro";
import type { Contrato, LogisticaContrato, PacoteServico } from "@/lib/types";
import { camposCicloEntregaIniciais } from "@/lib/types/contrato";
import type { Demanda, Match } from "@/lib/types";

export type TermosContratacao = {
  escopo: string;
  valor: number;
  dataAgendada: string;
  pacoteId?: string;
  pacoteNome?: string;
  instrucoesAdicionais?: string;
  logistica?: LogisticaContrato;
  origem: Contrato["origem"];
};

function novoId(prefixo: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefixo}-${crypto.randomUUID()}`;
  }
  return `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const CHAT_PORTFOLIO_PREFIX = "negociacao-estado-";
const MATCH_PORTFOLIO_PREFIX = "match-port-";

export function matchIdPortfolio(
  influenciadorId: string,
  empresaUsuarioId: string,
): string {
  return `${MATCH_PORTFOLIO_PREFIX}${influenciadorId}-${empresaUsuarioId}`;
}

/**
 * Ocupa a data na agenda do portfólio (localStorage).
 * Idempotente se a data já estiver na lista.
 */
export function ocuparDataAgenda(
  influenciadorId: string,
  dataIso: string,
): PortfolioInfluenciador | null {
  const portfolio = carregarPortfolioPorId(influenciadorId);
  if (!portfolio) return null;

  const atual = portfolio.disponibilidade ?? { diasSemana: [] };
  const datas = new Set(atual.datasIndisponiveis ?? []);
  datas.add(dataIso);

  const next: PortfolioInfluenciador = {
    ...portfolio,
    disponibilidade: {
      ...atual,
      datasIndisponiveis: Array.from(datas).sort(),
    },
  };
  salvarPortfolio(next);
  return next;
}

/** Libera a data se o contrato for cancelado. */
export function liberarDataAgenda(
  influenciadorId: string,
  dataIso: string,
): PortfolioInfluenciador | null {
  const portfolio = carregarPortfolioPorId(influenciadorId);
  if (!portfolio?.disponibilidade?.datasIndisponiveis) return portfolio;

  const datas = portfolio.disponibilidade.datasIndisponiveis.filter(
    (d) => d !== dataIso,
  );
  const next: PortfolioInfluenciador = {
    ...portfolio,
    disponibilidade: {
      ...portfolio.disponibilidade,
      datasIndisponiveis: datas,
    },
  };
  salvarPortfolio(next);
  return next;
}

export function termosDePacote(
  pacote: PacoteServico,
  dataAgendada: string,
  extras?: {
    instrucoesAdicionais?: string;
    logistica?: LogisticaContrato;
    escopoOverride?: string;
    valorOverride?: number;
  },
): TermosContratacao {
  const escopoBase =
    extras?.escopoOverride?.trim() ||
    [pacote.descricao, ...pacote.itensInclusos.map((i) => `• ${i}`)].join("\n");

  return {
    escopo: escopoBase,
    valor: extras?.valorOverride ?? pacote.preco,
    dataAgendada,
    pacoteId: pacote.id,
    pacoteNome: pacote.nome,
    instrucoesAdicionais: extras?.instrucoesAdicionais,
    logistica: extras?.logistica,
    origem: extras?.escopoOverride || extras?.valorOverride
      ? "portfolio_chat"
      : "portfolio_direto",
  };
}

/**
 * Cria contrato assinado a partir do portfólio e registra no pagamento retido.
 * A data só é ocupada após o depósito (ver `registrarDeposito`).
 */
export function criarContratoPortfolio(params: {
  portfolio: PortfolioInfluenciador;
  termos: TermosContratacao;
  empresa?: { id?: string; nome?: string; usuarioId?: string };
}): { contrato: Contrato; contratoId: string } {
  const matchId = matchIdPortfolio(
    params.portfolio.id,
    params.empresa?.usuarioId ?? EMPRESA_NEGOCIACAO_USUARIO_ID,
  );

  const contrato: Contrato = {
    id: novoId("ctr-port"),
    matchId,
    valor: params.termos.valor,
    escopo: params.termos.escopo.trim(),
    prazoEntrega: params.termos.dataAgendada,
    status: "assinado",
    dataAssinatura: new Date().toISOString(),
    pacoteId: params.termos.pacoteId,
    dataAgendada: params.termos.dataAgendada,
    instrucoesAdicionais: params.termos.instrucoesAdicionais,
    logistica: params.termos.logistica,
    influenciadorId: params.portfolio.id,
    origem: params.termos.origem ?? "portfolio_direto",
    ...camposCicloEntregaIniciais(),
  };

  registrarContextoPagamentoDireto(contrato, {
    empresa: {
      id: params.empresa?.id ?? EMPRESA_MOCK_ID,
      nome: params.empresa?.nome ?? "Sua empresa",
      usuarioId:
        params.empresa?.usuarioId ?? EMPRESA_NEGOCIACAO_USUARIO_ID,
    },
    influenciador: {
      id: params.portfolio.id,
      nome: params.portfolio.nome,
      usuarioId: params.portfolio.usuarioId,
      documentoTipo: "cpf",
    },
    demandaTitulo: params.termos.pacoteNome
      ? `Pacote: ${params.termos.pacoteNome}`
      : `Contratação — ${params.portfolio.nome}`,
  });

  return { contrato, contratoId: contrato.id };
}

function demandaSinteticaPortfolio(
  portfolio: PortfolioInfluenciador,
): Demanda {
  return {
    id: `dem-port-${portfolio.id}`,
    empresaId: EMPRESA_MOCK_ID,
    titulo: `Conversa a partir do portfólio — ${portfolio.nome}`,
    briefing:
      "Chat aberto pela empresa a partir da vitrine pública. Sem custo e sem convite prévio.",
    orcamento: portfolio.pacotes.find((p) => p.ativo)?.preco ?? 0,
    formatoEntrega: "reels",
    prazo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    nichoId: portfolio.nichoIds[0] ?? "cat-beleza",
    status: "aberta",
  };
}

export function obterOuCriarContextoChatPortfolio(params: {
  portfolio: PortfolioInfluenciador;
  empresaUsuarioId: string;
  empresaNome?: string;
}): NegociacaoContexto {
  const matchId = matchIdPortfolio(
    params.portfolio.id,
    params.empresaUsuarioId,
  );
  const demanda = demandaSinteticaPortfolio(params.portfolio);
  const match: Match = {
    id: matchId,
    demandaId: demanda.id,
    influenciadorId: params.portfolio.id,
    score: 100,
    status: "sugerido",
  };

  return {
    match,
    demanda,
    influenciador: {
      id: params.portfolio.id,
      nome: params.portfolio.nome,
      nicho: nomeNicho(params.portfolio.nichoIds[0] ?? "cat-beleza"),
      seguidores: params.portfolio.seguidores,
      engajamentoMedio: params.portfolio.engajamentoMedio,
      notaMedia: params.portfolio.notaMediaAvaliacao,
      totalAvaliacoes: params.portfolio.totalAvaliacoes,
    },
    empresa: {
      id: EMPRESA_MOCK_ID,
      nome: params.empresaNome ?? "Sua empresa",
      usuarioId: params.empresaUsuarioId,
    },
    influenciadorUsuarioId: params.portfolio.usuarioId,
    taxaDesbloqueio: TAXA_DESBLOQUEIO_PADRAO,
  };
}

function estadoChatPortfolioInicial(matchId: string): NegociacaoEstado {
  return {
    matchId,
    conversa: { id: `conv-${matchId}`, contratoId: "" },
    /** Chat do portfólio é sempre gratuito — sem paywall. */
    desbloqueado: true,
    desbloqueadoEm: new Date().toISOString(),
    mensagens: [],
    contrato: null,
    etapaContrato: "nenhuma",
    assinaturaEmpresa: false,
    assinaturaInfluenciador: false,
  };
}

/** Seed: termos negociados no chat ainda sem checkout confirmado (demo dashboard). */
export const MATCH_PORTFOLIO_TERMOS_PENDENTES_ID = matchIdPortfolio(
  INFLUENCIADOR_MOCK_ID,
  EMPRESA_NEGOCIACAO_USUARIO_ID,
);

function estadoChatComTermosPendentes(matchId: string): NegociacaoEstado {
  const enviadoEm = "2026-07-20T11:00:00.000Z";
  return {
    ...estadoChatPortfolioInicial(matchId),
    desbloqueadoEm: "2026-07-19T10:00:00.000Z",
    mensagens: [
      {
        id: "msg-port-termos-001",
        conversaId: `conv-${matchId}`,
        remetenteId: INFLUENCIADOR_MOCK_ID,
        texto: "Combinamos o pacote essencial para a data combinada.",
        enviadoEm,
        flagContatoExterno: "nenhum",
        propostaContratacao: {
          escopo: "1 Reels + 3 Stories — lançamento linha verão",
          valor: 2800,
          dataAgendada: isoDiasAPartirDeHoje(7),
          pacoteNome: "Pacote essencial",
        },
      },
    ],
  };
}

export function carregarEstadoChatPortfolio(
  matchId: string,
): NegociacaoEstado {
  if (typeof window === "undefined") {
    if (matchId === MATCH_PORTFOLIO_TERMOS_PENDENTES_ID) {
      return estadoChatComTermosPendentes(matchId);
    }
    return estadoChatPortfolioInicial(matchId);
  }
  try {
    const raw = localStorage.getItem(`${CHAT_PORTFOLIO_PREFIX}${matchId}`);
    if (raw) return JSON.parse(raw) as NegociacaoEstado;
  } catch {
    // fall through
  }
  if (matchId === MATCH_PORTFOLIO_TERMOS_PENDENTES_ID) {
    return estadoChatComTermosPendentes(matchId);
  }
  return estadoChatPortfolioInicial(matchId);
}

export function salvarEstadoChatPortfolio(estado: NegociacaoEstado): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `${CHAT_PORTFOLIO_PREFIX}${estado.matchId}`,
    JSON.stringify(estado),
  );
}

export type TermoPendenteConfirmacao = {
  matchId: string;
  influenciadorId: string;
  influenciadorNome: string;
  empresaUsuarioId: string;
  enviadoEm: string;
  href: string;
};

/**
 * Chats de portfólio com card de termos ainda sem contrato confirmado.
 */
export function listarTermosPendentesConfirmacao(
  empresaUsuarioId: string = EMPRESA_NEGOCIACAO_USUARIO_ID,
): TermoPendenteConfirmacao[] {
  const seeds: Array<{
    influenciadorId: string;
    influenciadorNome: string;
    empresaUsuarioId: string;
  }> = [
    {
      influenciadorId: INFLUENCIADOR_MOCK_ID,
      influenciadorNome: "Ana Beatriz Silva",
      empresaUsuarioId: EMPRESA_NEGOCIACAO_USUARIO_ID,
    },
  ];

  const pendentes: TermoPendenteConfirmacao[] = [];

  for (const seed of seeds) {
    if (seed.empresaUsuarioId !== empresaUsuarioId) continue;
    const matchId = matchIdPortfolio(
      seed.influenciadorId,
      seed.empresaUsuarioId,
    );
    const estado = carregarEstadoChatPortfolio(matchId);
    if (estado.contrato) continue;
    const comProposta = [...estado.mensagens]
      .reverse()
      .find((m) => m.propostaContratacao);
    if (!comProposta) continue;
    pendentes.push({
      matchId,
      influenciadorId: seed.influenciadorId,
      influenciadorNome: seed.influenciadorNome,
      empresaUsuarioId: seed.empresaUsuarioId,
      enviadoEm: comProposta.enviadoEm,
      href: `/influenciador/${seed.influenciadorId}`,
    });
  }

  return pendentes;
}
