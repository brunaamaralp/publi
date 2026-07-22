import { agregarPainelFinanceiroEmpresa } from "@/lib/financeiro/empresa";
import type {
  EscopoFinanceiroAgencia,
  GastoMensal,
  PainelFinanceiroAgencia,
  PainelFinanceiroEmpresa,
  ResumoFinanceiroClienteAgencia,
  ResumoFinanceiroEmpresaPainel,
  TransacaoFinanceiraEmpresa,
} from "@/lib/financeiro/types";
import { EMPRESA_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import { listarAcoesPendentesDashboardEmpresa } from "@/lib/empresa/dashboard-utils";
import { EMPRESA_NEGOCIACAO_USUARIO_ID } from "@/lib/negociacao/negociacao-constantes";

/**
 * Na demo, Glow Cosmetics do login empresa (`emp-mock-001`) é a mesma marca
 * que o cliente de agência `emp-plat-001`.
 */
const ALIASES_ESCROW: Record<string, string[]> = {
  "emp-plat-001": [EMPRESA_MOCK_ID],
  [EMPRESA_MOCK_ID]: ["emp-plat-001"],
};

export function idsEscrowParaEmpresa(empresaId: string): string[] {
  const aliases = ALIASES_ESCROW[empresaId] ?? [];
  return Array.from(new Set([empresaId, ...aliases]));
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

function mesclarPainelEmpresa(
  paineis: PainelFinanceiroEmpresa[],
): PainelFinanceiroEmpresa {
  if (paineis.length === 0) {
    return agregarPainelFinanceiroEmpresa("__vazio__");
  }
  if (paineis.length === 1) return paineis[0]!;

  const transacoesMap = new Map<string, TransacaoFinanceiraEmpresa>();
  for (const p of paineis) {
    for (const tx of p.transacoes) {
      transacoesMap.set(tx.id, tx);
    }
  }
  const transacoes = Array.from(transacoesMap.values()).sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
  );

  const gastoPorMes = new Map<string, GastoMensal>();
  for (const p of paineis) {
    for (const slot of p.gastoMensal) {
      const atual = gastoPorMes.get(slot.mesAno);
      if (!atual) {
        gastoPorMes.set(slot.mesAno, { ...slot });
      } else {
        gastoPorMes.set(slot.mesAno, {
          ...atual,
          receita: arredondar(atual.receita + slot.receita),
        });
      }
    }
  }
  const gastoMensal = Array.from(gastoPorMes.values()).sort((a, b) =>
    a.mesAno.localeCompare(b.mesAno),
  );

  const investidoMes = arredondar(
    paineis.reduce((acc, p) => acc + p.resumo.investidoMes, 0),
  );
  const retido = arredondar(paineis.reduce((acc, p) => acc + p.resumo.retido, 0));
  const liberadoMes = arredondar(
    paineis.reduce((acc, p) => acc + p.resumo.liberadoMes, 0),
  );
  const contratosAtivos = paineis.reduce(
    (acc, p) => acc + p.resumo.contratosAtivos,
    0,
  );

  // Variação: média ponderada pelo investido do mês anterior implícito.
  let somaPeso = 0;
  let somaVariacaoPonderada = 0;
  for (const p of paineis) {
    const peso = Math.max(p.resumo.investidoMes, 1);
    somaPeso += peso;
    somaVariacaoPonderada += p.resumo.variacaoMesAnterior * peso;
  }
  const variacaoMesAnterior = arredondar(somaVariacaoPonderada / somaPeso);

  const ticketMedio =
    contratosAtivos > 0 ? arredondar(investidoMes / contratosAtivos) : 0;

  const resumo: ResumoFinanceiroEmpresaPainel = {
    investidoMes,
    retido,
    liberadoMes,
    ticketMedio,
    contratosAtivos,
    variacaoMesAnterior,
  };

  return { resumo, gastoMensal, transacoes };
}

export function agregarPainelEmpresaComAliases(
  empresaId: string,
): PainelFinanceiroEmpresa {
  const ids = idsEscrowParaEmpresa(empresaId);
  return mesclarPainelEmpresa(ids.map((id) => agregarPainelFinanceiroEmpresa(id)));
}

export type ClienteFinanceiroInput = {
  id: string;
  nome: string;
};

/**
 * Painel financeiro da agência: um cliente (com aliases de escrow) ou consolidado.
 */
export function agregarPainelFinanceiroAgencia(params: {
  escopo: EscopoFinanceiroAgencia;
  clientes: ClienteFinanceiroInput[];
  empresaAtivaId: string | null;
}): PainelFinanceiroAgencia {
  const { escopo, clientes, empresaAtivaId } = params;

  const porCliente: ResumoFinanceiroClienteAgencia[] = clientes.map((c) => {
    const painel = agregarPainelEmpresaComAliases(c.id);
    const { total: pendencias } = listarAcoesPendentesDashboardEmpresa(
      c.id,
      EMPRESA_NEGOCIACAO_USUARIO_ID,
      0,
    );
    // Pendências do alias emp-mock também (Glow).
    let pendenciasExtra = 0;
    for (const alias of idsEscrowParaEmpresa(c.id)) {
      if (alias === c.id) continue;
      pendenciasExtra += listarAcoesPendentesDashboardEmpresa(
        alias,
        EMPRESA_NEGOCIACAO_USUARIO_ID,
        0,
      ).total;
    }

    return {
      empresaId: c.id,
      nome: c.nome,
      investidoMes: painel.resumo.investidoMes,
      retido: painel.resumo.retido,
      liberadoMes: painel.resumo.liberadoMes,
      contratosAtivos: painel.resumo.contratosAtivos,
      pendencias: pendencias + pendenciasExtra,
    };
  });

  if (escopo === "cliente" && empresaAtivaId) {
    const painel = agregarPainelEmpresaComAliases(empresaAtivaId);
    return {
      escopo: "cliente",
      painel,
      porCliente: porCliente.filter((c) => c.empresaId === empresaAtivaId),
    };
  }

  const painel = mesclarPainelEmpresa(
    clientes.map((c) => agregarPainelEmpresaComAliases(c.id)),
  );

  return {
    escopo: "todos",
    painel,
    porCliente,
  };
}
