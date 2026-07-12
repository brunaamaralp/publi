import type { Entrega, Pagamento, Rpa } from "@/lib/types";

import { getContratoPagamentoContexto } from "@/lib/mock-data/contratos-pagamento";
import type {
  CalculoRpa,
  ContratoPagamentoContexto,
  PagamentoFluxoEstado,
} from "@/lib/pagamento/pagamento-types";

const STORAGE_PREFIX = "pagamento-estado-";

const DIAS_CONFIRMACAO_AUTOMATICA = 7;
const DIAS_RESTANTES_MOCK = 6;

function storageKey(contratoId: string) {
  return `${STORAGE_PREFIX}${contratoId}`;
}

export function calcularRpa(valorBruto: number): CalculoRpa {
  const inssRetido = Math.round(valorBruto * 0.11 * 100) / 100;
  const irrfRetido = valorBruto < 5000 ? 0 : Math.round(valorBruto * 0.015 * 100) / 100;
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

function criarEstadoInicial(ctx: ContratoPagamentoContexto): PagamentoFluxoEstado {
  return {
    contratoId: ctx.contrato.id,
    contrato: { ...ctx.contrato },
    pagamento: null,
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
    return criarEstadoInicial(ctx);
  }

  try {
    return JSON.parse(salvo) as PagamentoFluxoEstado;
  } catch {
    return criarEstadoInicial(ctx);
  }
}

export function salvarPagamentoEstado(estado: PagamentoFluxoEstado) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(estado.contratoId), JSON.stringify(estado));
}

export function registrarDeposito(
  estado: PagamentoFluxoEstado,
  ctx: ContratoPagamentoContexto,
  municipioRpa?: string,
): PagamentoFluxoEstado {
  const pagamento: Pagamento = {
    id: crypto.randomUUID(),
    contratoId: estado.contratoId,
    valor: estado.contrato.valor,
    status: "retido",
  };

  let rpa: Rpa | null = null;
  if (ctx.influenciador.documentoTipo === "cpf" && municipioRpa) {
    const calculo = calcularRpa(estado.contrato.valor);
    rpa = {
      id: crypto.randomUUID(),
      pagamentoId: pagamento.id,
      empresaId: ctx.empresa.id,
      influenciadorId: ctx.influenciador.id,
      municipioReferencia: municipioRpa,
      ...calculo,
      status: "confirmado_pela_empresa",
    };
  }

  return {
    ...estado,
    pagamento,
    rpa,
    contrato: { ...estado.contrato, status: "em_execucao" },
  };
}

export function registrarEntrega(
  estado: PagamentoFluxoEstado,
  linkComprovante: string,
  printPreview?: string,
): PagamentoFluxoEstado {
  const entrega: Entrega = {
    id: crypto.randomUUID(),
    contratoId: estado.contratoId,
    linkComprovante,
    dataEntrega: new Date().toISOString(),
    statusConfirmacao: "aguardando",
  };

  return {
    ...estado,
    entrega,
    printEntregaPreview: printPreview,
  };
}

export function confirmarEntrega(
  estado: PagamentoFluxoEstado,
): PagamentoFluxoEstado {
  if (!estado.pagamento || !estado.entrega) return estado;

  return {
    ...estado,
    pagamento: { ...estado.pagamento, status: "liberado" },
    entrega: { ...estado.entrega, statusConfirmacao: "confirmada" },
    contrato: { ...estado.contrato, status: "cumprido" },
  };
}

export function valorExibicaoPagamento(estado: PagamentoFluxoEstado): number {
  if (estado.rpa) return estado.rpa.valorLiquido;
  return estado.pagamento?.valor ?? estado.contrato.valor;
}

export function diasRestantesConfirmacaoAutomatica(): number {
  return DIAS_RESTANTES_MOCK;
}

export function prazoConfirmacaoAutomaticaDias(): number {
  return DIAS_CONFIRMACAO_AUTOMATICA;
}
