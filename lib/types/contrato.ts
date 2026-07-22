/** Logística estruturada — nunca via chat (filtro de contato). */
export type LogisticaContrato = {
  enderecoEntrega?: string;
  nomeNotaFiscal?: string;
  observacoes?: string;
};

export type OrigemContrato =
  | "negociacao"
  | "portfolio_direto"
  | "portfolio_chat";

/** Ciclo de entrega do serviço (contrato ou aditivo). */
export type StatusEntrega =
  | "pendente"
  | "entregue"
  | "ajuste_solicitado"
  | "aprovado"
  | "em_disputa";

export type DecisaoDisputa =
  | "liberado_influenciador"
  | "reembolsado_empresa";

/**
 * Reporte da empresa (não-entrega ou má-fé após ajustes).
 * Datas em ISO string (equivalentes a `Date` no domínio).
 */
export type DisputaEntrega = {
  motivo: string;
  /** Anexo/print local (mock blob/data URL). */
  evidencia?: string;
  reportadoEm: string;
  decisao?: DecisaoDisputa;
  decididoEm?: string;
};

/**
 * Campos de entrega compartilhados por `Contrato` e `Aditivo`.
 * Datas em ISO string (padrão do projeto; equivalentes a `Date` no domínio).
 */
export type CamposCicloEntrega = {
  statusEntrega: StatusEntrega;
  /** Marcada quando o influenciador registra (ou reenvia) a entrega. */
  dataEntrega?: string;
  /** 5 dias úteis a partir de `dataEntrega`; recalculada a cada reenvio. */
  prazoLiberacaoAutomatica?: string;
  /**
   * Quantas vezes a empresa já pediu ajuste.
   * Com `>= 2`, só resta aprovar, reportar problema ou aguardar liberação automática.
   */
  ciclosAjusteUsados: number;
  /** Texto livre da entrega — passa pelo filtro de contato. */
  descricaoEntrega?: string;
  /**
   * Link do conteúdo publicado — exceção: NÃO passa pelo filtro de contato
   * (pagamento já depositado; prova de entrega pode revelar o perfil).
   */
  linkComprovante?: string;
  /** Preview local do arquivo/print (mock blob/data URL). */
  arquivoComprovanteUrl?: string;
  /** Motivo do ajuste pedido pela empresa — passa pelo filtro de contato. */
  motivoAjuste?: string;
  /** Aberto quando a empresa reporta não-entrega ou má-fé. */
  disputa?: DisputaEntrega;
};

export function camposCicloEntregaIniciais(): CamposCicloEntrega {
  return {
    statusEntrega: "pendente",
    ciclosAjusteUsados: 0,
  };
}

/** Status canônicos do contrato (fonte: modelagem Publi). */
export const STATUS_CONTRATO = [
  "rascunho",
  "assinado",
  "em_andamento",
  "concluida",
  "cancelado",
  "em_disputa",
] as const;

export type StatusContrato = (typeof STATUS_CONTRATO)[number];

/** Contratos em que a empresa pode solicitar serviço adicional. */
export const STATUS_CONTRATO_PERMITE_ADITIVO: ReadonlySet<StatusContrato> =
  new Set<StatusContrato>(["em_andamento", "concluida"]);

export type Contrato = {
  id: string;
  matchId: string;
  valor: number;
  escopo: string;
  prazoEntrega: string;
  status: StatusContrato;
  dataAssinatura?: string;
  /** Pacote de origem quando a contratação veio do portfólio. */
  pacoteId?: string;
  /** Data ISO (`YYYY-MM-DD`) reservada na agenda do influenciador. */
  dataAgendada?: string;
  instrucoesAdicionais?: string;
  logistica?: LogisticaContrato;
  influenciadorId?: string;
  origem?: OrigemContrato;
} & CamposCicloEntrega;

/** Status do aditivo até depósito no pagamento retido. */
export type StatusAditivo = "proposto" | "aceito" | "ativo" | "cancelado";

/**
 * Escopo/valor extra negociado depois do contrato original.
 * Mesmo ciclo de entrega e itemização no pagamento retido.
 */
export type Aditivo = {
  id: string;
  contratoId: string;
  valor: number;
  escopo: string;
  /** Data combinada para a entrega deste aditivo (`YYYY-MM-DD` ou ISO). */
  prazoEntrega: string;
  criadoEm: string;
  status: StatusAditivo;
} & CamposCicloEntrega;

/** Item retido no pagamento retido — um por contrato base ou por aditivo. */
export type PagamentoRetidoItem = {
  id: string;
  origem: "contrato" | "aditivo";
  /** `contrato.id` ou `aditivo.id`, conforme `origem`. */
  referenciaId: string;
  valor: number;
  status: "retido" | "liberado" | "estornado" | "reembolsado";
};

/**
 * Conta de garantia do contrato: soma dos itens (contrato + aditivos).
 * O valor só vira saldo disponível para saque após liberação do item.
 */
export type PagamentoRetido = {
  id: string;
  contratoId: string;
  itens: PagamentoRetidoItem[];
};

export type Conversa = {
  id: string;
  contratoId: string;
};

/** Termos negociados no chat — card estruturado (não libera contato). */
export type PropostaContratacaoMensagem = {
  escopo: string;
  valor: number;
  dataAgendada?: string;
  pacoteId?: string;
  pacoteNome?: string;
};

export type Mensagem = {
  id: string;
  conversaId: string;
  remetenteId: string;
  texto: string;
  enviadoEm: string;
  flagContatoExterno: "nenhum" | "bloqueado_padrao" | "alerta_termo";
  propostaContratacao?: PropostaContratacaoMensagem;
};

export type Pagamento = {
  id: string;
  contratoId: string;
  valor: number;
  status: "retido" | "liberado" | "estornado" | "reembolsado";
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

/**
 * Registro histórico da prova de entrega (compatível com fluxo anterior).
 * O status canônico do ciclo fica em `Contrato`/`Aditivo.statusEntrega`.
 */
export type Entrega = {
  id: string;
  contratoId: string;
  /** Quando a prova é de um aditivo específico. */
  aditivoId?: string;
  linkComprovante: string;
  dataEntrega: string;
  descricao?: string;
  arquivoComprovanteUrl?: string;
  statusConfirmacao:
    | "aguardando"
    | "confirmada"
    | "confirmada_automaticamente"
    | "contestada";
};
