import type {
  Aditivo,
  CamposCicloEntrega,
  Contrato,
  Entrega,
  PagamentoRetido,
  PagamentoRetidoItem,
  Pagamento,
  Rpa,
} from "@/lib/types";
import {
  camposCicloEntregaIniciais,
  STATUS_CONTRATO_PERMITE_ADITIVO,
} from "@/lib/types/contrato";

import {
  liberarDataAgenda,
  ocuparDataAgenda,
} from "@/lib/influenciador/contratacao-direta";
import { getContratoPagamentoContexto, estadoPagamentoSeed } from "@/lib/mock-data/contratos-pagamento";
import { sincronizarStatusContratoRegistrado } from "@/lib/pagamento/contrato-pagamento-registro";
import {
  DIAS_UTEIS_LIBERACAO_AUTOMATICA,
  diasUteisRestantesAte,
  prazoLiberacaoAutomaticaIso,
  prazoLiberacaoVencido,
} from "@/lib/pagamento/dias-uteis";
import type {
  AlvoEntrega,
  ContratoPagamentoContexto,
  PagamentoFluxoEstado,
} from "@/lib/pagamento/pagamento-types";
import type { CalculoRpa } from "@/lib/pagamento/pagamento-types";

const STORAGE_PREFIX = "pagamento-estado-";

export { DIAS_UTEIS_LIBERACAO_AUTOMATICA };

function storageKey(contratoId: string) {
  return `${STORAGE_PREFIX}${contratoId}`;
}

function novoId(prefixo: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefixo}-${crypto.randomUUID()}`;
  }
  return `${prefixo}-${Date.now()}`;
}

export function calcularRpa(valorBruto: number): CalculoRpa {
  const inssRetido = Math.round(valorBruto * 0.11 * 100) / 100;
  const irrfRetido =
    valorBruto < 5000 ? 0 : Math.round(valorBruto * 0.015 * 100) / 100;
  const issRetido = Math.round(valorBruto * 0.03 * 100) / 100;
  const valorLiquido =
    Math.round((valorBruto - inssRetido - irrfRetido - issRetido) * 100) / 100;

  return {
    valorBruto,
    inssRetido,
    irrfRetido,
    issRetido,
    valorLiquido,
  };
}

function normalizarCicloEntrega(
  parcial?: Partial<CamposCicloEntrega>,
): CamposCicloEntrega {
  return {
    ...camposCicloEntregaIniciais(),
    ...parcial,
    ciclosAjusteUsados: parcial?.ciclosAjusteUsados ?? 0,
    statusEntrega: parcial?.statusEntrega ?? "pendente",
  };
}

export function normalizarEstadoPagamento(
  estado: PagamentoFluxoEstado,
): PagamentoFluxoEstado {
  const contrato = {
    ...estado.contrato,
    ...normalizarCicloEntrega(estado.contrato),
  };
  const aditivos = (estado.aditivos ?? []).map((a) => ({
    ...a,
    ...normalizarCicloEntrega(a),
  }));
  let pagamentoRetido = estado.pagamentoRetido;
  if (!pagamentoRetido && estado.pagamento) {
    pagamentoRetido = {
      id: novoId("pagamento-retido"),
      contratoId: estado.contratoId,
      itens: [
        {
          id: novoId("pagamento-retido-item"),
          origem: "contrato",
          referenciaId: estado.contratoId,
          valor: estado.pagamento.valor,
          status: estado.pagamento.status,
        },
      ],
    };
  }
  return { ...estado, contrato, aditivos, pagamentoRetido: pagamentoRetido ?? null };
}

function criarEstadoInicial(
  ctx: ContratoPagamentoContexto,
): PagamentoFluxoEstado {
  const contrato = {
    ...ctx.contrato,
    ...normalizarCicloEntrega(ctx.contrato),
  };
  const aditivos = (ctx.aditivos ?? []).map((a) => ({
    ...a,
    ...normalizarCicloEntrega(a),
  }));
  return {
    contratoId: ctx.contrato.id,
    contrato,
    pagamento: null,
    pagamentoRetido: null,
    aditivos,
    rpa: null,
    entrega: null,
  };
}

export function carregarPagamentoEstado(
  contratoId: string,
): PagamentoFluxoEstado | null {
  const ctx = getContratoPagamentoContexto(contratoId);
  if (!ctx) return null;

  if (typeof window === "undefined") {
    return criarEstadoInicial(ctx);
  }

  const salvo = localStorage.getItem(storageKey(contratoId));
  if (!salvo) {
    const seed = estadoPagamentoSeed(contratoId);
    return seed
      ? normalizarEstadoPagamento(seed)
      : criarEstadoInicial(ctx);
  }

  try {
    return normalizarEstadoPagamento(JSON.parse(salvo) as PagamentoFluxoEstado);
  } catch {
    return criarEstadoInicial(ctx);
  }
}

export function salvarPagamentoEstado(estado: PagamentoFluxoEstado) {
  if (typeof window === "undefined") return;
  const normalizado = normalizarEstadoPagamento(estado);
  localStorage.setItem(
    storageKey(normalizado.contratoId),
    JSON.stringify(normalizado),
  );

  const matchId = normalizado.contrato.matchId;
  if (!matchId) return;
  try {
    const negKey = `negociacao-estado-${matchId}`;
    const raw = localStorage.getItem(negKey);
    if (!raw) return;
    const neg = JSON.parse(raw) as {
      contrato?: { id?: string; status?: string } | null;
    };
    if (neg.contrato?.id === normalizado.contratoId) {
      neg.contrato = { ...neg.contrato, status: normalizado.contrato.status };
      localStorage.setItem(negKey, JSON.stringify(neg));
    }
  } catch {
    // ignore
  }
}

function criarPagamentoRetidoComItemContrato(
  contratoId: string,
  valor: number,
): PagamentoRetido {
  return {
    id: novoId("pagamento-retido"),
    contratoId,
    itens: [
      {
        id: novoId("pagamento-retido-item"),
        origem: "contrato",
        referenciaId: contratoId,
        valor,
        status: "retido",
      },
    ],
  };
}

export function registrarDeposito(
  estado: PagamentoFluxoEstado,
  ctx: ContratoPagamentoContexto,
  municipioRpa?: string,
): PagamentoFluxoEstado {
  const pagamento: Pagamento = {
    id: novoId("pag"),
    contratoId: estado.contratoId,
    valor: estado.contrato.valor,
    status: "retido",
  };

  let rpa: Rpa | null = null;
  if (ctx.influenciador.documentoTipo === "cpf" && municipioRpa) {
    const calculo = calcularRpa(estado.contrato.valor);
    rpa = {
      id: novoId("rpa"),
      pagamentoId: pagamento.id,
      empresaId: ctx.empresa.id,
      influenciadorId: ctx.influenciador.id,
      municipioReferencia: municipioRpa,
      ...calculo,
      status: "confirmado_pela_empresa",
    };
  }

  sincronizarStatusContratoRegistrado(estado.contratoId, "em_andamento");

  const dataAgendada = estado.contrato.dataAgendada;
  const influenciadorId =
    estado.contrato.influenciadorId ?? ctx.influenciador.id;
  if (dataAgendada && influenciadorId) {
    ocuparDataAgenda(influenciadorId, dataAgendada);
  }

  return {
    ...estado,
    pagamento,
    pagamentoRetido: criarPagamentoRetidoComItemContrato(estado.contratoId, estado.contrato.valor),
    rpa,
    contrato: {
      ...estado.contrato,
      status: "em_andamento",
      ...normalizarCicloEntrega(estado.contrato),
      statusEntrega: "pendente",
    },
  };
}

/**
 * Cancela o contrato (estorno do pagamento retido) e libera a data na agenda.
 */
export function cancelarContrato(
  estado: PagamentoFluxoEstado,
  ctx: ContratoPagamentoContexto,
): PagamentoFluxoEstado {
  sincronizarStatusContratoRegistrado(estado.contratoId, "cancelado");

  const dataAgendada = estado.contrato.dataAgendada;
  const influenciadorId =
    estado.contrato.influenciadorId ?? ctx.influenciador.id;
  if (dataAgendada && influenciadorId) {
    liberarDataAgenda(influenciadorId, dataAgendada);
  }

  return {
    ...estado,
    pagamento: estado.pagamento
      ? { ...estado.pagamento, status: "estornado" }
      : null,
    pagamentoRetido: estado.pagamentoRetido
      ? {
          ...estado.pagamentoRetido,
          itens: estado.pagamentoRetido.itens.map((i) => ({
            ...i,
            status: "estornado" as const,
          })),
        }
      : null,
    contrato: { ...estado.contrato, status: "cancelado" },
  };
}

export type DadosRegistroEntrega = {
  linkComprovante?: string;
  arquivoComprovanteUrl?: string;
  descricao: string;
  alvo?: AlvoEntrega;
};

function aplicarRegistroNoCiclo(
  ciclo: CamposCicloEntrega,
  dados: DadosRegistroEntrega,
  agoraIso: string,
): CamposCicloEntrega {
  return {
    ...ciclo,
    statusEntrega: "entregue",
    dataEntrega: agoraIso,
    prazoLiberacaoAutomatica: prazoLiberacaoAutomaticaIso(agoraIso),
    descricaoEntrega: dados.descricao.trim() || undefined,
    linkComprovante: dados.linkComprovante?.trim() || undefined,
    arquivoComprovanteUrl: dados.arquivoComprovanteUrl,
    motivoAjuste: undefined,
  };
}

/**
 * Influenciador registra (ou reenvia) a entrega.
 * Link/arquivo NÃO passam pelo filtro de contato; a descrição já deve ter sido filtrada na UI.
 */
export function registrarEntrega(
  estado: PagamentoFluxoEstado,
  dados: DadosRegistroEntrega,
): PagamentoFluxoEstado {
  const agoraIso = new Date().toISOString();
  const alvo: AlvoEntrega = dados.alvo ?? {
    origem: "contrato",
    id: estado.contratoId,
  };

  const link =
    dados.linkComprovante?.trim() ||
    dados.arquivoComprovanteUrl ||
    "prova-local";

  const entrega: Entrega = {
    id: novoId("ent"),
    contratoId: estado.contratoId,
    aditivoId: alvo.origem === "aditivo" ? alvo.id : undefined,
    linkComprovante: link,
    dataEntrega: agoraIso,
    descricao: dados.descricao.trim() || undefined,
    arquivoComprovanteUrl: dados.arquivoComprovanteUrl,
    statusConfirmacao: "aguardando",
  };

  if (alvo.origem === "contrato") {
    return {
      ...estado,
      entrega,
      printEntregaPreview: dados.arquivoComprovanteUrl,
      contrato: {
        ...estado.contrato,
        ...aplicarRegistroNoCiclo(estado.contrato, dados, agoraIso),
      },
    };
  }

  return {
    ...estado,
    entrega,
    printEntregaPreview: dados.arquivoComprovanteUrl,
    aditivos: estado.aditivos.map((a) =>
      a.id === alvo.id
        ? { ...a, ...aplicarRegistroNoCiclo(a, dados, agoraIso) }
        : a,
    ),
  };
}

function liberarItemPagamentoRetido(
  pagamentoRetido: PagamentoRetido | null,
  alvo: AlvoEntrega,
): PagamentoRetido | null {
  if (!pagamentoRetido) return pagamentoRetido;
  return {
    ...pagamentoRetido,
    itens: pagamentoRetido.itens.map((item) =>
      item.origem === alvo.origem && item.referenciaId === alvo.id
        ? { ...item, status: "liberado" as const }
        : item,
    ),
  };
}

function sincronizarPagamentoComPagamentoRetido(
  estado: PagamentoFluxoEstado,
  pagamentoRetido: PagamentoRetido | null,
): Pagamento | null {
  if (!estado.pagamento) return null;
  const itemContrato = pagamentoRetido?.itens.find(
    (i) => i.origem === "contrato" && i.referenciaId === estado.contratoId,
  );
  if (!itemContrato) return estado.pagamento;
  return { ...estado.pagamento, status: itemContrato.status };
}

function todosItensLiberados(pagamentoRetido: PagamentoRetido | null): boolean {
  if (!pagamentoRetido || pagamentoRetido.itens.length === 0) return false;
  return pagamentoRetido.itens.every((i) => i.status === "liberado");
}

/**
 * Empresa aprova a entrega — libera o item correspondente do pagamento retido.
 */
export function aprovarEntrega(
  estado: PagamentoFluxoEstado,
  alvo: AlvoEntrega = { origem: "contrato", id: estado.contratoId },
  automatica = false,
): PagamentoFluxoEstado {
  const pagamentoRetido = liberarItemPagamentoRetido(estado.pagamentoRetido, alvo);
  const pagamento = sincronizarPagamentoComPagamentoRetido(estado, pagamentoRetido);
  const cumprido = todosItensLiberados(pagamentoRetido);

  if (cumprido) {
    sincronizarStatusContratoRegistrado(estado.contratoId, "concluida");
  }

  const statusConfirmacao = automatica
    ? ("confirmada_automaticamente" as const)
    : ("confirmada" as const);

  let contrato = estado.contrato;
  let aditivos = estado.aditivos;

  if (alvo.origem === "contrato") {
    contrato = {
      ...contrato,
      statusEntrega: "aprovado",
      status: cumprido ? "concluida" : contrato.status === "em_disputa" ? (cumprido ? "concluida" : "em_andamento") : contrato.status,
      disputa: contrato.disputa
        ? {
            ...contrato.disputa,
            decisao: contrato.disputa.decisao ?? "liberado_influenciador",
            decididoEm: contrato.disputa.decididoEm ?? new Date().toISOString(),
          }
        : contrato.disputa,
    };
  } else {
    aditivos = aditivos.map((a) =>
      a.id === alvo.id ? { ...a, statusEntrega: "aprovado" as const } : a,
    );
    if (cumprido) {
      contrato = { ...contrato, status: "concluida" };
    }
  }

  return {
    ...estado,
    pagamentoRetido,
    pagamento,
    contrato,
    aditivos,
    entrega: estado.entrega
      ? { ...estado.entrega, statusConfirmacao }
      : estado.entrega,
  };
}

/** Alias legado — aprovação manual do contrato base. */
export function confirmarEntrega(
  estado: PagamentoFluxoEstado,
): PagamentoFluxoEstado {
  return aprovarEntrega(estado, {
    origem: "contrato",
    id: estado.contratoId,
  });
}

export const MAX_CICLOS_AJUSTE = 2;

export function podeSolicitarAjuste(ciclo: CamposCicloEntrega): boolean {
  return (
    ciclo.statusEntrega === "entregue" &&
    ciclo.ciclosAjusteUsados < MAX_CICLOS_AJUSTE
  );
}

/** `prazoEntrega` em `YYYY-MM-DD` ou ISO — considerado vencido após o fim do dia. */
export function prazoEntregaVencido(
  prazoEntrega: string,
  agora: Date = new Date(),
): boolean {
  const raw = prazoEntrega.trim();
  const fim = new Date(
    raw.includes("T") ? raw : `${raw}T23:59:59.999`,
  );
  if (Number.isNaN(fim.getTime())) return false;
  return agora > fim;
}

/**
 * Empresa pode reportar: não-entrega (prazo passou + pendente) ou
 * má-fé na 3ª entrega (ciclosAjusteUsados >= 2 e status entregue).
 */
export function podeReportarProblema(
  ciclo: CamposCicloEntrega,
  prazoEntrega: string,
  agora: Date = new Date(),
): boolean {
  if (ciclo.statusEntrega === "em_disputa") return false;
  if (ciclo.statusEntrega === "aprovado") return false;

  if (
    ciclo.statusEntrega === "pendente" &&
    prazoEntregaVencido(prazoEntrega, agora)
  ) {
    return true;
  }

  if (
    ciclo.statusEntrega === "entregue" &&
    ciclo.ciclosAjusteUsados >= MAX_CICLOS_AJUSTE
  ) {
    return true;
  }

  return false;
}

export type DadosReporteProblema = {
  motivo: string;
  evidencia?: string;
  alvo?: AlvoEntrega;
};

/**
 * Empresa reporta problema → `em_disputa` (pausa liberação automática).
 * Disputa só do aditivo NÃO marca o contrato base como `em_disputa`.
 */
export function reportarProblemaEntrega(
  estado: PagamentoFluxoEstado,
  dados: DadosReporteProblema,
): PagamentoFluxoEstado {
  const alvo: AlvoEntrega = dados.alvo ?? {
    origem: "contrato",
    id: estado.contratoId,
  };
  const agoraIso = new Date().toISOString();
  const disputa = {
    motivo: dados.motivo.trim(),
    evidencia: dados.evidencia,
    reportadoEm: agoraIso,
  };

  const aplicar = (ciclo: CamposCicloEntrega): CamposCicloEntrega => ({
    ...ciclo,
    statusEntrega: "em_disputa",
    disputa,
    /** Pausa: sem prazo ativo enquanto em disputa. */
    prazoLiberacaoAutomatica: undefined,
  });

  if (alvo.origem === "contrato") {
    return {
      ...estado,
      contrato: {
        ...estado.contrato,
        ...aplicar(estado.contrato),
        status: "em_disputa",
      },
    };
  }

  return {
    ...estado,
    aditivos: estado.aditivos.map((a) =>
      a.id === alvo.id ? { ...a, ...aplicar(a) } : a,
    ),
  };
}

function reembolsarItemPagamentoRetido(
  pagamentoRetido: PagamentoRetido | null,
  alvo: AlvoEntrega,
): PagamentoRetido | null {
  if (!pagamentoRetido) return pagamentoRetido;
  return {
    ...pagamentoRetido,
    itens: pagamentoRetido.itens.map((item) =>
      item.origem === alvo.origem && item.referenciaId === alvo.id
        ? { ...item, status: "reembolsado" as const }
        : item,
    ),
  };
}

function liberarAgendaSeContratoEncerrado(
  estado: PagamentoFluxoEstado,
  ctx?: ContratoPagamentoContexto | null,
): void {
  const dataAgendada = estado.contrato.dataAgendada;
  const influenciadorId =
    estado.contrato.influenciadorId ?? ctx?.influenciador.id;
  if (dataAgendada && influenciadorId) {
    liberarDataAgenda(influenciadorId, dataAgendada);
  }
}

/**
 * Admin: libera valor para o influenciador (mesma via de aprovação).
 */
export function decidirDisputaLiberarInfluenciador(
  estado: PagamentoFluxoEstado,
  alvo: AlvoEntrega = { origem: "contrato", id: estado.contratoId },
): PagamentoFluxoEstado {
  const ciclo = obterCicloDoAlvo(estado, alvo);
  if (ciclo.statusEntrega !== "em_disputa" || !ciclo.disputa) return estado;

  const agoraIso = new Date().toISOString();
  let next = estado;

  if (alvo.origem === "contrato") {
    next = {
      ...estado,
      contrato: {
        ...estado.contrato,
        disputa: {
          ...estado.contrato.disputa!,
          decisao: "liberado_influenciador",
          decididoEm: agoraIso,
        },
      },
    };
  } else {
    next = {
      ...estado,
      aditivos: estado.aditivos.map((a) =>
        a.id === alvo.id && a.disputa
          ? {
              ...a,
              disputa: {
                ...a.disputa,
                decisao: "liberado_influenciador",
                decididoEm: agoraIso,
              },
            }
          : a,
      ),
    };
  }

  return aprovarEntrega(next, alvo, false);
}

/**
 * Admin: reembolsa a empresa — valor não vai ao saldo do influenciador.
 * Se o contrato base for cancelado (sem itens retidos), libera a agenda.
 */
export function decidirDisputaReembolsarEmpresa(
  estado: PagamentoFluxoEstado,
  alvo: AlvoEntrega = { origem: "contrato", id: estado.contratoId },
  ctx?: ContratoPagamentoContexto | null,
): PagamentoFluxoEstado {
  const ciclo = obterCicloDoAlvo(estado, alvo);
  if (ciclo.statusEntrega !== "em_disputa" || !ciclo.disputa) return estado;
  if (ciclo.disputa.decisao) return estado;

  const agoraIso = new Date().toISOString();
  const pagamentoRetido = reembolsarItemPagamentoRetido(estado.pagamentoRetido, alvo);
  const pagamento =
    alvo.origem === "contrato" && estado.pagamento
      ? { ...estado.pagamento, status: "reembolsado" as const }
      : sincronizarPagamentoComPagamentoRetido(estado, pagamentoRetido);

  const aindaHaRetido = (pagamentoRetido?.itens ?? []).some((i) => i.status === "retido");

  /** Reembolso do contrato base pode cancelar; aditivo só afeta o item. */
  const statusContrato =
    alvo.origem === "contrato"
      ? aindaHaRetido
        ? ("em_andamento" as const)
        : ("cancelado" as const)
      : estado.contrato.status;

  let next: PagamentoFluxoEstado;

  if (alvo.origem === "contrato") {
    sincronizarStatusContratoRegistrado(estado.contratoId, statusContrato);
    next = {
      ...estado,
      pagamentoRetido,
      pagamento,
      contrato: {
        ...estado.contrato,
        status: statusContrato,
        statusEntrega: "em_disputa",
        disputa: {
          ...estado.contrato.disputa!,
          decisao: "reembolsado_empresa",
          decididoEm: agoraIso,
        },
      },
      entrega: estado.entrega
        ? { ...estado.entrega, statusConfirmacao: "contestada" }
        : estado.entrega,
    };
  } else {
    next = {
      ...estado,
      pagamentoRetido,
      pagamento,
      aditivos: estado.aditivos.map((a) =>
        a.id === alvo.id
          ? {
              ...a,
              status: "cancelado" as const,
              statusEntrega: "em_disputa" as const,
              disputa: {
                ...a.disputa!,
                decisao: "reembolsado_empresa" as const,
                decididoEm: agoraIso,
              },
            }
          : a,
      ),
    };
  }

  if (alvo.origem === "contrato" && statusContrato === "cancelado") {
    liberarAgendaSeContratoEncerrado(next, ctx);
  }

  return next;
}

/**
 * Empresa solicita ajuste (máx. 2 ciclos). Motivo já filtrado na UI.
 */
export function solicitarAjusteEntrega(
  estado: PagamentoFluxoEstado,
  motivo: string,
  alvo: AlvoEntrega = { origem: "contrato", id: estado.contratoId },
): PagamentoFluxoEstado {
  const aplicar = (ciclo: CamposCicloEntrega): CamposCicloEntrega => {
    if (!podeSolicitarAjuste(ciclo)) return ciclo;
    return {
      ...ciclo,
      statusEntrega: "ajuste_solicitado",
      ciclosAjusteUsados: ciclo.ciclosAjusteUsados + 1,
      motivoAjuste: motivo.trim(),
      prazoLiberacaoAutomatica: undefined,
    };
  };

  if (alvo.origem === "contrato") {
    if (!podeSolicitarAjuste(estado.contrato)) return estado;
    return {
      ...estado,
      contrato: { ...estado.contrato, ...aplicar(estado.contrato) },
      entrega: estado.entrega
        ? { ...estado.entrega, statusConfirmacao: "contestada" }
        : estado.entrega,
    };
  }

  const aditivo = estado.aditivos.find((a) => a.id === alvo.id);
  if (!aditivo || !podeSolicitarAjuste(aditivo)) return estado;

  return {
    ...estado,
    aditivos: estado.aditivos.map((a) =>
      a.id === alvo.id ? { ...a, ...aplicar(a) } : a,
    ),
  };
}

/**
 * No carregamento da tela: libera itens com prazo vencido e status `entregue`.
 * Não dispara se `statusEntrega === 'em_disputa'` (reporte pausa o prazo).
 */
export function processarLiberacoesAutomaticas(
  estado: PagamentoFluxoEstado,
  agora: Date = new Date(),
): PagamentoFluxoEstado {
  let next = estado;

  if (
    next.contrato.statusEntrega === "entregue" &&
    prazoLiberacaoVencido(next.contrato.prazoLiberacaoAutomatica, agora)
  ) {
    next = aprovarEntrega(
      next,
      { origem: "contrato", id: next.contratoId },
      true,
    );
  }

  for (const aditivo of [...next.aditivos]) {
    if (
      aditivo.statusEntrega === "entregue" &&
      prazoLiberacaoVencido(aditivo.prazoLiberacaoAutomatica, agora)
    ) {
      next = aprovarEntrega(
        next,
        { origem: "aditivo", id: aditivo.id },
        true,
      );
    }
  }

  return next;
}

/** Caso aberto para a fila admin (sem decisão ainda). */
export function disputaAberta(ciclo: CamposCicloEntrega): boolean {
  return (
    ciclo.statusEntrega === "em_disputa" &&
    Boolean(ciclo.disputa) &&
    !ciclo.disputa?.decisao
  );
}

export function valorExibicaoPagamento(estado: PagamentoFluxoEstado): number {
  if (estado.rpa) return estado.rpa.valorLiquido;
  return estado.pagamento?.valor ?? estado.contrato.valor;
}

export function valorRetidoPagamentoRetido(estado: PagamentoFluxoEstado): number {
  if (!estado.pagamentoRetido) {
    return estado.pagamento?.status === "retido"
      ? estado.pagamento.valor
      : 0;
  }
  return estado.pagamentoRetido.itens
    .filter((i) => i.status === "retido")
    .reduce((acc, i) => acc + i.valor, 0);
}

export function valorLiberadoPagamentoRetido(estado: PagamentoFluxoEstado): number {
  if (!estado.pagamentoRetido) {
    return estado.pagamento?.status === "liberado"
      ? estado.pagamento.valor
      : 0;
  }
  return estado.pagamentoRetido.itens
    .filter((i) => i.status === "liberado")
    .reduce((acc, i) => acc + i.valor, 0);
}

export function diasRestantesLiberacao(ciclo: CamposCicloEntrega): number {
  if (
    ciclo.statusEntrega !== "entregue" ||
    !ciclo.prazoLiberacaoAutomatica
  ) {
    return 0;
  }
  return diasUteisRestantesAte(ciclo.prazoLiberacaoAutomatica);
}

/** @deprecated use DIAS_UTEIS_LIBERACAO_AUTOMATICA */
export function prazoConfirmacaoAutomaticaDias(): number {
  return DIAS_UTEIS_LIBERACAO_AUTOMATICA;
}

/** @deprecated use diasRestantesLiberacao */
export function diasRestantesConfirmacaoAutomatica(
  ciclo?: CamposCicloEntrega,
): number {
  if (ciclo) return diasRestantesLiberacao(ciclo);
  return DIAS_UTEIS_LIBERACAO_AUTOMATICA;
}

export function obterCicloDoAlvo(
  estado: PagamentoFluxoEstado,
  alvo: AlvoEntrega,
): CamposCicloEntrega {
  if (alvo.origem === "contrato") return estado.contrato;
  return (
    estado.aditivos.find((a) => a.id === alvo.id) ??
    camposCicloEntregaIniciais()
  );
}

export function itemPagamentoRetidoDoAlvo(
  estado: PagamentoFluxoEstado,
  alvo: AlvoEntrega,
): PagamentoRetidoItem | undefined {
  return estado.pagamentoRetido?.itens.find(
    (i) => i.origem === alvo.origem && i.referenciaId === alvo.id,
  );
}

export function podeSolicitarAditivo(contrato: Contrato): boolean {
  return (
    STATUS_CONTRATO_PERMITE_ADITIVO.has(contrato.status) &&
    contrato.status !== "cancelado" &&
    contrato.status !== "em_disputa"
  );
}

/**
 * Empresa propõe serviço adicional (aguarda aceite do influenciador).
 */
export function solicitarAditivo(
  estado: PagamentoFluxoEstado,
  dados: { escopo: string; valor: number; prazoEntrega: string },
): PagamentoFluxoEstado {
  if (!podeSolicitarAditivo(estado.contrato)) return estado;
  const valor = Math.round(dados.valor * 100) / 100;
  if (valor <= 0 || !dados.escopo.trim() || !dados.prazoEntrega.trim()) {
    return estado;
  }

  const aditivo: Aditivo = {
    id: novoId("adit"),
    contratoId: estado.contratoId,
    valor,
    escopo: dados.escopo.trim(),
    prazoEntrega: dados.prazoEntrega.trim(),
    criadoEm: new Date().toISOString(),
    status: "proposto",
    ...camposCicloEntregaIniciais(),
  };

  return {
    ...estado,
    aditivos: [...estado.aditivos, aditivo],
  };
}

/**
 * Influenciador aceita o aditivo. Se o contrato estava `concluida`, reabre
 * para `em_andamento`. Pagamento retido do aditivo só após depósito da empresa.
 */
export function aceitarAditivo(
  estado: PagamentoFluxoEstado,
  aditivoId: string,
): PagamentoFluxoEstado {
  const aditivo = estado.aditivos.find((a) => a.id === aditivoId);
  if (!aditivo || aditivo.status !== "proposto") return estado;

  const reabrir = estado.contrato.status === "concluida";
  const statusContrato = reabrir
    ? ("em_andamento" as const)
    : estado.contrato.status;

  if (reabrir) {
    sincronizarStatusContratoRegistrado(estado.contratoId, statusContrato);
  }

  return {
    ...estado,
    aditivos: estado.aditivos.map((a) =>
      a.id === aditivoId ? { ...a, status: "aceito" as const } : a,
    ),
    contrato: {
      ...estado.contrato,
      status: statusContrato,
    },
  };
}

export function recusarAditivo(
  estado: PagamentoFluxoEstado,
  aditivoId: string,
): PagamentoFluxoEstado {
  return {
    ...estado,
    aditivos: estado.aditivos.map((a) =>
      a.id === aditivoId && a.status === "proposto"
        ? { ...a, status: "cancelado" as const }
        : a,
    ),
  };
}

/**
 * Empresa deposita o valor de um aditivo já aceito — cria item no pagamento retido
 * e passa o aditivo para `ativo` (ciclo de entrega).
 */
export function registrarDepositoAditivo(
  estado: PagamentoFluxoEstado,
  aditivoId: string,
): PagamentoFluxoEstado {
  const aditivo = estado.aditivos.find((a) => a.id === aditivoId);
  if (!aditivo || aditivo.status !== "aceito") return estado;

  const jaExiste = estado.pagamentoRetido?.itens.some(
    (i) => i.origem === "aditivo" && i.referenciaId === aditivoId,
  );
  if (jaExiste) return estado;

  const item: PagamentoRetidoItem = {
    id: novoId("pagamento-retido-item"),
    origem: "aditivo",
    referenciaId: aditivoId,
    valor: aditivo.valor,
    status: "retido",
  };

  const pagamentoRetido: PagamentoRetido = estado.pagamentoRetido
    ? { ...estado.pagamentoRetido, itens: [...estado.pagamentoRetido.itens, item] }
    : {
        id: novoId("pagamento-retido"),
        contratoId: estado.contratoId,
        itens: [item],
      };

  if (estado.contrato.status === "concluida") {
    sincronizarStatusContratoRegistrado(estado.contratoId, "em_andamento");
  }

  return {
    ...estado,
    pagamentoRetido,
    aditivos: estado.aditivos.map((a) =>
      a.id === aditivoId ? { ...a, status: "ativo" as const } : a,
    ),
    contrato: {
      ...estado.contrato,
      status:
        estado.contrato.status === "concluida"
          ? "em_andamento"
          : estado.contrato.status,
    },
  };
}

export type { Aditivo };
