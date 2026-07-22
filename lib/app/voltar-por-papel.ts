import type { Usuario } from "@/lib/types/usuario";

/** Rota de listagem principal ao sair de fluxos compartilhados (negociação, pagamento). */
export function rotaListaPorPapel(tipo: Usuario["tipo"]): string {
  switch (tipo) {
    case "influenciador":
      return "/influenciador/demandas";
    case "empresa":
      return "/empresa/demandas";
    case "agencia":
      return "/agencia/demandas";
    default:
      return "/inicio";
  }
}

export function rotuloVoltarPorPapel(tipo: Usuario["tipo"]): string {
  switch (tipo) {
    case "influenciador":
      return "Voltar às oportunidades";
    case "empresa":
      return "Voltar às campanhas";
    case "agencia":
      return "Voltar às campanhas do cliente";
    default:
      return "Voltar ao início";
  }
}

/** Rota de retorno específica do fluxo de pagamento. */
export function rotaVoltarPagamento(tipo: Usuario["tipo"]): string {
  if (tipo === "influenciador") return "/influenciador/financeiro";
  if (tipo === "empresa") return "/empresa/demandas";
  if (tipo === "agencia") return "/agencia/demandas";
  return "/inicio";
}
