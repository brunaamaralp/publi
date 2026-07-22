/**
 * Agrega dados já existentes para o dashboard do influenciador.
 * Não introduz fórmulas novas — só filtra, ordena e resume.
 */

import {
  carregarAvaliacoesContrato,
  jaAvaliouContrato,
} from "@/lib/avaliacao/utils";
import {
  dataEstaDisponivel,
  formatarDataAgendaCurta,
  listarProximosDiasIso,
} from "@/lib/influenciador/agenda-utils";
import { INFLUENCIADOR_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import {
  CONTRATOS_PAGAMENTO_MOCK,
  getContratoPagamentoContexto,
} from "@/lib/mock-data/contratos-pagamento";
import { CREATORS_CATALOGO_MOCK } from "@/lib/mock-data/creators-catalogo";
import {
  listarDemandasFeed,
  type DemandaFeedItem,
} from "@/lib/mock-data/demandas";
import {
  INFLUENCIADORES_MERCADO_MOCK,
  listarInfluenciadoresMercado,
} from "@/lib/mock-data/influenciadores-mercado";
import { hrefPagamentoContrato } from "@/lib/pagamento/contrato-pagamento-link";
import {
  carregarPagamentoEstado,
} from "@/lib/pagamento/pagamento-utils";
import { calcularSaldoInfluenciador } from "@/lib/pagamento/saldo-influenciador";
import type { ContratoPagamentoContexto } from "@/lib/pagamento/pagamento-types";
import type { Aditivo, Contrato } from "@/lib/types";
import {
  compararPrecosComMercado,
  type ResumoComparacaoMercado,
} from "@/lib/utils/comparacao-mercado";

/** Dias restantes para considerar prazo de entrega urgente. */
export const DIAS_URGENCIA_ENTREGA = 3;

/** Máximo de itens na central de ações do dashboard. */
export const MAX_ACOES_DASHBOARD = 5;

export type TipoAcaoDashboard =
  | "aditivo_proposto"
  | "prazo_entrega"
  | "ajuste_solicitado"
  | "avaliacao_pendente";

export type AcaoDashboard = {
  id: string;
  tipo: TipoAcaoDashboard;
  titulo: string;
  acaoLabel: string;
  href: string;
  /** Menor = mais urgente. */
  prioridade: number;
  empresaNome: string;
  contratoId: string;
};

export type ResumoAgendaDashboard = {
  diasOcupadosProximos: number;
  janelaDias: number;
  proximasDatas: string[];
  texto: string;
};

export type ResumoSaldoDashboard = {
  disponivel: number;
  retido: number;
  entregasEmAndamento: number;
};

function listarContextosInfluenciador(
  influenciadorId: string,
): ContratoPagamentoContexto[] {
  const ids = Object.keys(CONTRATOS_PAGAMENTO_MOCK);
  const contextos: ContratoPagamentoContexto[] = [];
  for (const id of ids) {
    const ctx = getContratoPagamentoContexto(id);
    if (ctx && ctx.influenciador.id === influenciadorId) {
      contextos.push(ctx);
    }
  }
  return contextos;
}

function estadoOuSeed(contratoId: string) {
  return carregarPagamentoEstado(contratoId);
}

/** `statusEntrega === pendente` = entrega em andamento (ainda não enviada). */
function entregaEmAndamento(
  item: Pick<Contrato | Aditivo, "statusEntrega">,
): boolean {
  return item.statusEntrega === "pendente";
}

function diasAtePrazo(prazoEntrega: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const prazo = new Date(
    prazoEntrega.length <= 10 ? `${prazoEntrega}T12:00:00` : prazoEntrega,
  );
  prazo.setHours(0, 0, 0, 0);
  return Math.ceil((prazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
}

function hrefContrato(contrato: Contrato): string {
  return hrefPagamentoContrato(contrato);
}

function acoesDeAditivosPropostos(
  ctx: ContratoPagamentoContexto,
  aditivos: Aditivo[],
): AcaoDashboard[] {
  return aditivos
    .filter((a) => a.status === "proposto")
    .map((a) => ({
      id: `aditivo-${a.id}`,
      tipo: "aditivo_proposto" as const,
      titulo: `${ctx.empresa.nome} propôs um serviço adicional`,
      acaoLabel: "Responder",
      href: hrefContrato(ctx.contrato),
      prioridade: 10,
      empresaNome: ctx.empresa.nome,
      contratoId: ctx.contrato.id,
    }));
}

function acoesDePrazoEntrega(
  ctx: ContratoPagamentoContexto,
  contrato: Contrato,
  aditivos: Aditivo[],
): AcaoDashboard[] {
  const itens: Array<{
    id: string;
    prazoEntrega: string;
    statusEntrega: Contrato["statusEntrega"];
  }> = [
    {
      id: contrato.id,
      prazoEntrega: contrato.prazoEntrega,
      statusEntrega: contrato.statusEntrega,
    },
    ...aditivos
      .filter((a) => a.status === "ativo")
      .map((a) => ({
        id: a.id,
        prazoEntrega: a.prazoEntrega,
        statusEntrega: a.statusEntrega,
      })),
  ];

  const acoes: AcaoDashboard[] = [];
  for (const item of itens) {
    if (!entregaEmAndamento(item)) continue;
    const dias = diasAtePrazo(item.prazoEntrega);
    if (dias < 0 || dias >= DIAS_URGENCIA_ENTREGA) continue;
    const textoDias =
      dias === 0
        ? "hoje"
        : dias === 1
          ? "em 1 dia"
          : `em ${dias} dias`;
    acoes.push({
      id: `prazo-${item.id}`,
      tipo: "prazo_entrega",
      titulo: `Entrega para ${ctx.empresa.nome} vence ${textoDias}`,
      acaoLabel: "Entregar",
      href: hrefContrato(contrato),
      prioridade: 20 + dias,
      empresaNome: ctx.empresa.nome,
      contratoId: contrato.id,
    });
  }
  return acoes;
}

function acoesDeAjuste(
  ctx: ContratoPagamentoContexto,
  contrato: Contrato,
  aditivos: Aditivo[],
): AcaoDashboard[] {
  const itens: Array<{
    id: string;
    statusEntrega: Contrato["statusEntrega"];
    ciclosAjusteUsados: number;
  }> = [
    {
      id: contrato.id,
      statusEntrega: contrato.statusEntrega,
      ciclosAjusteUsados: contrato.ciclosAjusteUsados,
    },
    ...aditivos.map((a) => ({
      id: a.id,
      statusEntrega: a.statusEntrega,
      ciclosAjusteUsados: a.ciclosAjusteUsados,
    })),
  ];

  return itens
    .filter((item) => item.statusEntrega === "ajuste_solicitado")
    .map((item) => ({
      id: `ajuste-${item.id}`,
      tipo: "ajuste_solicitado" as const,
      titulo: `${ctx.empresa.nome} pediu ajuste (${item.ciclosAjusteUsados} de 2)`,
      acaoLabel: "Reenviar",
      href: hrefContrato(contrato),
      prioridade: 15,
      empresaNome: ctx.empresa.nome,
      contratoId: contrato.id,
    }));
}

function acoesDeAvaliacao(
  ctx: ContratoPagamentoContexto,
  contrato: Contrato,
  influenciadorUsuarioId: string,
): AcaoDashboard[] {
  const elegivel =
    contrato.status === "concluida" || contrato.statusEntrega === "aprovado";
  if (!elegivel) return [];

  const avaliacoes = carregarAvaliacoesContrato(contrato.id);
  if (jaAvaliouContrato(avaliacoes, contrato.id, influenciadorUsuarioId)) {
    return [];
  }

  return [
    {
      id: `avaliacao-${contrato.id}`,
      tipo: "avaliacao_pendente",
      titulo: `Avalie sua experiência com ${ctx.empresa.nome}`,
      acaoLabel: "Avaliar",
      href: hrefContrato(contrato),
      prioridade: 40,
      empresaNome: ctx.empresa.nome,
      contratoId: contrato.id,
    },
  ];
}

/**
 * Central de ações do influenciador, ordenada por urgência.
 * Retorna no máximo `MAX_ACOES_DASHBOARD` itens (+ flag de overflow).
 */
export function listarAcoesPendentesDashboard(
  influenciadorId: string = INFLUENCIADOR_MOCK_ID,
): { acoes: AcaoDashboard[]; total: number } {
  const contextos = listarContextosInfluenciador(influenciadorId);
  const acoes: AcaoDashboard[] = [];

  for (const ctx of contextos) {
    const estado = estadoOuSeed(ctx.contrato.id);
    if (!estado) continue;
    const contrato = estado.contrato;
    const aditivos = estado.aditivos ?? [];
    const usuarioId = ctx.influenciador.usuarioId;

    acoes.push(...acoesDeAditivosPropostos(ctx, aditivos));
    acoes.push(...acoesDeAjuste(ctx, contrato, aditivos));
    acoes.push(...acoesDePrazoEntrega(ctx, contrato, aditivos));
    acoes.push(...acoesDeAvaliacao(ctx, contrato, usuarioId));
  }

  acoes.sort((a, b) => a.prioridade - b.prioridade || a.titulo.localeCompare(b.titulo));
  const total = acoes.length;
  return {
    acoes: acoes.slice(0, MAX_ACOES_DASHBOARD),
    total,
  };
}

export function resumoSaldoDashboard(
  influenciadorId: string = INFLUENCIADOR_MOCK_ID,
): ResumoSaldoDashboard {
  const saldo = calcularSaldoInfluenciador(influenciadorId);
  let entregasEmAndamento = 0;

  for (const ctx of listarContextosInfluenciador(influenciadorId)) {
    const estado = estadoOuSeed(ctx.contrato.id);
    if (!estado) continue;
    if (entregaEmAndamento(estado.contrato)) entregasEmAndamento += 1;
    for (const aditivo of estado.aditivos) {
      if (aditivo.status !== "ativo") continue;
      if (entregaEmAndamento(aditivo)) entregasEmAndamento += 1;
    }
  }

  return {
    disponivel: saldo.disponivel,
    retido: saldo.retido,
    entregasEmAndamento,
  };
}

/** Top N demandas por match score (mesmo feed das oportunidades). */
export function teaserOportunidadesDashboard(limite = 3): DemandaFeedItem[] {
  return [...listarDemandasFeed()]
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, limite);
}

export function resumoComparacaoPrecoDashboard(
  influenciadorId: string = INFLUENCIADOR_MOCK_ID,
): ResumoComparacaoMercado | null {
  const perfil = INFLUENCIADORES_MERCADO_MOCK.find(
    (p) => p.influenciador.id === influenciadorId,
  );
  if (!perfil) return null;
  return compararPrecosComMercado(perfil, listarInfluenciadoresMercado());
}

export function textoCurtoComparacaoMercado(
  resumo: ResumoComparacaoMercado,
): string {
  const total = resumo.porServico.length;
  if (resumo.naMedia > 0) {
    return `Na média em ${resumo.naMedia} de ${total} serviços`;
  }
  if (resumo.abaixo > 0 && resumo.abaixo >= resumo.acima) {
    return `Abaixo do mercado em ${resumo.abaixo} de ${total} serviços`;
  }
  if (resumo.acima > 0) {
    return `Acima do mercado em ${resumo.acima} de ${total} serviços`;
  }
  return resumo.textoResumo;
}

export function resumoAgendaDashboard(
  influenciadorId: string = INFLUENCIADOR_MOCK_ID,
  janelaDias = 14,
): ResumoAgendaDashboard {
  const creator = CREATORS_CATALOGO_MOCK.find((c) => c.id === influenciadorId);
  const disponibilidade = creator?.disponibilidade;
  const dias = listarProximosDiasIso(janelaDias);
  const ocupadas = dias.filter(
    (dataIso) => !dataEstaDisponivel(disponibilidade, dataIso),
  );

  const texto =
    ocupadas.length === 0
      ? `Agenda livre nos próximos ${janelaDias} dias`
      : ocupadas.length === 1
        ? `1 dia ocupado nos próximos ${janelaDias}`
        : `${ocupadas.length} dias ocupados nos próximos ${janelaDias}`;

  return {
    diasOcupadosProximos: ocupadas.length,
    janelaDias,
    proximasDatas: ocupadas.slice(0, 3).map(formatarDataAgendaCurta),
    texto,
  };
}
