import { listarContextosEmpresa } from "@/lib/financeiro/contratos-empresa";
import type {
  GastoMensal,
  PainelFinanceiroEmpresa,
  ResumoFinanceiroEmpresaPainel,
  TransacaoFinanceiraEmpresa,
} from "@/lib/financeiro/types";
import { EMPRESA_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import { GASTO_MENSAL_EMPRESA_MOCK } from "@/lib/mock-data/financeiro";
import type { PagamentoFluxoEstado } from "@/lib/pagamento/pagamento-types";
import {
  carregarPagamentoEstado,
  valorRetidoPagamentoRetido,
} from "@/lib/pagamento/pagamento-utils";
import type { CamposCicloEntrega, PagamentoRetidoItem } from "@/lib/types";

export { listarContextosEmpresa } from "@/lib/financeiro/contratos-empresa";

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

function mesAnoDe(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

function janelaUltimosMeses(quantidade: number, agora = new Date()): GastoMensal[] {
  const meses: GastoMensal[] = [];
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

function dataReferenciaItem(
  estado: PagamentoFluxoEstado,
  item: PagamentoRetidoItem,
): string {
  if (item.origem === "contrato") {
    return (
      estado.contrato.dataAssinatura ??
      estado.contrato.dataEntrega ??
      new Date().toISOString()
    );
  }
  const aditivo = estado.aditivos.find((a) => a.id === item.referenciaId);
  return (
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
): TransacaoFinanceiraEmpresa["statusPagamento"] {
  const ciclo = cicloDoItem(estado, item);
  if (ciclo.statusEntrega === "em_disputa" || ciclo.disputa) {
    return "em_disputa";
  }
  return item.status;
}

/**
 * Agrega KPIs, ledger e tendência de investimento da empresa a partir do escrow.
 */
export function agregarPainelFinanceiroEmpresa(
  empresaId: string = EMPRESA_MOCK_ID,
  agora: Date = new Date(),
): PainelFinanceiroEmpresa {
  const contextos = listarContextosEmpresa(empresaId);
  const mesAtual = mesAnoDe(agora.toISOString());
  const mesAnteriorDate = new Date(
    Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth() - 1, 1),
  );
  const mesAnterior = mesAnoDe(mesAnteriorDate.toISOString());

  const investidoPorMes = new Map<string, number>();
  const liberadoPorMes = new Map<string, number>();
  const transacoes: TransacaoFinanceiraEmpresa[] = [];
  let retido = 0;
  let contratosAtivos = 0;
  let investidoMes = 0;
  let investidoMesAnterior = 0;
  let liberadoMes = 0;
  const contratosComMovimentoMes = new Set<string>();
  let somaTicketMes = 0;

  for (const ctx of contextos) {
    const estado = carregarPagamentoEstado(ctx.contrato.id);
    if (!estado) continue;

    const ativo =
      estado.contrato.status === "assinado" ||
      estado.contrato.status === "em_andamento" ||
      estado.contrato.status === "em_disputa";
    if (ativo) contratosAtivos += 1;

    retido += valorRetidoPagamentoRetido(estado);

    const itens = estado.pagamentoRetido?.itens;
    if (itens && itens.length > 0) {
      for (const item of itens) {
        const data = dataReferenciaItem(estado, item);
        const mes = mesAnoDe(data);
        const status = statusExibicaoItem(estado, item);

        transacoes.push({
          id: `${estado.contratoId}-${item.id}`,
          data,
          influenciadorNome: ctx.influenciador.nome,
          demandaTitulo: ctx.demandaTitulo,
          valor: item.valor,
          statusPagamento: status,
          contratoId: estado.contratoId,
        });

        // Investimento = valor depositado no escrow (qualquer status pós-depósito).
        investidoPorMes.set(mes, (investidoPorMes.get(mes) ?? 0) + item.valor);
        if (mes === mesAtual) {
          investidoMes += item.valor;
          contratosComMovimentoMes.add(estado.contratoId);
          somaTicketMes += item.valor;
        }
        if (mes === mesAnterior) investidoMesAnterior += item.valor;

        if (item.status === "liberado") {
          liberadoPorMes.set(mes, (liberadoPorMes.get(mes) ?? 0) + item.valor);
          if (mes === mesAtual) liberadoMes += item.valor;
        }
      }
    } else if (estado.pagamento) {
      const data =
        estado.contrato.dataAssinatura ??
        estado.contrato.dataEntrega ??
        agora.toISOString();
      const mes = mesAnoDe(data);
      const status =
        estado.contrato.statusEntrega === "em_disputa" || estado.contrato.disputa
          ? "em_disputa"
          : estado.pagamento.status;

      transacoes.push({
        id: `${estado.contratoId}-${estado.pagamento.id}`,
        data,
        influenciadorNome: ctx.influenciador.nome,
        demandaTitulo: ctx.demandaTitulo,
        valor: estado.pagamento.valor,
        statusPagamento: status,
        contratoId: estado.contratoId,
      });

      investidoPorMes.set(
        mes,
        (investidoPorMes.get(mes) ?? 0) + estado.pagamento.valor,
      );
      if (mes === mesAtual) {
        investidoMes += estado.pagamento.valor;
        contratosComMovimentoMes.add(estado.contratoId);
        somaTicketMes += estado.pagamento.valor;
      }
      if (mes === mesAnterior) investidoMesAnterior += estado.pagamento.valor;

      if (estado.pagamento.status === "liberado") {
        liberadoPorMes.set(
          mes,
          (liberadoPorMes.get(mes) ?? 0) + estado.pagamento.valor,
        );
        if (mes === mesAtual) liberadoMes += estado.pagamento.valor;
      }
    } else if (
      !estado.pagamento &&
      !estado.pagamentoRetido &&
      (estado.contrato.status === "assinado" ||
        estado.contrato.status === "em_andamento")
    ) {
      transacoes.push({
        id: `${estado.contratoId}-aguardando`,
        data: estado.contrato.dataAssinatura ?? agora.toISOString(),
        influenciadorNome: ctx.influenciador.nome,
        demandaTitulo: ctx.demandaTitulo,
        valor: estado.contrato.valor,
        statusPagamento: "aguardando_deposito",
        contratoId: estado.contratoId,
      });
    }
  }

  transacoes.sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
  );

  const contratosNoMes = contratosComMovimentoMes.size;
  const ticketMedio =
    contratosNoMes > 0 ? arredondar(somaTicketMes / contratosNoMes) : 0;

  const variacaoMesAnterior =
    investidoMesAnterior > 0
      ? arredondar(
          ((investidoMes - investidoMesAnterior) / investidoMesAnterior) * 100,
        )
      : investidoMes > 0
        ? 100
        : 0;

  const resumo: ResumoFinanceiroEmpresaPainel = {
    investidoMes: arredondar(investidoMes),
    retido: arredondar(retido),
    liberadoMes: arredondar(liberadoMes),
    ticketMedio,
    contratosAtivos,
    variacaoMesAnterior,
  };

  const gastoMensal = janelaUltimosMeses(6, agora).map((slot) => {
    const live = investidoPorMes.get(slot.mesAno) ?? 0;
    if (live > 0) {
      return { ...slot, receita: arredondar(live) };
    }
    const seed = GASTO_MENSAL_EMPRESA_MOCK.find((m) => m.mesAno === slot.mesAno);
    if (slot.mesAno === mesAtual) {
      return { ...slot, receita: 0 };
    }
    return { ...slot, receita: seed?.receita ?? 0 };
  });

  return {
    resumo,
    gastoMensal,
    transacoes,
  };
}
