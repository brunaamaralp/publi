export type Avaliacao = {
  id: string;
  contratoId: string;
  avaliadorId: string;
  avaliadoId: string;
  notaFornecedor: number; // 1 a 5
  comentario?: string;
  criadoEm: string; // ISO date
};
