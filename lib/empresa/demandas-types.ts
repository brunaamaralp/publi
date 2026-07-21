import type { AudienciaLinha } from "@/lib/influenciador/cadastro-types";
import type { Demanda, PublicoAlvoDemanda } from "@/lib/types";

export type DemandaPublicacaoDraft = {
  titulo: string;
  briefing: string;
  formatoEntrega: Demanda["formatoEntrega"] | "";
  nichoId: string;
  orcamento: number | "";
  prazo: string;
  publicoGenero: AudienciaLinha[];
  publicoFaixaEtaria: AudienciaLinha[];
  publicoLocalidade: AudienciaLinha[];
};

export type MinhaDemandaItem = {
  demanda: Demanda;
  publicoAlvo: PublicoAlvoDemanda[];
  matchesGerados: number;
  publicadoEm: string;
  /** Sinaliza que o orçamento mudou após matches já existirem. */
  matchesDesatualizados?: boolean;
};
