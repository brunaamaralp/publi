export type Demanda = {
  id: string;
  empresaId: string;
  titulo: string;
  briefing: string;
  orcamento: number;
  /** Categoria/nicho da campanha (catálogo em `CATEGORIAS_CATALOGO`). */
  nichoId?: string;
  formatoEntrega: "reels" | "stories" | "post_feed" | "unboxing" | "live";
  prazo: string;
  status:
    | "rascunho"
    | "aberta"
    | "em_negociacao"
    | "em_andamento"
    | "fechada"
    | "cancelada";
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
