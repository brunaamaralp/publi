export type ResultadoCampanha = {
  id: string;
  contratoId: string;
  influenciadorId: string;
  solicitadoPorUsuarioId?: string; // vazio se o influenciador cadastrou por conta própria
  status: "nao_solicitado" | "solicitado" | "preenchido" | "validado";
  impressoes?: number;
  alcance?: number;
  cliques?: number;
  engajamentoTotal?: number;
  taxaEngajamento?: number;
  linkComprovante?: string;
  observacoes?: string;
};
