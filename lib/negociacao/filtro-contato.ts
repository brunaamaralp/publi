import type { Mensagem } from "@/lib/types";

const PADROES_BLOQUEIO: RegExp[] = [
  /\b\d{10,11}\b/,
  /\b\d{14}\b/,
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i,
  /@[\w.]{2,}/,
];

const TERMOS_AMBIGUOS = /\b(pix|zap|whatsapp|fora da plataforma)\b/i;

export type ResultadoFiltroContato = {
  podeEnviar: boolean;
  flag: Mensagem["flagContatoExterno"];
  motivoBloqueio?: string;
};

export function analisarTextoMensagem(texto: string): ResultadoFiltroContato {
  const normalizado = texto.trim();
  if (!normalizado) {
    return { podeEnviar: false, flag: "nenhum", motivoBloqueio: "Mensagem vazia" };
  }

  if (PADROES_BLOQUEIO.some((padrao) => padrao.test(normalizado))) {
    return {
      podeEnviar: false,
      flag: "bloqueado_padrao",
      motivoBloqueio: "Não é possível compartilhar contato externo pelo chat",
    };
  }

  if (TERMOS_AMBIGUOS.test(normalizado)) {
    return { podeEnviar: true, flag: "alerta_termo" };
  }

  return { podeEnviar: true, flag: "nenhum" };
}
