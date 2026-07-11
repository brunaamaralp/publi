export type Treinamento = {
  id: string;
  titulo: string;
  categoria: string;
  nivelRequerido: number;
};

export type ProgressoTreinamento = {
  id: string;
  influenciadorId: string;
  treinamentoId: string;
  status: "nao_iniciado" | "em_andamento" | "concluido";
  dataConclusao?: string;
};
