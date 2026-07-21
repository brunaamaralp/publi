import type { Usuario } from "@/lib/types/usuario";

/** Rota de listagem principal ao sair de fluxos compartilhados (negociação, pagamento). */
export function rotaListaPorPapel(tipo: Usuario["tipo"]): string {
  switch (tipo) {
    case "influenciador":
      return "/influenciador/demandas";
    case "empresa":
    case "agencia":
      return "/empresa/demandas";
    default:
      return "/inicio";
  }
}

export function rotuloVoltarPorPapel(tipo: Usuario["tipo"]): string {
  switch (tipo) {
    case "influenciador":
      return "Voltar às oportunidades";
    case "empresa":
    case "agencia":
      return "Voltar às campanhas";
    default:
      return "Voltar ao início";
  }
}

/** Rota de retorno específica do fluxo de pagamento. */
export function rotaVoltarPagamento(tipo: Usuario["tipo"]): string {
  if (tipo === "influenciador") return "/influenciador/financeiro";
  if (tipo === "empresa" || tipo === "agencia") return "/empresa/demandas";
  return "/inicio";
}
