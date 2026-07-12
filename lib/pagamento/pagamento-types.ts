import type { Contrato, Entrega, Pagamento, Rpa } from "@/lib/types";

export type DocumentoTipo = "cpf" | "cnpj";

export type PapelPagamento = "empresa" | "influenciador";

export type ContratoPagamentoContexto = {
  contrato: Contrato;
  empresa: {
    id: string;
    nome: string;
    usuarioId: string;
  };
  influenciador: {
    id: string;
    nome: string;
    usuarioId: string;
    documentoTipo: DocumentoTipo;
  };
  demandaTitulo: string;
};

export type PagamentoFluxoEstado = {
  contratoId: string;
  contrato: Contrato;
  pagamento: Pagamento | null;
  rpa: Rpa | null;
  entrega: Entrega | null;
  /** Preview local do print opcional (não persiste no tipo Entrega). */
  printEntregaPreview?: string;
};

export type CalculoRpa = {
  valorBruto: number;
  inssRetido: number;
  irrfRetido: number;
  issRetido: number;
  valorLiquido: number;
};
