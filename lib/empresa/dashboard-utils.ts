/**
 * Agrega dados já existentes para o dashboard da empresa.
 * Não introduz fórmulas novas — só filtra, ordena e resume.
 */

import {
  carregarAvaliacoesContrato,
  jaAvaliouContrato,
} from "@/lib/avaliacao/utils";
import { listarDemandasEmpresa } from "@/lib/empresa/demandas-utils";
import {
  listarTermosPendentesConfirmacao,
  type TermoPendenteConfirmacao,
} from "@/lib/influenciador/contratacao-direta";
import { EMPRESA_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import {
  CONTRATOS_PAGAMENTO_MOCK,
  getContratoPagamentoContexto,
} from "@/lib/mock-data/contratos-pagamento";
import { EMPRESA_NEGOCIACAO_USUARIO_ID } from "@/lib/negociacao/negociacao-constantes";
import { hrefPagamentoContrato } from "@/lib/pagamento/contrato-pagamento-link";
import type { ContratoPagamentoContexto } from "@/lib/pagamento/pagamento-types";
import {
  carregarPagamentoEstado,
  valorRetidoPagamentoRetido,
} from "@/lib/pagamento/pagamento-utils";
import type { Aditivo, Contrato } from "@/lib/types";

export const MAX_ACOES_DASHBOARD_EMPRESA = 5;

const STATUS_DEMANDA_ATIVA = new Set([
  "aberta",
  "em_negociacao",
  "em_andamento",
]);

export type TipoAcaoDashboardEmpresa =
  | "revisar_entrega"
  | "confirmar_termos"
  | "depositar_aditivo"
  | "avaliacao_pendente";

export type AcaoDashboardEmpresa = {
  id: string;
  tipo: TipoAcaoDashboardEmpresa;
  titulo: string;
  acaoLabel: string;
  href: string;
  prioridade: number;
  influenciadorNome: string;
  contratoId?: string;
};

export type ResumoFinanceiroEmpresa = {
  retido: number;
  contratosAtivos: number;
  demandasAtivas: number;
  matchesRecebidos: number;
};

export type DisputaDashboardEmpresa = {
  id: string;
  contratoId: string;
  influenciadorNome: string;
  reportadoEm: string;
  href: string;
};

function listarContextosEmpresa(
  empresaId: string,
): ContratoPagamentoContexto[] {
  const contextos: ContratoPagamentoContexto[] = [];
  for (const id of Object.keys(CONTRATOS_PAGAMENTO_MOCK)) {
    const ctx = getContratoPagamentoContexto(id);
    if (ctx && ctx.empresa.id === empresaId) {
      contextos.push(ctx);
    }
  }
  return contextos;
}

function hrefContrato(contrato: Contrato): string {
  return hrefPagamentoContrato(contrato);
}

function formatarIdCurto(id: string): string {
  return id.replace(/^ctr-/, "");
}

function acoesRevisarEntrega(
  ctx: ContratoPagamentoContexto,
  contrato: Contrato,
  aditivos: Aditivo[],
): AcaoDashboardEmpresa[] {
  const itens: Array<{ id: string; statusEntrega: Contrato["statusEntrega"] }> =
    [
      { id: contrato.id, statusEntrega: contrato.statusEntrega },
      ...aditivos.map((a) => ({
        id: a.id,
        statusEntrega: a.statusEntrega,
      })),
    ];

  return itens
    .filter((item) => item.statusEntrega === "entregue")
    .map((item) => ({
      id: `revisar-${item.id}`,
      tipo: "revisar_entrega" as const,
      titulo: `${ctx.influenciador.nome} entregou o serviço do contrato #${formatarIdCurto(contrato.id)}`,
      acaoLabel: "Revisar",
      href: hrefContrato(contrato),
      prioridade: 10,
      influenciadorNome: ctx.influenciador.nome,
      contratoId: contrato.id,
    }));
}

function acoesDepositarAditivo(
  ctx: ContratoPagamentoContexto,
  contrato: Contrato,
  aditivos: Aditivo[],
): AcaoDashboardEmpresa[] {
  return aditivos
    .filter((a) => a.status === "aceito")
    .map((a) => ({
      id: `depositar-${a.id}`,
      tipo: "depositar_aditivo" as const,
      titulo: `Serviço adicional aceito por ${ctx.influenciador.nome} — depósito pendente`,
      acaoLabel: "Depositar",
      href: hrefContrato(contrato),
      prioridade: 20,
      influenciadorNome: ctx.influenciador.nome,
      contratoId: contrato.id,
    }));
}

function acoesAvaliacao(
  ctx: ContratoPagamentoContexto,
  contrato: Contrato,
): AcaoDashboardEmpresa[] {
  const elegivel =
    contrato.status === "concluida" || contrato.statusEntrega === "aprovado";
  if (!elegivel) return [];

  const avaliacoes = carregarAvaliacoesContrato(contrato.id);
  if (jaAvaliouContrato(avaliacoes, contrato.id, ctx.empresa.usuarioId)) {
    return [];
  }

  return [
    {
      id: `avaliacao-${contrato.id}`,
      tipo: "avaliacao_pendente",
      titulo: `Avalie sua experiência com ${ctx.influenciador.nome}`,
      acaoLabel: "Avaliar",
      href: hrefContrato(contrato),
      prioridade: 40,
      influenciadorNome: ctx.influenciador.nome,
      contratoId: contrato.id,
    },
  ];
}

function acoesConfirmarTermos(
  empresaUsuarioId: string,
): AcaoDashboardEmpresa[] {
  return listarTermosPendentesConfirmacao(empresaUsuarioId).map(
    (termo: TermoPendenteConfirmacao) => ({
      id: `termos-${termo.matchId}`,
      tipo: "confirmar_termos" as const,
      titulo: `${termo.influenciadorNome} negociou termos — falta confirmar`,
      acaoLabel: "Confirmar",
      href: termo.href,
      prioridade: 15,
      influenciadorNome: termo.influenciadorNome,
    }),
  );
}

export function listarAcoesPendentesDashboardEmpresa(
  empresaId: string = EMPRESA_MOCK_ID,
  empresaUsuarioId: string = EMPRESA_NEGOCIACAO_USUARIO_ID,
): { acoes: AcaoDashboardEmpresa[]; total: number } {
  const acoes: AcaoDashboardEmpresa[] = [];

  for (const ctx of listarContextosEmpresa(empresaId)) {
    const estado = carregarPagamentoEstado(ctx.contrato.id);
    if (!estado) continue;
    acoes.push(
      ...acoesRevisarEntrega(ctx, estado.contrato, estado.aditivos),
    );
    acoes.push(
      ...acoesDepositarAditivo(ctx, estado.contrato, estado.aditivos),
    );
    acoes.push(...acoesAvaliacao(ctx, estado.contrato));
  }

  acoes.push(...acoesConfirmarTermos(empresaUsuarioId));

  acoes.sort(
    (a, b) => a.prioridade - b.prioridade || a.titulo.localeCompare(b.titulo),
  );
  const total = acoes.length;
  return {
    acoes: acoes.slice(0, MAX_ACOES_DASHBOARD_EMPRESA),
    total,
  };
}

export function resumoFinanceiroDashboardEmpresa(
  empresaId: string = EMPRESA_MOCK_ID,
): ResumoFinanceiroEmpresa {
  let retido = 0;
  let contratosAtivos = 0;

  for (const ctx of listarContextosEmpresa(empresaId)) {
    const estado = carregarPagamentoEstado(ctx.contrato.id);
    if (!estado) continue;

    const ativo =
      estado.contrato.status === "assinado" ||
      estado.contrato.status === "em_andamento" ||
      estado.contrato.status === "em_disputa";
    if (!ativo) continue;

    contratosAtivos += 1;
    retido += valorRetidoPagamentoRetido(estado);
  }

  const demandas = listarDemandasEmpresa(empresaId).filter((item) =>
    STATUS_DEMANDA_ATIVA.has(item.demanda.status),
  );
  const matchesRecebidos = demandas.reduce(
    (acc, item) => acc + item.matchesGerados,
    0,
  );

  return {
    retido,
    contratosAtivos,
    demandasAtivas: demandas.length,
    matchesRecebidos,
  };
}

export function listarDisputasDashboardEmpresa(
  empresaId: string = EMPRESA_MOCK_ID,
): DisputaDashboardEmpresa[] {
  const disputas: DisputaDashboardEmpresa[] = [];

  for (const ctx of listarContextosEmpresa(empresaId)) {
    const estado = carregarPagamentoEstado(ctx.contrato.id);
    if (!estado) continue;

    const ciclo =
      estado.contrato.statusEntrega === "em_disputa"
        ? estado.contrato
        : estado.aditivos.find((a) => a.statusEntrega === "em_disputa");

    if (!ciclo || ciclo.statusEntrega !== "em_disputa" || !ciclo.disputa) {
      continue;
    }

    disputas.push({
      id: `disputa-${ctx.contrato.id}-${"id" in ciclo ? ciclo.id : "ctr"}`,
      contratoId: ctx.contrato.id,
      influenciadorNome: ctx.influenciador.nome,
      reportadoEm: ciclo.disputa.reportadoEm,
      href: hrefContrato(estado.contrato),
    });
  }

  return disputas.sort(
    (a, b) =>
      new Date(b.reportadoEm).getTime() - new Date(a.reportadoEm).getTime(),
  );
}

export function formatarDesdeQuando(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
