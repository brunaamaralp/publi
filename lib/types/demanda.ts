export type Demanda = {
  id: string;
  empresaId: string;
  titulo: string;
  briefing: string;
  orcamento: number;
  formatoEntrega: "reels" | "stories" | "post_feed" | "unboxing" | "live";
  prazo: string;
  status: "aberta" | "em_negociacao" | "fechada" | "cancelada";
};

export type PublicoAlvoDemanda = {
  dimensao: "genero" | "faixa_etaria" | "localidade";
  valor: string;
};

export type Match = {
  id: string;
  demandaId: string;
  influenciadorId: string;
  score: number; // 0-100
  status: "sugerido" | "aceito" | "recusado" | "expirado";
};
