import type {
  Aditivo,
  Contrato,
  Entrega,
  Pagamento,
  PagamentoRetido,
  Rpa,
} from "@/lib/types";

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
  /** Aditivos já depositados / em ciclo de entrega. */
  aditivos?: Aditivo[];
};

export type AlvoEntrega = {
  origem: "contrato" | "aditivo";
  /** Id do contrato ou do aditivo. */
  id: string;
};

export type PagamentoFluxoEstado = {
  contratoId: string;
  contrato: Contrato;
  pagamento: Pagamento | null;
  /** Pagamento retido itemizado (contrato + aditivos). Fonte de verdade para liberação. */
  pagamentoRetido: PagamentoRetido | null;
  aditivos: Aditivo[];
  rpa: Rpa | null;
  /** Última prova registrada (contrato ou aditivo). */
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

/** Saldo do influenciador para a tela financeira / saque. */
export type SaldoInfluenciador = {
  disponivel: number;
  retido: number;
  totalLiberadoHistorico: number;
};
