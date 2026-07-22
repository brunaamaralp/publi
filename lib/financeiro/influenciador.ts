import { INFLUENCIADOR_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import { estadoPagamentoSeed } from "@/lib/mock-data/contratos-pagamento";
import { RECEITA_MENSAL_MOCK } from "@/lib/mock-data/financeiro";
import { listarContextosInfluenciador } from "@/lib/financeiro/contratos-influenciador";
import { diasUteisRestantesAte } from "@/lib/pagamento/dias-uteis";
import type { PagamentoFluxoEstado } from "@/lib/pagamento/pagamento-types";
import {
  carregarPagamentoEstado,
  diasRestantesLiberacao,
  processarLiberacoesAutomaticas,
  salvarPagamentoEstado,
  valorRetidoPagamentoRetido,
} from "@/lib/pagamento/pagamento-utils";
import { creditarSaldoDisponivel } from "@/lib/pagamento/saldo-influenciador";
import type { CamposCicloEntrega, PagamentoRetidoItem } from "@/lib/types";

import type {
  PainelFinanceiroInfluenciador,
  ProximaLiberacao,
  ReceitaMensal,
  ResumoFinanceiro,
  TransacaoFinanceira,
} from "@/lib/financeiro/types";

export { listarContextosInfluenciador } from "@/lib/financeiro/contratos-influenciador";

const MESES_LABEL: Record<number, string> = {
  0: "Jan",
  1: "Fev",
  2: "Mar",
  3: "Abr",
  4: "Mai",
  5: "Jun",
  6: "Jul",
  7: "Ago",
  8: "Set",
  9: "Out",
  10: "Nov",
  11: "Dez",
};

/**
 * Processa liberações automáticas vencidas e credita saldo.
 * Deve rodar no client (localStorage).
 */
export function processarLiberacoesPainelInfluenciador(
  influenciadorId: string = INFLUENCIADOR_MOCK_ID,
): void {
  for (const ctx of listarContextosInfluenciador(influenciadorId)) {
    const estado =
      carregarPagamentoEstado(ctx.contrato.id) ??
      estadoPagamentoSeed(ctx.contrato.id);
    if (!estado) continue;

    const antes = valorRetidoPagamentoRetido(estado);
    const next = processarLiberacoesAutomaticas(estado);
    const depois = valorRetidoPagamentoRetido(next);
    if (depois < antes) {
      creditarSaldoDisponivel(ctx.influenciador.id, antes - depois);
      salvarPagamentoEstado(next);
    }
  }
}

function mesAnoDe(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function dataReferenciaItem(
  estado: PagamentoFluxoEstado,
  item: PagamentoRetidoItem,
): string {
  if (item.origem === "contrato") {
    return (
      estado.contrato.dataEntrega ??
      estado.contrato.dataAssinatura ??
      estado.pagamento?.id ??
      new Date().toISOString()
    );
  }
  const aditivo = estado.aditivos.find((a) => a.id === item.referenciaId);
  return (
    aditivo?.dataEntrega ??
    aditivo?.criadoEm ??
    estado.contrato.dataAssinatura ??
    new Date().toISOString()
  );
}

function cicloDoItem(
  estado: PagamentoFluxoEstado,
  item: PagamentoRetidoItem,
): CamposCicloEntrega {
  if (item.origem === "contrato") return estado.contrato;
  return (
    estado.aditivos.find((a) => a.id === item.referenciaId) ?? estado.contrato
  );
}

function statusExibicaoItem(
  estado: PagamentoFluxoEstado,
  item: PagamentoRetidoItem,
): TransacaoFinanceira["statusPagamento"] {
  const ciclo = cicloDoItem(estado, item);
  if (ciclo.statusEntrega === "em_disputa" || ciclo.disputa) {
    return "em_disputa";
  }
  return item.status;
}

function janelaUltimosMeses(quantidade: number, agora = new Date()): ReceitaMensal[] {
  const meses: ReceitaMensal[] = [];
  for (let i = quantidade - 1; i >= 0; i -= 1) {
    const d = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth() - i, 1));
    const mesAno = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    meses.push({
      mesLabel: MESES_LABEL[d.getUTCMonth()] ?? mesAno,
      mesAno,
      receita: 0,
    });
  }
  return meses;
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

/**
 * Agrega KPIs, ledger, gráfico e próximas liberações a partir do escrow.
 * Meses sem liberação usam seed histórico como fallback de demo.
 */
export function agregarPainelFinanceiroInfluenciador(
  influenciadorId: string = INFLUENCIADOR_MOCK_ID,
  agora: Date = new Date(),
): PainelFinanceiroInfluenciador {
  const contextos = listarContextosInfluenciador(influenciadorId);
  const mesAtual = mesAnoDe(agora.toISOString());
  const mesAnteriorDate = new Date(
    Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth() - 1, 1),
  );
  const mesAnterior = mesAnoDe(mesAnteriorDate.toISOString());

  const liberadoPorMes = new Map<string, number>();
  const transacoes: TransacaoFinanceira[] = [];
  const proximasLiberacoes: ProximaLiberacao[] = [];
  let ganhosMesAtual = 0;
  let ganhosMesAnterior = 0;
  const contratosLiberadosMes = new Set<string>();
  let somaTicketMes = 0;

  for (const ctx of contextos) {
    const estado = carregarPagamentoEstado(ctx.contrato.id);
    if (!estado) continue;

    const itens = estado.pagamentoRetido?.itens;
    if (itens && itens.length > 0) {
      for (const item of itens) {
        const data = dataReferenciaItem(estado, item);
        const status = statusExibicaoItem(estado, item);
        transacoes.push({
          id: `${estado.contratoId}-${item.id}`,
          data,
          empresaNome: ctx.empresa.nome,
          valor: item.valor,
          statusPagamento: status,
          contratoId: estado.contratoId,
          demandaTitulo: ctx.demandaTitulo,
        });

        if (item.status === "liberado") {
          const mes = mesAnoDe(data);
          liberadoPorMes.set(mes, (liberadoPorMes.get(mes) ?? 0) + item.valor);
          if (mes === mesAtual) {
            ganhosMesAtual += item.valor;
            contratosLiberadosMes.add(estado.contratoId);
            somaTicketMes += item.valor;
          }
          if (mes === mesAnterior) ganhosMesAnterior += item.valor;
        }

        if (
          item.status === "retido" &&
          cicloDoItem(estado, item).statusEntrega === "entregue"
        ) {
          const ciclo = cicloDoItem(estado, item);
          if (ciclo.prazoLiberacaoAutomatica) {
            proximasLiberacoes.push({
              id: `${estado.contratoId}-${item.id}`,
              contratoId: estado.contratoId,
              empresaNome: ctx.empresa.nome,
              demandaTitulo: ctx.demandaTitulo,
              valor: item.valor,
              prazoLiberacaoAutomatica: ciclo.prazoLiberacaoAutomatica,
              diasUteisRestantes: diasRestantesLiberacao(ciclo),
            });
          }
        }
      }
    } else if (estado.pagamento) {
      const data =
        estado.contrato.dataEntrega ??
        estado.contrato.dataAssinatura ??
        agora.toISOString();
      const status =
        estado.contrato.statusEntrega === "em_disputa" || estado.contrato.disputa
          ? "em_disputa"
          : estado.pagamento.status;
      transacoes.push({
        id: `${estado.contratoId}-${estado.pagamento.id}`,
        data,
        empresaNome: ctx.empresa.nome,
        valor: estado.pagamento.valor,
        statusPagamento: status,
        contratoId: estado.contratoId,
        demandaTitulo: ctx.demandaTitulo,
      });
      if (estado.pagamento.status === "liberado") {
        const mes = mesAnoDe(data);
        liberadoPorMes.set(mes, (liberadoPorMes.get(mes) ?? 0) + estado.pagamento.valor);
        if (mes === mesAtual) {
          ganhosMesAtual += estado.pagamento.valor;
          contratosLiberadosMes.add(estado.contratoId);
          somaTicketMes += estado.pagamento.valor;
        }
        if (mes === mesAnterior) ganhosMesAnterior += estado.pagamento.valor;
      }
      if (
        estado.pagamento.status === "retido" &&
        estado.contrato.statusEntrega === "entregue" &&
        estado.contrato.prazoLiberacaoAutomatica
      ) {
        proximasLiberacoes.push({
          id: `${estado.contratoId}-pag`,
          contratoId: estado.contratoId,
          empresaNome: ctx.empresa.nome,
          demandaTitulo: ctx.demandaTitulo,
          valor: estado.pagamento.valor,
          prazoLiberacaoAutomatica: estado.contrato.prazoLiberacaoAutomatica,
          diasUteisRestantes: diasUteisRestantesAte(
            estado.contrato.prazoLiberacaoAutomatica,
            agora,
          ),
        });
      }
    }
  }

  transacoes.sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
  );
  proximasLiberacoes.sort(
    (a, b) => a.diasUteisRestantes - b.diasUteisRestantes,
  );

  const variacaoMesAnterior =
    ganhosMesAnterior > 0
      ? arredondar(((ganhosMesAtual - ganhosMesAnterior) / ganhosMesAnterior) * 100)
      : ganhosMesAtual > 0
        ? 100
        : 0;

  const contratosConcluidosMes = contratosLiberadosMes.size;

  const ticketMedio =
    contratosConcluidosMes > 0
      ? arredondar(somaTicketMes / contratosConcluidosMes)
      : 0;

  const diaDoMes = agora.getUTCDate();
  const diasNoMes = new Date(
    Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth() + 1, 0),
  ).getUTCDate();
  const projecaoMes =
    diaDoMes > 0
      ? arredondar((ganhosMesAtual / diaDoMes) * diasNoMes)
      : ganhosMesAtual;

  const resumo: ResumoFinanceiro = {
    ganhosMesAtual: arredondar(ganhosMesAtual),
    variacaoMesAnterior,
    contratosConcluidosMes,
    ticketMedio,
    projecaoMes,
  };

  const receitaMensal = janelaUltimosMeses(6, agora).map((slot) => {
    const live = liberadoPorMes.get(slot.mesAno) ?? 0;
    if (live > 0) {
      return { ...slot, receita: arredondar(live) };
    }
    const seed = RECEITA_MENSAL_MOCK.find((m) => m.mesAno === slot.mesAno);
    // Mês atual: só dado live (mesmo que zero). Passado: seed de demo.
    if (slot.mesAno === mesAtual) {
      return { ...slot, receita: 0 };
    }
    return { ...slot, receita: seed?.receita ?? 0 };
  });

  return {
    resumo,
    receitaMensal,
    transacoes,
    proximasLiberacoes,
  };
}
