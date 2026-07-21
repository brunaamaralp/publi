import type { Contrato } from "@/lib/types";

/** Resolve a rota de pagamento para o contrato assinado (mesmo id / mesmos termos). */
export function hrefPagamentoContrato(contrato: Contrato): string {
  return `/contrato/${contrato.id}/pagamento`;
}
