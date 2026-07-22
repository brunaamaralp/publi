import { EMPRESA_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import {
  CONTRATOS_PAGAMENTO_MOCK,
  getContratoPagamentoContexto,
} from "@/lib/mock-data/contratos-pagamento";
import { listarContextosPagamentoRegistrados } from "@/lib/pagamento/contrato-pagamento-registro";
import type { ContratoPagamentoContexto } from "@/lib/pagamento/pagamento-types";

/** Contextos de pagamento da empresa (seeds + registros locais). */
export function listarContextosEmpresa(
  empresaId: string = EMPRESA_MOCK_ID,
): ContratoPagamentoContexto[] {
  const porId = new Map<string, ContratoPagamentoContexto>();

  for (const ctx of Object.values(CONTRATOS_PAGAMENTO_MOCK)) {
    if (ctx.empresa.id === empresaId) {
      porId.set(ctx.contrato.id, ctx);
    }
  }

  for (const ctx of listarContextosPagamentoRegistrados()) {
    if (ctx.empresa.id === empresaId) {
      porId.set(
        ctx.contrato.id,
        getContratoPagamentoContexto(ctx.contrato.id) ?? ctx,
      );
    }
  }

  return Array.from(porId.values());
}
