export type Contrato = {
  id: string;
  matchId: string;
  valor: number;
  escopo: string;
  prazoEntrega: string;
  status:
    | "rascunho"
    | "assinado"
    | "em_execucao"
    | "cumprido"
    | "cancelado"
    | "em_disputa";
  dataAssinatura?: string;
};

export type Conversa = {
  id: string;
  contratoId: string;
};

export type Mensagem = {
  id: string;
  conversaId: string;
  remetenteId: string;
  texto: string;
  enviadoEm: string;
  flagContatoExterno: "nenhum" | "bloqueado_padrao" | "alerta_termo";
};

export type Pagamento = {
  id: string;
  contratoId: string;
  valor: number;
  status: "retido" | "liberado" | "estornado";
};

/** RPA: gerado quando o influenciador é CPF sem CNPJ. A empresa é a tomadora
 * do serviço (responsável legal pela emissão/recolhimento) — este tipo
 * representa o cálculo assistido que a plataforma oferece como ferramenta. */
export type Rpa = {
  id: string;
  pagamentoId: string;
  empresaId: string;
  influenciadorId: string;
  municipioReferencia: string;
  valorBruto: number;
  inssRetido: number;
  irrfRetido: number;
  issRetido: number;
  valorLiquido: number;
  status: "calculado" | "confirmado_pela_empresa" | "recolhido";
};

export type Entrega = {
  id: string;
  contratoId: string;
  linkComprovante: string;
  dataEntrega: string;
  statusConfirmacao:
    | "aguardando"
    | "confirmada"
    | "confirmada_automaticamente"
    | "contestada";
};
