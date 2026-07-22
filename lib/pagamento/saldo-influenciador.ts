/**
 * Saldo disponível para saque do influenciador (valores já liberados do pagamento retido).
 * Persistido em localStorage — mock sem backend.
 */

import type { SaldoInfluenciador } from "@/lib/pagamento/pagamento-types";
import {
  CONTRATO_APROVADO_ID,
  CONTRATO_AJUSTE_ID,
  CONTRATO_CPF_ID,
  CONTRATO_ENTREGUE_ID,
  getContratoPagamentoContexto,
} from "@/lib/mock-data/contratos-pagamento";
import {
  carregarPagamentoEstado,
  valorLiberadoPagamentoRetido,
  valorRetidoPagamentoRetido,
} from "@/lib/pagamento/pagamento-utils";
import { INFLUENCIADOR_MOCK_ID } from "@/lib/mock-data/avaliacoes";

const STORAGE_KEY = "influenciador-saldo-v1";

type SaldoStore = Record<
  string,
  { disponivel: number; sacadoTotal: number }
>;

function lerStore(): SaldoStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SaldoStore) : {};
  } catch {
    return {};
  }
}

function gravarStore(store: SaldoStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

/** Credita valor liberado do pagamento retido no saldo disponível. */
export function creditarSaldoDisponivel(
  influenciadorId: string,
  valor: number,
): void {
  if (valor <= 0) return;
  const store = lerStore();
  const atual = store[influenciadorId] ?? { disponivel: 0, sacadoTotal: 0 };
  store[influenciadorId] = {
    ...atual,
    disponivel: Math.round((atual.disponivel + valor) * 100) / 100,
  };
  gravarStore(store);
}

export function sacarSaldoDisponivel(
  influenciadorId: string,
  valor: number,
): { ok: true; disponivel: number } | { ok: false; motivo: string } {
  const store = lerStore();
  const atual = store[influenciadorId] ?? { disponivel: 0, sacadoTotal: 0 };
  if (valor <= 0) return { ok: false, motivo: "Informe um valor válido." };
  if (valor > atual.disponivel + 0.001) {
    return { ok: false, motivo: "Valor acima do saldo disponível." };
  }
  const nextDisponivel = Math.round((atual.disponivel - valor) * 100) / 100;
  store[influenciadorId] = {
    disponivel: nextDisponivel,
    sacadoTotal: Math.round((atual.sacadoTotal + valor) * 100) / 100,
  };
  gravarStore(store);
  return { ok: true, disponivel: nextDisponivel };
}

/**
 * Soma retido/liberado dos contratos do influenciador + créditos de liberação.
 */
export function calcularSaldoInfluenciador(
  influenciadorId: string = INFLUENCIADOR_MOCK_ID,
): SaldoInfluenciador {
  const ids = [
    CONTRATO_CPF_ID,
    CONTRATO_APROVADO_ID,
    CONTRATO_AJUSTE_ID,
    CONTRATO_ENTREGUE_ID,
  ];

  let retido = 0;
  let liberadoNosContratos = 0;

  for (const id of ids) {
    const ctx = getContratoPagamentoContexto(id);
    if (!ctx || ctx.influenciador.id !== influenciadorId) continue;
    const estado = carregarPagamentoEstado(id);
    if (!estado) continue;
    retido += valorRetidoPagamentoRetido(estado);
    liberadoNosContratos += valorLiberadoPagamentoRetido(estado);
  }

  const store = lerStore();
  const local = store[influenciadorId] ?? { disponivel: 0, sacadoTotal: 0 };

  // Preferir crédito explícito (aprovações/auto); senão, espelhar liberado nos contratos.
  const disponivel =
    local.disponivel > 0 || local.sacadoTotal > 0
      ? local.disponivel
      : liberadoNosContratos;

  return {
    disponivel,
    retido,
    totalLiberadoHistorico: Math.max(
      liberadoNosContratos,
      local.disponivel + local.sacadoTotal,
    ),
  };
}
