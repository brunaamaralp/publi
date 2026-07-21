import type { Contrato } from "@/lib/types";
import type { NegociacaoContexto } from "@/lib/negociacao/negociacao-types";
import type {
  ContratoPagamentoContexto,
  DocumentoTipo,
} from "@/lib/pagamento/pagamento-types";

const STORAGE_KEY = "contratos-pagamento-registrados-v1";

const memoria: Record<string, ContratoPagamentoContexto> = {};
let hidratado = false;

function hidratar(): void {
  if (hidratado || typeof window === "undefined") return;
  hidratado = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, ContratoPagamentoContexto>;
    Object.assign(memoria, parsed);
  } catch {
    // ignore
  }
}

function persistir(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memoria));
}

/** Inferência demo: CPF dispara RPA; matches conhecidos CNPJ ficam sem RPA. */
function documentoTipoParaMatch(matchId: string): DocumentoTipo {
  if (matchId === "match-002") return "cnpj";
  return "cpf";
}

/**
 * Persiste o contexto de pagamento a partir do contrato assinado na negociação,
 * para o escrow usar os mesmos valor/escopo/prazo/status.
 */
export function registrarContextoPagamentoDeNegociacao(
  contrato: Contrato,
  contexto: NegociacaoContexto,
): ContratoPagamentoContexto {
  hidratar();

  const registro: ContratoPagamentoContexto = {
    contrato: { ...contrato },
    empresa: {
      id: contexto.empresa.id,
      nome: contexto.empresa.nome,
      usuarioId: contexto.empresa.usuarioId,
    },
    influenciador: {
      id: contexto.influenciador.id,
      nome: contexto.influenciador.nome,
      usuarioId: contexto.influenciadorUsuarioId,
      documentoTipo: documentoTipoParaMatch(contexto.match.id),
    },
    demandaTitulo: contexto.demanda.titulo,
  };

  memoria[contrato.id] = registro;
  persistir();
  return registro;
}

export function obterContextoPagamentoRegistrado(
  contratoId: string,
): ContratoPagamentoContexto | null {
  hidratar();
  return memoria[contratoId] ?? null;
}

/** Mantém contrato.status alinhado entre negociação e pagamento quando ambos existem. */
export function sincronizarStatusContratoRegistrado(
  contratoId: string,
  status: Contrato["status"],
): void {
  hidratar();
  const atual = memoria[contratoId];
  if (!atual) return;
  memoria[contratoId] = {
    ...atual,
    contrato: { ...atual.contrato, status },
  };
  persistir();
}
