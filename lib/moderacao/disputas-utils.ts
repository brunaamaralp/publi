import type { Mensagem } from "@/lib/types";
import type { NegociacaoContexto } from "@/lib/negociacao/negociacao-types";
import {
  CONTRATO_DISPUTA_MAFE_ID,
  CONTRATO_DISPUTA_NAO_ENTREGA_ID,
  CONTRATOS_PAGAMENTO_MOCK,
  estadoPagamentoSeed,
  getContratoPagamentoContexto,
} from "@/lib/mock-data/contratos-pagamento";
import { criarMensagensIniciais } from "@/lib/mock-data/negociacao";
import type {
  AlvoEntrega,
  ContratoPagamentoContexto,
  PagamentoFluxoEstado,
} from "@/lib/pagamento/pagamento-types";
import {
  carregarPagamentoEstado,
  disputaAberta,
  salvarPagamentoEstado,
} from "@/lib/pagamento/pagamento-utils";

export type CasoDisputa = {
  contratoId: string;
  alvo: AlvoEntrega;
  contexto: ContratoPagamentoContexto;
  estado: PagamentoFluxoEstado;
  tituloItem: string;
  valorItem: number;
};

const IDS_COM_DISPUTA_POSSIVEL = [
  CONTRATO_DISPUTA_NAO_ENTREGA_ID,
  CONTRATO_DISPUTA_MAFE_ID,
] as const;

/** IDs conhecidos + qualquer estado local com disputa aberta. */
export function listarCasosDisputaAbertos(): CasoDisputa[] {
  const ids = new Set<string>([
    ...IDS_COM_DISPUTA_POSSIVEL,
    ...Object.keys(CONTRATOS_PAGAMENTO_MOCK),
  ]);

  if (typeof window !== "undefined") {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("pagamento-estado-")) {
          ids.add(key.replace("pagamento-estado-", ""));
        }
      }
    } catch {
      // ignore
    }
  }

  const casos: CasoDisputa[] = [];

  for (const id of Array.from(ids)) {
    const ctx = getContratoPagamentoContexto(id);
    if (!ctx) continue;
    const estado = carregarPagamentoEstado(id) ?? estadoPagamentoSeed(id);
    if (!estado) continue;

    if (disputaAberta(estado.contrato)) {
      casos.push({
        contratoId: id,
        alvo: { origem: "contrato", id },
        contexto: ctx,
        estado,
        tituloItem: "Contrato base",
        valorItem: estado.contrato.valor,
      });
    }

    for (const aditivo of estado.aditivos) {
      if (!disputaAberta(aditivo)) continue;
      casos.push({
        contratoId: id,
        alvo: { origem: "aditivo", id: aditivo.id },
        contexto: ctx,
        estado,
        tituloItem: `Aditivo — ${aditivo.escopo.slice(0, 48)}`,
        valorItem: aditivo.valor,
      });
    }
  }

  return casos.sort((a, b) => {
    const da =
      (a.alvo.origem === "contrato"
        ? a.estado.contrato.disputa?.reportadoEm
        : a.estado.aditivos.find((x) => x.id === a.alvo.id)?.disputa
            ?.reportadoEm) ?? "";
    const db =
      (b.alvo.origem === "contrato"
        ? b.estado.contrato.disputa?.reportadoEm
        : b.estado.aditivos.find((x) => x.id === b.alvo.id)?.disputa
            ?.reportadoEm) ?? "";
    return db.localeCompare(da);
  });
}

export function persistirEstadoDisputa(estado: PagamentoFluxoEstado): void {
  salvarPagamentoEstado(estado);
}

/** Histórico de chat do match (somente leitura) para o admin. */
export function mensagensChatDoContrato(
  ctx: ContratoPagamentoContexto,
): Mensagem[] {
  const conversaId = `conv-disputa-${ctx.contrato.id}`;
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(
        `negociacao-estado-${ctx.contrato.matchId}`,
      );
      if (raw) {
        const neg = JSON.parse(raw) as { mensagens?: Mensagem[] };
        if (neg.mensagens?.length) return neg.mensagens;
      }
    }
  } catch {
    // fall through
  }

  const contextoFake: NegociacaoContexto = {
    match: {
      id: ctx.contrato.matchId,
      demandaId: "dem-disputa",
      influenciadorId: ctx.influenciador.id,
      score: 90,
      status: "aceito",
    },
    demanda: {
      id: "dem-disputa",
      empresaId: ctx.empresa.id,
      titulo: ctx.demandaTitulo,
      briefing: ctx.contrato.escopo,
      orcamento: ctx.contrato.valor,
      formatoEntrega: "reels",
      prazo: ctx.contrato.prazoEntrega,
      nichoId: "cat-beleza",
      status: "aberta",
    },
    influenciador: {
      id: ctx.influenciador.id,
      nome: ctx.influenciador.nome,
      nicho: "—",
      seguidores: 0,
      engajamentoMedio: 0,
      notaMedia: null,
      totalAvaliacoes: 0,
    },
    empresa: {
      id: ctx.empresa.id,
      nome: ctx.empresa.nome,
      usuarioId: ctx.empresa.usuarioId,
    },
    influenciadorUsuarioId: ctx.influenciador.usuarioId,
    taxaDesbloqueio: 0,
  };

  return criarMensagensIniciais(conversaId, contextoFake);
}
